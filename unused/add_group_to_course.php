<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Добавить группу к курсу"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_group_to_course.php");
	$body->appendChild($form);
	
	if (!isset($_POST["step"])) {
		$content = array();
		$content[0][0] = "Курс";
		$select = select_course($document);
		$content[0][1] = $select;
		$table = custom_grid_table($content);
		$form->appendChild($table);
		$submit = submit($document, "Выбрать");
		$form->appendChild($submit);
		$form->appendChild(hidden("step", "select_course"));
	} else {
		$course_number = $_POST["course_number"];

		$content = array();
		$content[0][0] = "Группа";
		$content[0][1] = $course_number." курс";
		$table = custom_grid_table($content);
		$form->appendChild($table);
		
		if (isset($_POST["remove_id"]) && $_POST["remove_id"] != null) {
			$remove_id = $_POST["remove_id"];
			$count = count_students_in_group($remove_id);
			if ($count > 0) {
				$script = $document->createElement("script", "cant_remove_group()");
				$body->appendChild($script);
			} else {
				delete_group($remove_id);
			}
		} else if ($_POST["step"] == "input_group") {
			add_group($_POST["group_name"], $_POST["course_number"]);
		}
		
		$content = array();
		$content[0][0] = "№";
		$content[0][1] = "Название";
		$content[0][2] = "";

		$result = get_id_name_from_groups_in_course($course_number);
		for ($i = 1; $i <= count($result["name"]); $i++) {
			$content[$i][0] = $i;
			$content[$i][1] = $result["name"][$i - 1];
			$button = $document->createElement("input");
			$button->setAttribute("type", "button");
			$button->setAttribute("value", "Удалить");
			$button->setAttribute("onclick", "submit_remove_id_value('{$result["id"][$i - 1]}')");
			$content[$i][2] = $button;
		}
		$hidden = $document->createElement("input");
		$hidden->setAttribute("type", "hidden");
		$hidden->setAttribute("id", "remove_id");
		$hidden->setAttribute("name", "remove_id");
		$form->appendChild($hidden);
		$content[$i][0] = "";
		$content[$i][1] = input_text($document, "group_name");
		$content[$i][2] = submit($document, "Добавить");
		$table = custom_grid_table($content);
		$form->appendChild($table);
		$form->appendChild(hidden("step", "input_group"));
		$form->appendChild(hidden("course_number", $course_number));
	}
	
	echo $document->saveHTML();
?>