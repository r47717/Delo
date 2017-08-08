<?php

function list_entities()
{
	$entities = "<pre>" . print_r(entity_get_info(), true) . "</pre>";
	echo $entities;
}


function mydebug($item, $die = false)
{
	echo "<pre>";
	echo print_r($item, true);
	echo "</pre>";
	if ($die) {
		die();
	}
}


function r47717_preprocess_page(&$vars)
{
	$vars['site_slogan'] = get_slogan();

	$path = current_path();

	$matches = [];
	if (preg_match('/^delo\/(show|edit)\/(\d+)/', $path, $matches) === 1) {
		$delo_id = $matches[2];
		$delo = delo_load([$delo_id]);
		$delo = reset($delo);
		drupal_set_title(t("Дело №") . $matches[2] . ": " . $delo->title);
	}

	switch (current_path()) {
		case '/':
		case 'delo/show':
			drupal_set_title(t("Мои дела"));
			break;
		case 'delo/new':
			drupal_set_title(t("Новое дело"));
			break;
	}

	drupal_add_js('misc/ui/jquery.ui.widget.min.js');
	drupal_add_js('misc/ui/jquery.ui.position.min.js');
	drupal_add_js('misc/ui/jquery.ui.mouse.min.js');
	drupal_add_js('misc/ui/jquery.ui.draggable.min.js');
	drupal_add_js('misc/ui/jquery.ui.droppable.min.js');
	drupal_add_js('misc/ui/jquery.ui.dialog.min.js');
	drupal_add_css('misc/ui/jquery.ui.dialog.css');
}

function test()
{
  global $user;

  $delos = delo_load([15, 20, 25, 21, 22]);

  foreach ($delos as $delo) {
	  $res = team_add_participant($delo, $user, 5);
  }
  
  //$res = team_is_participant($delo, $user);
  //team_change_type($delo, $user, 10);
  //$res = team_get_delo_of_participant($user);
  team_remove_participant_everywhere($user);

  //watchdog('team test', print_r($res, true));
}



function r47717_table($vars)
{
	$header = $vars['header'];
	$rows = $vars['rows'];
	$html = "<table>";
	
	$html .= "<thead>";
	$html .= "<tr>";
	foreach ($header as $item) {
		$html .= "<th>$item</th>";
	}
	$html .= "</tr>";
	$html .= "</thead>";

	$html .= "<tbody>";
	foreach ($rows as $row) {
		$html .= "<tr>";
		foreach ($row as $item)	{
			$html .= "<td>$item</td>";
		}
		$html .= "</tr>";
	}
	$html .= "</tbody>";


	$html .= "</table>";

	return $html;
}


/* multistep form */

function my_sample_form($form, &$form_state)
{
	$page = isset($form_state['storage']['settings-pages']) ? $form_state['storage']['settings-pages'] : 1;
	if (!in_array($page, [1, 2, 3])) {
		return false;
	}

	$form['content'] = [
		'#type' => 'container',
		'#id' => 'settings-form-page',
	];

	$form['content']['title']['#markup'] = "Страница $page";
	
	$page_func = "settings_form_page" . $page;
	$form['content']['page'] = $page_func();

	$form['content']['buttons'] = [
		'#type' => 'container',
	];
	if ($page > 1) {
		$form['content']['buttons']['prev'] = [
			'#type' => 'submit',
			'#value' => 'Назад',
			'#name' => 'prev',
			'#ajax' => [
				'wrapper' => 'settings-form-page',
				'callback' => 'click_prev',
			],
		];
	}
	$form['content']['buttons']['next'] = [
		'#type' => 'submit',
		'#value' => ($page == 3) ? 'Отправить' : 'Дальше',
		'#name' => 'next',
		'#ajax' => [
			'wrapper' => 'settings-form-page',
			'callback' => 'click_next',
		],
	];

	watchdog('my form', "<pre>" . print_r($form_state, true) . "</pre>");

	return $form;
}

function my_sample_form_submit($form, &$form_state)
{
	$page = isset($form_state['storage']['settings-pages']) ? $form_state['storage']['settings-pages'] : 1;
	if ($form_state['triggering_element']['#name'] == 'next') {
		if ($page == 3) {

		} else {
			$form_state['storage']['settings-pages'] = $page + 1;
		}
	} else {
		if ($page == 1) {

		} else {
			$form_state['storage']['settings-pages'] = $page - 1;
		}
	}

	$form_state['rebuild'] = true;
}

function click_next($form, &$form_state)
{
	return $form['content'];
}

function click_prev($form, &$form_state)
{
	return $form['content'];
}

function settings_form_page1()
{
	$items['radios'] = [
		'#type' => 'radios',
		'#options' => [
			'1' => 'Вариант 1',
			'2' => 'Вариант 2',
			'3' => 'Вариант 3',
		],
		'#default_value' => '1',
		'#ajax' => [
			'wrapper' => 'page1-selection',
			'callback' => 'page1_selection_ajax'
		],
	];

	$items['selection'] = [
		'#type' => 'textfield',
		'#value' => 'Ничего не выбрано',
		'#id' => 'page1-selection',
	];

	return $items;
}


function page1_selection_ajax($form, &$form_state)
{
	$val = $form_state['values']['radios'];
	$form['content']['page']['selection'] = [
		'#type' => 'textfield',
		'#value' => $val,
		'#id' => 'page1-selection',
	];

	$commands[] = ajax_command_replace('#page1-selection', drupal_render($form['content']['page']['selection']));
	$commands[] = ajax_command_invoke('#page1-selection', 'css', ['background', 'red']);
	$commands[] = ajax_command_alert("Значение изменено");

	return [
		'#type' => 'ajax',
		'#commands' => $commands,
	];
}

function settings_form_page2()
{
	return [
		'#type' => 'checkbox',
		'#title' => 'Поужинать',
		'#default_value' => true,
	];
}

function settings_form_page3()
{
	return [
		'#markup' => 'Последняя страница',
	];
}

