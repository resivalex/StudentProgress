<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Добавить группу");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_group.php");
	$body->appendChild($form);
	
	$text = array("Название", "Курс");
	$input = array();
	$input[] = input_text($document, "name");
	$input[] = select_course($document);
	$table = input_form($document, "Введите информацию о группе", $text, $input, "Добавить группу");
	$form->appendChild($table);
		
	if (isset($_POST['name'])) {
		add_group($sql, $_POST["name"], $_POST["course_number"]);
	}
	
	echo $document->saveHTML();
?>

