<?php

/********* field functions *********/

/*
7 Выполнено
5 Выполняется
4 Новое дело
8 Отменено
6 Приостановлено
*/


function delo_status_set_default($delo)
{
  delo_status_set_by_name($delo, t("Новое дело"));
}


function delo_status_get_tid_by_name($name)
{
  $terms = taxonomy_get_term_by_name($name);
  $term = reset($terms);
  return !is_null($term) ? $term->tid : null;
}


function delo_status_get_name_by_tid($tid)
{
  $term = taxonomy_term_load($tid);
  return $term ? $term->name : null;
}


function delo_status_get_name_list()
{
  $names = [];
  $vocab = taxonomy_vocabulary_machine_name_load('delo_status_vocab');
  foreach (taxonomy_get_tree($vocab->vid) as $term) {
    $names[] = $term->name;
  }

  return $names;
}


function delo_status_get_tid_list()
{
  $tids = [];
  $vocab = taxonomy_vocabulary_machine_name_load('delo_status_vocab');
  foreach (taxonomy_get_tree($vocab->vid) as $term) {
    $tids[] = $term->tid;
  }

  return $tids;
}


function delo_status_get_name($delo)
{
  if (isset($delo->field_delo_status['und'])) {
    $tid = $delo->field_delo_status['und'][0]['tid'];
    return delo_status_get_name_by_tid($tid);
  } else {
    watchdog('status field', "<pre>" . print_r($delo, true) . "</pre>");
  }

  return null;
}


function delo_status_get_tid($delo, $tid)
{
  return isset($delo->field_delo_status['und']) ? $delo->field_delo_status['und'][0]['tid'] : null;
}


function delo_status_set_by_name($delo, $name)
{
  $tid = delo_status_get_tid_by_name($name);
  delo_status_set_by_tid($delo, $tid);
}


function delo_status_set_by_tid($delo, $tid)
{
  $delo->field_delo_status = [
    'und' => [
      '0' => [
        'tid' => $tid,
      ]
    ]
  ];
}


function delo_progress_get($delo)
{
  $emw = entity_metadata_wrapper('delo', $delo);
  $value = $emw->field_delo_progress->value();
  return isset($value) ? $value : 0;
}


function delo_progress_set($delo, $value)
{
  if (is_numeric($value) && $value >= 0 && $value <= 100) {
    $emw = entity_metadata_wrapper('delo', $delo);
    $emw->field_delo_progress->set($value);
    $emw->save();
  } else {
    watchdog("delo", "attempt to set incorrect progress value: '" . print_r($value, true) . "'");
  }
}


function delo_progress_render($delo)
{
  $html = "<div class='delo-progress'>";
  for($i = 0; $i < 10; $i++) {
    $html .= "<span></span>";
  }
  $html .= "</div>";

  return $html;
}

/* priority */

function delo_priority_get($delo)
{
  $w = entity_metadata_wrapper('delo', $delo);
  return $w->field_delo_priority->value();
}


function delo_priority_set($delo, $priority)
{
  $w = entity_metadata_wrapper('delo', $delo);
  $w->field_delo_priority->set($priority);
}


function delo_priority_get_list()
{
  return [
    '1', '2', '3', '4', '5',
  ];
}


function delo_priority_get_default()
{
  return 3;
}


/* estimate */

function delo_estimate_get($delo)
{
  $w = entity_metadata_wrapper('delo', $delo);
  return $w->field_delo_estimate->value();
}


function delo_estimate_set($delo, $estimate)
{
  $w = entity_metadata_wrapper('delo', $delo);
  $w->field_delo_estimate->set($estimate);
}

/* assignee */

function delo_assignee_get($delo)
{
  $w = entity_metadata_wrapper('delo', $delo);
  return $w->field_delo_estimate->value();
}


function delo_assignee_set($delo, $assignee)
{
  $w = entity_metadata_wrapper('delo', $delo);
  $w->field_delo_assignee->set($assignee);
}

