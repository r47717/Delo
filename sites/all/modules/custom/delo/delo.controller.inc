<?php

class DeloEntityController extends EntityAPIController
{
  public function load($ids = [], $conditions = []) {
    if (empty($ids)) {
      $entities = db_select('delo', 'd')->fields('d')->execute()->fetchAssoc(); // TODO - rework
    } else {
      $entities = parent::load($ids, $conditions);
    }
    
    return $entities;
  }


  public function get_default_values() {
    global $user;

    $values = [];

    if ($user) {
      $values['user_id'] = $user->uid;
      $values['parent_id'] = null;
      $values['title'] = t("Новое дело");
      $values['description'] = t("Для этого дела нет еще описания");
      $values['created'] = time();
      $values['updated'] = $values['created'];
      $values['closed'] = 0;
      $values['data'] = null;
    }

    return $values;
  }


  public function create(array $record = []) {
    $record += $this->get_default_values();

    /*
    $res = drupal_write_record('delo', $record);
    if ($res !== SAVED_NEW) {
      watchdog('error', 'Cannot create new Delo in DeloController');
      return $res;
    }

    return $record;
    */

    return parent::create($record);
  }
  

  public function update($entity) {
    $res = drupal_write_record('delo', $entity, 'delo_id');
    if ($res !== SAVED_UPDATED) {
      watchdog('error', 'Cannot update Delo in DeloController');
      return false;
    }

    return true;
  }

}