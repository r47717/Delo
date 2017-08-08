<?php

/************ VIEW functions ****************/

function delo_view($delo)
{
  $html = "";

  foreach ($delo as $item) {
    if ($item->parent_id != 0) {
      continue;
    }
    $number = "<span class='main-delo-number'>" . $item->delo_id . "</span>";
    $title = "<span class='main-delo-title'>" . $item->title . "</span>";
    $html .= "<a href='" . delo_url($item) . "'><div class='main-delo'>" . $number . $title . "</div></a>";
  }

  return $html;
}


function delo_view_single($delo, $page = 1, $task = null)
{
  $html = "";

  if(!isset($page)) { /// todo - check this out!
    $page = 1;
  }

  $p1_content = delo_get_p1_content($delo, $page);
  $p2_content = delo_get_p2_content($delo, $page, $task);

  $html .= "<div id='main-delo-open'>";

  if ($p2_content !== false) {
    $html .= "<div class='main-delo-open-p1'>";
  } else {
    $html .= "<div class='main-delo-open-p1-extended'>";
  }

  if (!is_numeric($page) || $page < 0 || $page > 5) {
    $page = 1;
  }

  $html .= drupal_render($p1_content);
  $html .= "</div>";

  if ($p2_content !== false) {
    $html .= "<div class='main-delo-open-p2'>";
    $html .= drupal_render($p2_content);
    $html .= "</div>";
  }

  $html .= "<div class='main-delo-open-p1-num'>" . (($page - 1)*2 + 1) . "</div>";
  $html .= "<div class='main-delo-open-p2-num'>" . (($page - 1)*2 + 2) . "</div>";
  $tabs = delo_get_tabs($delo, $page);
  $html .= drupal_render($tabs);
  $html .= "</div>"; // main-delo-open
  return $html;
}


function delo_get_tabs($delo, $page)
{
	$tabs['tabs'] = [
		'#type' => 'container',
		'#attributes' => [
			'class' => [
				'main-delo-tabs'
			],
		],
	];

	$title = "Главная";
	$classes = 'main-delo-tab ';
	if ($page == 1) {
		$classes .= 'main-delo-tab-active';
	}
	$tabs['tabs']['tab1'] = [
    '#markup' => l($title, "/delo/show/{$delo->delo_id}/1", [
      'attributes' => ['class' => $classes],
      'fragment' => 'title-anchor',
    ]), 
	];

	$title = "Задачи";
	$classes = ['main-delo-tab'];
	if ($page == 2) {
		$classes[] = 'main-delo-tab-active';
	}
	$tabs['tabs']['tab2'] = [
		'#markup' => l($title, "/delo/show/{$delo->delo_id}/2", [
      'attributes' => ['class' => $classes],
      'fragment' => 'title-anchor',
    ]),	
	];

	$title = "Участники";
	$classes = ['main-delo-tab'];
	if ($page == 3) {
		$classes[] = 'main-delo-tab-active';
	}
	$tabs['tabs']['tab3'] = [
    '#markup' => l($title, "/delo/show/{$delo->delo_id}/3", [
      'attributes' => ['class' => $classes],
      'fragment' => 'title-anchor',
    ]), 
	];

	$title = "Файлы";
	$classes = ['main-delo-tab'];
	if ($page == 4) {
		$classes[] = 'main-delo-tab-active';
	}
	$tabs['tabs']['tab4'] = [
    '#markup' => l($title, "/delo/show/{$delo->delo_id}/4", [
      'attributes' => ['class' => $classes],
      'fragment' => 'title-anchor',
    ]), 
	];

	return $tabs;
}


function delo_get_p1_content($delo, $page)
{
  switch ($page) {
    case 1:
      $ret = delo_edit_content($delo);
      break;
    case 2:
      $ret = delo_tasks_content($delo);
      break;
    case 3:
      $ret = delo_participants_content($delo);
      break;
    case 4:
      $ret = delo_empty_content();
      break;
    default:
      $ret = "";
      break;      
  }

  return $ret;
}


function delo_get_p2_content($delo, $page, $task)
{
  switch ($page) {
    case 1:
      $ret = delo_summary_content($delo);
      break;
    case 2:
      $ret = false; //delo_task_content($delo, $task);
      break;
    case 3:
      $ret = delo_empty_content();
      break;
    case 4:
      $ret = delo_empty_content();
      break;    
  }

  return $ret;
}


/* content providers */

function delo_empty_content()
{
	$content['title'] = [
    	'#markup' => "<p>Пока ничего нет</p>",
  	];

  	return $content;
}


function delo_edit_content($delo)
{
  $content['caption'] = [
    '#markup' => '<h3>Общая информация</h3>',
  ];

  $content['form'] = drupal_get_form('delo_edit_form', $delo->delo_id);

  $content['put-on-shelf'] = [
    '#markup' => l('Положить на полку', '/delo/put-on-shelf/' . $delo->delo_id, [
      'attributes' => [
        'class' => ['btn btn-info'],
      ],
    ]),
  ];

  $content['delete'] = [
    '#markup' => l('Удалить', '/delo/delete/' . $delo->delo_id, [
      'attributes' => [
        'class' => ['btn btn-danger'],
      ],
    ]),
  ];

  return $content;
}


