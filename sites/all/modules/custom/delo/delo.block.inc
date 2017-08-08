<?php


/*
 * Implements hook_block_info
 */
function delo_block_info()
{
	$blocks['delo_block_actions'] = [
		'info' => t('Действия с делами'),
	];

	$blocks['delo_block_progress'] = [
		'info' => t('Прогресс по делам'),
	];

	$blocks['delo_block_shelf'] = [
		'info' => t('Моя полка'),
	];

	$blocks['delo_block_archive'] = [
		'info' => t('Мой архив'),
	];

	return $blocks;
}


/*
 * Implements hook_block_view
 */
function delo_block_view($delta)
{
	$block = [];

	switch ($delta) {
		case 'delo_block_actions':
			$block['content'] = delo_build_block_actions();
			break;
		case 'delo_block_progress':
			$block['content'] = delo_build_block_progress();
			break;
		case 'delo_block_shelf':
			$block['content'] = delo_build_block_shelf();
			break;
		case 'delo_block_archive':
			$block['content'] = delo_build_block_archive();
			break;
	}

	return $block;
}


function delo_build_block_actions()
{
	$block['delo_show_all'] = [
		"#markup" => "<div class='green-button'>" . l(t("Мои дела"), "/delo/show") . "</div>",
	];

	$block['delo_put_on_shelf_all'] = [
		"#markup" => "<div class='green-button'>" . l(t("Все на полку"), "/delo/put-on-shelf-all") . "</div>",
	];

	$block['delo_new'] = [
		"#markup" => "<div class='green-button'>" . l(t("Новое дело"), "/delo/new") . "</div>",
	];

	return $block;
}


function delo_build_block_progress()
{
	$delo = delo_load_main();

	$i = 0;
	foreach ($delo as $item) {
		$progress = delo_progress_get($item);
		$block['item ' . $i++] = [
			"#markup" => "<div>" . $item->title . " (" . $progress . "%)</div>",
		];
	}

	return $block;
}


function delo_build_block_shelf()
{
	
	if (!isset($_SESSION['shelf'])) {
		$_SESSION['shelf'] = [];
	}
	$delo_on_shelf = $_SESSION['shelf'];

	$shelf_items = "<div class='delo-shelf-items'>";
	foreach ($delo_on_shelf as $delo_id) {
		$delo = delo_load([$delo_id]);
		if (empty($delo)) {
			continue;
		}
		$delo = reset($delo);
		$item = "<a href='/delo/take-from-shelf/{$delo->delo_id}'><div class='delo-shelf-item' title='{$delo->title}'><span>" . $delo->delo_id . "</span></div></a>";
		$shelf_items .= $item;
	}
	$shelf_items .= "</div>";

	$block['shelf'] = [
		'#markup' => "<div class='delo-shelf'>" . $shelf_items . "</div>",
	];

	return $block;
}


function delo_build_block_archive()
{
	$block['archive'] = [
		'#markup' => "<div class='delo-archive'></div>",
	];

	return $block;
}