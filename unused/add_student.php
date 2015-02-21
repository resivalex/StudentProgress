<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Добавить студента");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_student.php");
	$body->appendChild($form);
		
	$text = array("Фамилия", "Имя", "Отчество", "Группа");
	$input = array();
	$input[] = input_text($document, "surname");
	$input[] = input_text($document, "name");
	$input[] = input_text($document, "patronymic");
	$input[] = select_group($document);
	$table = input_form($document, "Введите информацию о студенте", $text, $input, "Добавить студента");
	$form->appendChild($table);
	
	if (isset($_POST['name'])) {
		$surname = $_POST['surname'];
		$name = $_POST['name'];
		$patronymic = $_POST['patronymic'];
		$group_id = $_POST['group_id'];
		$query = "INSERT INTO students (surname, name, patronymic, group_id) VALUES ('$surname', '$name', '$patronymic', '$group_id')";
		mysql_query($query); 
	}
	
	echo $document->saveHTML();
?>