function delo_summary_content($delo)
{
  $owner = user_load($delo->user_id);
  $children = delo_get_children($delo);
  $participants = team_get_participants_for_delo($delo);

  $content['owner'] = [
    "#markup" => '<p>'. 'Владелец: ' . $owner->name . '</p>',
  ];

  $content['created'] = [
    "#markup" => '<p>'. 'Дата создания: ' . $delo->created . '</p>',
  ];

  $content['modified'] = [
    "#markup" => '<p>'. 'Дата изменения: ' . $delo->updated . '</p>',
  ];

  $content['tasks'] = [
    "#markup" => '<p>'. 'Всего задач: ' . l(count($children), '/delo/show/' . $delo->delo_id . "/2") . '</p>',
  ];

  $content['participants'] = [
    "#markup" => '<p>'. 'Всего участников: ' . l(count($participants), '/delo/show/' . $delo->delo_id . "/3") . '</p>',
  ];

  $content['files'] = [
    "#markup" => '<p>'. 'Всего файлов: ' . l(0, '#') . '</p>',
  ];

  return $content;
}


function delo_tasks_content($delo)
{
  $tasks = delo_get_children($delo);
  if (empty($tasks)) {
    $content['tasks'] = [
      '#markup' => "<p>Задач пока нет</p>",
    ];
  } else {
    
    $content['canvas'] = [
      '#markup' => "<canvas id='tasks-canvas'></canvas>",
    ];
  }

  $content['new-task'] = [
    '#type' => 'container',
    '#attributes' => [
      'id' => 'new-dialog',
      'title' => 'Новая задача',
    ],
  ];

  $redirect = "/delo/show/{$delo->delo_id}/2";
  $content['new-task']['dialog'] = drupal_get_form('delo_create_form', $delo, $redirect);

  $content['new-task-button'] = [
    '#markup' => "<button id='new-task-opener'>Новая задача</button>",
  ];

/*  $content['edit-task'] = [
    '#type' => 'container',
    '#attributes' => [
      'id' => 'edit-dialog',
      'title' => 'Редактировать задачу',
    ],
  ];

  $content['edit-task']['dialog'] = drupal_get_form('delo_edit_form', $delo->delo_id);
*/

  return $content;
}


function delo_tasks_content2($delo)
{
  $tasks = delo_get_children($delo);
  if (empty($tasks)) {
    $content['tasks'] = [
      '#markup' => "<p>Задач пока нет</p>",
    ];
  } else {
    
    $header = [
      'Название',
      'Статус',
      'Прогресс',
      'Ответственный',
      'Действия',
    ];

    $rows = [];

    $actions = 'tbd';

    foreach ($tasks as $task) {
      $row = [
        "<div class='edit-task-link' title='редактировать' onclick='$(\"#edit-dialog\").dialog(\"open\")'>{$task->title}</div>",
        delo_status_get_name($task),
        delo_progress_get($task),
        'tbd',
        $actions,
      ];
      $rows[] = $row;
    }

    $content['tasks'] = [
      '#markup' => theme('table', [
        'header' => $header,
        'rows' => $rows,
      ]),
    ];
  }

/*  $content['canvas'] = [
    '#markup' => "<canvas id='tasks-canvas'></canvas>",
  ];
*/
  $content['new-task'] = [
    '#type' => 'container',
    '#attributes' => [
      'id' => 'new-dialog',
      'title' => 'Новая задача',
    ],
  ];

  $redirect = "/delo/show/{$delo->delo_id}/2";
  $content['new-task']['dialog'] = drupal_get_form('delo_create_form', $delo, $redirect);

  $content['new-task-button'] = [
    '#markup' => "<button id='new-task-opener'>Новая задача</button>",
  ];

  $content['edit-task'] = [
    '#type' => 'container',
    '#attributes' => [
      'id' => 'edit-dialog',
      'title' => 'Редактировать задачу',
    ],
  ];

  $content['edit-task']['dialog'] = drupal_get_form('delo_edit_form', $delo->delo_id);


  return $content;
}


function delo_task_content($delo, $task)
{
  if (!$task || !is_numeric($task)) {
    $content['task'] = [
      '#markup' => '<p>Выберите задачу из списка</p>',
    ];
  } else {
    $task = delo_load([$task]);
    if ($task) {
      $task = reset($task);
      $content['task'] = drupal_get_form('delo_edit_form', $task->delo_id);

      $content['delete'] = [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['red-button'],
        ],
      ];
      $content['delete']['link'] = [
        '#markup' => l('Удалить', '/delo/delete/' . $task->delo_id),
      ];

    } else {
      $content['task'] = [
        '#markup' => '<p>Не могу загрузить задачу, попробуйте еще раз</p>',
      ];
    }
  }

  return $content;
}


function delo_participants_content($delo)
{
  $content['header'] = [
    '#markup' => '<p>Участники дела</p>',
  ];

  $owner_id = $delo->user_id;
  $owner = user_load($owner_id);
  $content['owner'] = [
    '#markup' => "<p>Владелец: {$owner->name}</p>",
  ];

  $participants = $delo->getParticipants();
  if (count($participants) == 0) {
    $content['participants'] = [
      '#markup' => "<p>Других участников пока нет",
    ];
  } else {
    $content['participants'] = drupal_get_form('delo_participants_form', $delo);
  }

  return $content;
}


function delo_files_content($delo)
{

}

