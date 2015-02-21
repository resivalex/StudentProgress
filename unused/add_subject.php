<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Добавить дисциплину"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_subject.php");
	$body->appendChild($form);
	
	if (isset($_POST["remove_id"]) && $_POST["remove_id"] != null) {
		if (count_lessons_in_subject($_POST["remove_id"]) > 0) {
			$script = $document->createElement("script", "cant_remove_subject()");
			$body->appendChild($script);
		} else {
			delete_subject($_POST["remove_id"]);
		}
	} else if (isset($_POST["step"]) && $_POST["step"] == "input_subject") {
		add_subject($_POST["subject_name"]);
	}
	
	$content = array();
	$content[0] = array("№", "Название", "");
	$result = get_id_name_from_subjects();
	for ($i = 1; $i <= count($result["id"]); $i++) {
		$id = $result["id"][$i - 1];
		$name = $result["name"][$i - 1];
		$content[$i] = array($i, $name);
		$button = $document->createElement("input");
		$button->setAttribute("type", "button");
		$button->setAttribute("value", "Удалить");
		$button->setAttribute("onclick", "submit_remove_id_value('$id')");
		$content[$i][2] = $button;
	}
	$hidden = hidden("remove_id", "");
	$hidden->setAttribute("id", "remove_id");
	$form->appendChild($hidden);
	$content[$i][0] = "";
	$content[$i][1] = input_text($document, "subject_name");
	$content[$i][2] = submit($document, "Добавить");
	$table = custom_grid_table($content);
	$form->appendChild($table);
	$form->appendChild(hidden("step", "input_subject"));
	
	echo $document->saveHTML();
?>