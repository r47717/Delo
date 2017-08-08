<?php

/*------ new delo create form ------*/

function delo_create_form($form, &$form_state, $parent = NULL, $redirect = NULL)
{
  $form_state['parent'] = $parent;

  $form['title'] = [
    '#title' => t('Название'),
    '#type' => 'textfield',
    '#attributes' => [
      'id' => 'new-task-title',
    ],
    //'#required' => true,
  ];

  $form['description'] = [
    '#title' => t('Описание'),
    '#type' => 'textarea',
    '#rows' => 5,
    '#resizable' => false,
    '#attributes' => [
      'id' => 'new-task-description',
    ],
    //'#required' => true,
  ];

  $form['submit'] = [
    '#type' => 'submit',
    '#value' => t('Создать'),
    '#name' => "Create",
    '#attributes' => [
      'id' => 'new-task-submit',
    ],
  ];

  $form['cancel'] = [
    '#type' => 'submit',
    '#value' => t('Отменить'),
    '#name' => "Cancel",
    '#attributes' => [
      'id' => 'new-task-cancel',
    ],
    '#submit' => ['delo_create_form_submit_cancel'],
  ];

  $form_state['redirect'] = 
    $redirect 
      ? $redirect 
      : ($parent 
          ? ("/delo/show/" . $parent)
          : ("/delo/show"));

  return $form;
}


function delo_create_form_validate($form, &$form_state)
{
}


function delo_create_form_submit($form, &$form_state)
{
  $record['title'] = $form_state['input']['title'];
  $record['description'] = $form_state['input']['description'];
  $parent_id = isset($form_state['parent']) ? $form_state['parent']->delo_id : null;
  $record['parent_id'] = $parent_id;
  //drupal_set_message(print_r($form_state['parent'], TRUE));

  $result = delo_create($record);
  if ($result) {
    drupal_set_message("Добавили дело '" . $record['title'] . "'");
  } else {
    drupal_set_message(t("Не получилось создать новое дело"), "error");
  }
}

function delo_create_form_submit_cancel($form, &$form_state)
{
}


/*------ delo edit form ------*/

function delo_edit_form($form, &$form_state, $delo_id)
{
  $delo = delo_load($delo_id);
  if (empty($delo)) {
    drupal_not_found();
    return;
  }
  $delo = reset($delo);
  
  $form['title'] = [
    '#title' => t('Название'),
    '#type' => 'textfield',
    '#default_value' => $delo->title,
    '#required' => true,
  ];

  $form['description'] = [
    '#title' => t('Описание'),
    '#type' => 'textarea',
    '#rows' => 5,
    '#resizable' => false,
    '#default_value' => $delo->description,
    '#required' => true,
  ];

  $status_options = delo_status_get_name_list();
  $default_value = reset($status_options);
  if (!empty($delo->field_delo_status)) {
    $default_value = delo_status_get_name_by_tid($delo->field_delo_status['und']['0']['tid']);
    $default_value = array_search($default_value, $status_options); // index in array
  }

  $form['field_delo_status'] = [
    '#title' => t('Состояние'),
    '#type' => 'select',
    '#options' => $status_options,
    '#default_value' => $default_value,
    '#ajax' => [
      'callback' => 'delo_ajax_change_progress_callback',
      'wrapper' => 'field-delo-progress',
    ],
  ];

  $form['field_delo_progress'] = [
    '#title' => "% выполнения",
    '#type' => "textfield",
    '#default_value' => delo_progress_get($delo),
    '#required' => TRUE,
    '#prefix' => "<div id='field-delo-progress'>",
    '#suffix' => "</div>",
  ];

  $form['save'] = [
    '#type' => 'submit',
    '#name' => 'Save',
    '#value' => t('Сохранить'),
    '#attributes' => [
      'class' => [
        'btn btn-success',
      ],
    ],
  ];

  return $form;
}


