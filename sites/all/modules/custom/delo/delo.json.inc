<?php


function delo_get_tasks($delo_id)
{
  $delo = delo_load(false, [
    'parent_id' => $delo_id,
  ]);

  $output = [];

  foreach ($delo as $id => $item) {
    $output[] = [
      'id' => $id,
      'title' => $item->title,
      'description' => $item->description,
      'status' => delo_status_get_name($item),
    ];
  }

  drupal_json_output($output);
}


/**
 * Ajax callback - called from delo edit form when status select is changed
 */
function delo_ajax_change_progress_callback($form, &$form_state)
{
  if (isset($form_state['values']['field_delo_status']) && $form_state['values']['field_delo_status'] == 0) {
    $form['field_delo_progress']['#value'] = "100";
  } else {
    $form['field_delo_progress']['#value'] = $form_state['values']['field_delo_progress'];
  }

  return $form['field_delo_progress'];
}


function delo_ajax_change_progress_callback2($form, &$form_state)
{
  $commends = [];
  $commands[] = ajax_command_replace("#field-delo-progress", drupal_render($form['field_delo_progress']));

  return [
    '#type' => 'ajax',
    '#commands' => $commands,
  ];
}