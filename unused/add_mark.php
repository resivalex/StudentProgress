<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Добавить отметку");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_mark.php");
	$body->appendChild($form);
		
	$text = array("Студент", "Занятие", "Отметка");
	$input = array();
	$input[] = select_student($document);
	$input[] = select_teaching($document);
	$input[] = select_mark_type($document);
	$table = input_form($document, "Введите информацию об отметку", $text, $input, "Добавить отметку");
	$form->appendChild($table);
			
	if (isset($_POST['student_id'])) {
		$student_id = $_POST['student_id'];
		$teaching_id = $_POST['teaching_id'];
		$mark_type_id = $_POST['mark_type_id'];
		$query = "INSERT INTO marks (student_id, teaching_id, mark_type_id) VALUES ('$student_id', '$teaching_id', '$mark_type_id')";
		mysql_query($query);
	}
	
	echo $document->saveHTML();
?>