function delo_edit_form_validate($form, &$form_state)
{
  if (empty(trim($form_state['input']['title']))) {
    form_set_error('title', "Заголовок дела не должен быть пустым");
  }

  if (empty(trim($form_state['input']['description']))) {
    form_set_error('title', "Описание дела не должно быть пустым");
  }

  $progress = $form_state['input']['field_delo_progress'];
  if (!is_numeric($progress) || intval($progress) > 100 || intval($progress) < 0) {
    form_set_error('field_delo_progress', "Неверный процент выполнения (годится целое от 0 до 100)");
  }
}


function delo_edit_form_submit($form, &$form_state)
{
  if ($form_state['triggering_element']['#name'] == "Save") {
    $delo_id = $form_state['build_info']['args'][0];
    $delo = delo_load($delo_id);
    $delo = reset($delo);
    $delo->title = $form_state['input']['title'];
    $delo->description = $form_state['input']['description'];

    $status_ind = $form_state['input']['field_delo_status'];
    $vocab = taxonomy_vocabulary_machine_name_load('delo_status_vocab');
    $terms = taxonomy_get_tree($vocab->vid);

    $term_id = $terms[$status_ind]->tid;
    delo_status_set_by_tid($delo, $term_id);

    delo_progress_set($delo, $form_state['input']['field_delo_progress']);

    if (delo_update($delo)) {
      drupal_set_message(t('Дело сохранено'));
    } else {
      drupal_set_message(t('Не могу сохранить дело', 'error'));
    }

    drupal_goto('/delo/show/' . $delo_id);
  }
}

/*------ delete form ------*/

function delo_delete_form($form, &$form_state)
{
  $form['label'] = [
    '#type' => 'markup',
    '#markup' => t('Действительно удалить? Жалеть не будете?'),
  ];

  $form['OK'] = [
    '#type' => 'submit',
    '#name' => 'OK',
    '#value' => t('Да, удалить'),
  ];

  $form['Cancel'] = [
    '#type' => 'submit',
    '#name' => 'Cancel',
    '#value' => t('Нет, не надо'),
  ];

  return $form;
}


function delo_delete_form_submit($form, &$form_state)
{
  if ($form_state['triggering_element']['#name'] == "OK") {
    $delo_id = $form_state['build_info']['args'][0];
    $delo = delo_load($delo_id);
    $delo = reset($delo);
    if (delo_delete($delo)) {
      drupal_set_message("Удалили дело '" . $delo->title . "'");
    } else {
      drupal_set_message("Что-то не могу удалить дело '" . $delo->title . "'");
    }
    
  }

  drupal_goto("/delo/show");
}


/*------ edit participants form ------*/

function delo_participants_form($form, &$form_state, $delo)
{
  $form['title'] = [
    '#markup' => "<p>Участники дела</p>",
  ];

  $participants = $delo->getParticipants();
  $header = [
    'Имя',
    'Роль',
    'Действия',
  ];

  $rows = [];
  foreach ($participants as $participant) {
    $row[] = "";
    $rows[] = $row;
  }

  $form['participants'] = theme('table', [
    'header' => $header,
    'rows' => $rows,
  ]);

  $form['new'] = [
    '#type' => 'container',
  ];

  $form['new']['add-button'] = [
    '#type' => 'submit',
    '#title' => 'Добавить',
  ];



  return $form;
}

function delo_participants_form_validate($form, &$form_state) 
{

}

function delo_participants_form_submit($form, &$form_state) 
{

}

/* delo add new participant form */


function delo_add_new_participant_form($form, &$form_state)
{
  $form['name'] = [
    '#type' => 'textfield',
    '#name' => 'name',
    '#required' => true,
  ];

  $form['type'] = [
    '#type' => 'select',
    '#name' => 'type',
    '#options' => team_type_list(),
  ];

  $form['add-button'] = [
    '#type' => 'submit',
    '#name' => 'submit',
    '#value' => 'Добавить',
  ];

  return $form;
}


function delo_add_new_participant_form_validate($form, &$form_state)
{
} 


function delo_add_new_participant_form_submit($form, &$form_state)
{
  $delo_id = $form_state['build_info']['args'][0];
  $name = $form_state['input']['name'];
  $delo = reset(delo_load($delo_id));
  $participant = user_load_by_name($name);
  team_add_participant($delo, $participant);
} 