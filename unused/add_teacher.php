<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Добавить преподавателя"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_teacher.php");
	$body->appendChild($form);
	
	if (isset($_POST["remove_id"]) && $_POST["remove_id"] != null) {
		delete_teacher($_POST["remove_id"]);
	} else if (isset($_POST["step"]) && $_POST["step"] == "input_teacher") {
		add_teacher($_POST["teacher_surname"], $_POST["teacher_name"], $_POST["teacher_patronymic"]);
	}
	
	$content = array();
	$content[0] = array("№", "Фамилия", "Имя", "Отчество", "");
	$smth = get_id_surname_name_patronymic_from_teachers();
	$smth->bind_result($id, $surname, $name, $patronymic);
	for ($i = 1; $row = $smth->fetch(); $i++) {
		$content[$i] = array($i, $surname, $name, $patronymic);
		$button = $document->createElement("input");
		$button->setAttribute("type", "button");
		$button->setAttribute("value", "Удалить");
		$button->setAttribute("onclick", "submit_remove_id_value('$id')");
		$content[$i][4] = $button;
	}
	$hidden = hidden("remove_id", "");
	$hidden->setAttribute("id", "remove_id");
	$form->appendChild($hidden);
	$content[$i][0] = "";
	$content[$i][1] = input_text($document, "teacher_surname");
	$content[$i][2] = input_text($document, "teacher_name");
	$content[$i][3] = input_text($document, "teacher_patronymic");
	$content[$i][4] = submit($document, "Добавить");
	$table = custom_grid_table($content);
	$form->appendChild($table);
	$form->appendChild(hidden("step", "input_teacher"));
	
	echo $document->saveHTML();
?>