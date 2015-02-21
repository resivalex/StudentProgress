<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Добавить студента в группу"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_student_to_group.php");
	$body->appendChild($form);
	
	if (!isset($_POST["step"])) {
		$content = array();
		$content[0][0] = new DOMText("Курс");
		$select = select_course($document);
		$content[0][1] = $select;
		$table = custom_grid_table($content);
		$form->appendChild($table);
		$form->appendChild(submit($document, "Выбрать"));
		$form->appendChild(hidden("step", "select_course"));
	} elseif ($_POST["step"] == "select_course") {
		$course_number = $_POST["course_number"];
		$content = array();
		$content[0][0] = "Курс";
		$content[0][1] = $course_number." курс";
		$content[1][0] = "Группа";
		
		$result = get_id_name_from_groups_in_course($course_number);
		$select = custom_select("group_id", $result["id"], $result["name"]);
		$content[1][1] = $select;
		
		$table = custom_grid_table($content);
		$form->appendChild($table);
		$submit = submit($document, "Выбрать");
		$form->appendChild($submit);
		$form->appendChild(hidden("course_number", $course_number));
		$form->appendChild(hidden("step", "select_group"));
	} else {
		$course_number = $_POST["course_number"];
		$group_id = $_POST["group_id"];

		$content = array();
		$content[0][0] = "Курс";
		$content[0][1] = $course_number." курс";
		$content[1][0] = "Группа";
		$content[1][1] = get_group_name($group_id);
		$table = custom_grid_table($content);
		$form->appendChild($table);
		
		if (isset($_POST["remove_id"]) && $_POST["remove_id"] != null) {
			delete_student($_POST["remove_id"]);
		} else if ($_POST["step"] == "input_student") {
			$student_surname = $_POST["student_surname"];
			$student_name = $_POST["student_name"];
			$student_patronymic = $_POST["student_patronymic"];
			add_student($_POST["student_surname"], $_POST["student_name"], $_POST["student_patronymic"], $_POST["group_id"]);
		}
		
		$content = array();
		$content[0][0] = "№";
		$content[0][1] = "Фамилия";
		$content[0][2] = "Имя";
		$content[0][3] = "Отчество";
		$content[0][4] = "";
		$result = get_id_surname_name_patronymic_from_students_in_group($group_id);
		for ($i = 1; $i <= count($result["id"]); $i++) {
			$content[$i][0] = $i;//$result["id"][$i - 1];
			$content[$i][1] = $result["surname"][$i - 1];
			$content[$i][2] = $result["name"][$i - 1];
			$content[$i][3] = $result["patronymic"][$i - 1];
			$button = $document->createElement("input");
			$button->setAttribute("type", "button");
			$button->setAttribute("value", "Удалить");
			$button->setAttribute("onclick", "submit_remove_id_value('{$result["id"][$i - 1]}')");
			$content[$i][4] = $button;
		}
		$hidden = $document->createElement("input");
		$hidden->setAttribute("type", "hidden");
		$hidden->setAttribute("id", "remove_id");
		$hidden->setAttribute("name", "remove_id");
		$form->appendChild($hidden);
		$content[$i][0] = "";
		$content[$i][1] = input_text($document, "student_surname");
		$content[$i][2] = input_text($document, "student_name");
		$content[$i][3] = input_text($document, "student_patronymic");
		$content[$i][4] = submit($document, "Добавить");
		$table = custom_grid_table($content);
		$form->appendChild($table);
		$form->appendChild(hidden("step", "input_student"));
		$form->appendChild(hidden("course_number", $course_number));
		$form->appendChild(hidden("group_id", $group_id));
	}
	
	echo $document->saveHTML();
?>