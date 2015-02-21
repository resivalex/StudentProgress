<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Добавить занятие"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_lesson.php");
	$body->appendChild($form);
	
	$content = array();
	$content[0] = array("№", "Дисциплина", "Группа", "Преподаватель", "");
	
	if (isset($_POST["remove_id"]) && $_POST["remove_id"]) {
		delete_lesson($_POST["remove_id"]);
	} else if (isset($_POST["subject_id"])) {
		add_lesson($_POST["subject_id"], $_POST["group_id"], $_POST["teacher_id"]);
	}
	$result = get_id_subjectname_groupname_surname_name_patronymic_from_lessons();
	for ($i = 1; $i <= count($result["id"]); $i++) {
		$id = $result["id"][$i - 1];
		$subject_name = $result["subject_name"][$i - 1];
		$group_name = $result["group_name"][$i - 1];
		$surname = $result["surname"][$i - 1];
		$name = $result["name"][$i - 1];
		$patronymic = $result["patronymic"][$i - 1];
		$content[$i] = array($i, $subject_name, $group_name, "$surname $name $patronymic");
		$button = $document->createElement("input");
		$button->setAttribute("type", "button");
		$button->setAttribute("value", "Удалить");
		$button->setAttribute("onclick", "submit_remove_id_value('$id')");
		$content[$i][4] = $button;
	}
	$content[$i][0] = "";
	$content[$i][1] = select_subject();
	$content[$i][2] = select_group();
	$content[$i][3] = select_teacher();
	$content[$i][4] = submit($document, "Добавить");
	$table = custom_grid_table($content);
	$form->appendChild($table);
	
	$hidden = hidden("remove_id", "");
	$hidden->setAttribute("id", "remove_id");
	$form->appendChild($hidden);
	
	echo $document->saveHTML();
?>
