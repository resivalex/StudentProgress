<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Выставить оценки за период"));

	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_marks_for_period.php");
	$body->appendChild($form);
	if (!isset($_POST["step"])) {
		$select = select_subject($document);
		$items = array();
		$items[0][0] = "Дисциплина";
		$items[0][1] = $select;
		$table = custom_grid_table($items);
		$form->appendChild($table);
		$form->appendChild(submit($document, "Выбрать"));
		$form->appendChild(hidden("step", "select_subject"));
	} elseif ($_POST["step"] == "select_subject") {
		$subject_id = $_POST["subject_id"];
		
		$content = array();
		$content[0][0] = "Дисциплина";
		$content[0][1] = get_subject_name($subject_id);
		$content[1][0] = "Группа";
		
		$values = array();
		$names = array();
		$result = get_id_name_from_groups_in_subject($subject_id);
		$select = custom_select("group_id", $result["id"], $result["name"]);
		
		$content[1][1] = $select;
		$table = custom_grid_table($content);
		$form->appendChild($table);
		
		$form->appendChild(submit($document, "Выбрать"));
		$form->appendChild(hidden("subject_id", $subject_id));
		$form->appendChild(hidden("step", "select_group"));
	} elseif ($_POST["step"] == "select_group") {
		$subject_id = $_POST["subject_id"];
		$group_id = $_POST["group_id"];
		
		$content = array();
		$content[0][0] = "Дисциплина";
		$content[0][1] = get_subject_name($subject_id);
				
		$content[1][0] = "Группа";
		$content[1][1] = get_group_name($group_id);
		$values = array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
		$names = array("январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь");
		$select = custom_select("month", $values, $names);
		$content[2][0] = "Месяц";
		$content[2][1] = $select;
		$table = custom_grid_table($content);
		$form->appendChild($table);
		
		$form->appendChild(submit($document, "Выбрать"));
		$form->appendChild(hidden("subject_id", $subject_id));
		$form->appendChild(hidden("group_id", $group_id));
		$form->appendChild(hidden("step", "select_interval"));
	} elseif ($_POST["step"] == "select_interval") {
		$subject_id = $_POST["subject_id"];
		$group_id = $_POST["group_id"];
		$month = $_POST["month"];
		
		$content = array();
		$content[0][0] = "Дисциплина";
		$content[0][1] = get_subject_name($subject_id);
		
		$date = new DateTime();
		$m = $date->format("m");
		$y = $date->format("Y");
		if ($month > $m) {
			settype($y, "integer");
			$y--;
		}
		$date1 = new DateTime("$y-$month-01");
		for ($date2 = new DateTime("$y-$month-28"); $date2->format("m") == $date1->format("m"); $date2->add(new DateInterval("P1D")));
		$date2->sub(new DateInterval("P1D"));
		
		$content[1][0] = "Группа";
		$content[1][1] = get_group_name($group_id);
		$months = array(null, "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь");
		$content[2][0] = "Дата";
		$content[2][1] = "$months[$month] $y";
		$table = custom_grid_table($content);
		$form->appendChild($table);	
		
		$lesson_id = get_lesson_id($subject_id, $group_id);

		$rows = array();
		$student_id = array();
		$result = get_id_surname_name_patronymic_from_students_in_group($group_id);
		for ($i = 0; $i < count($result["id"]); $i++) {
			$student_id[] = $result["id"][$i];
			$surname = $result["surname"][$i];
			$name = $result["name"][$i];
			$patronymic = $result["patronymic"][$i];
			$rows[] = "$surname $name $patronymic";
		}
		$cols = array();
		$teaching_id = array();
		for ($i = clone($date1); $i <= $date2; $i = $i->add(new DateInterval("P1D"))) {
			$tdate = $i->format("Y-m-d");
			add_teaching($lesson_id, $tdate);
			$teaching_id[] = get_teaching_id($lesson_id, $tdate);
			
			$date = $i->format("d");
			$text = $date;
			settype($text, "integer");
			$cols[] = $text;
		}		
		
		$student_list = array();
		$sname = $document->createElement("label", "Студент");
		$student_list[0][0] = $sname;
		for ($i = 0; $i < count($rows); $i++) {
			$sname = $document->createElement("label", $rows[$i]);
			$student_list[$i + 1][0] = $sname;
		}
		$left_cell = custom_grid_table($student_list);
		$tds = $left_cell->getElementsByTagName("td");
		foreach ($tds as $td) {
			$td->setAttribute("style", "display:block;width:250px");
		}
		
		$result = get_id_name_from_mark_types();
		$values = $result["id"];
		$names = $result["name"];
		
		$items = array();
		for ($i = 0; $i < count($cols); $i++) {
			$items[0][$i] = $cols[$i];
		}
		for ($i = 0; $i < count($rows); $i++) {
			for ($j = 0; $j < count($cols); $j++) {
				$select = custom_select("mark_type_id", $values, $names);
				$select = add_empty_line_in_select($document, $select);
				
				$result = get_mark_type_id_from_lessons($student_id[$i], $teaching_id[$j]);
				for ($k = 0; $k < count($result["mark_type_id"]); $k++) {
					$options = $select->getElementsByTagName("option");
					foreach ($options as $option) {
						if ($option->getAttribute("value") == $result["mark_type_id"][$k]) {
							$option->setAttribute("selected", "selected");
						}
					}
					$options = $select->getElementsByTagName("option");
					$options->item(0)->setAttribute("value", "remove");
				}
				
				$name = $select->getAttribute("name");
				$name .= "_$student_id[$i]_$teaching_id[$j]";
				$select->setAttribute("name", $name);
				$items[$i + 1][$j] = $select;
			}
		}
		
		$right_cell = custom_grid_table($items);
		$div = $document->createElement("div");
		$div->appendChild($right_cell);
		$ediv = $document->createElement("div");
		$ediv->appendChild($div);
		$div->setAttribute("style", "overflow-x:scroll;overflow-y:hide");
		$ediv->setAttribute("style", "width:600px");
				
		$cells[0][0] = $left_cell;
		$cells[0][1] = $ediv;
		$two_cells = custom_grid_table($cells);
		$form->appendChild($two_cells);
		$cells = $two_cells->getElementsByTagName("td");
		foreach ($cells as $cell) {
			$cell->setAttribute("valign", "top");
		}
		
		$submit = submit_form($document, "Сохранить");
		$form->appendChild($submit);
		$form->appendChild(hidden("lesson_id", $lesson_id));
		$form->appendChild(hidden("date1", $date1->format("Y-m-d")));
		$form->appendChild(hidden("date2", $date2->format("Y-m-d")));
		$form->appendChild(hidden("step", "add_marks"));
	} elseif ($_POST["step"] == "add_marks") {
		$lesson_id = $_POST["lesson_id"];
		$date1 = new DateTime($_POST["date1"]);
		$date2 = new DateTime($_POST["date2"]);
		
		$result = get_id_from_students_in_lesson($lesson_id);
		$student_id = $result["id"];
		for ($i = clone($date1); $i <= $date2; $i->add(new DateInterval("P1D"))) {
			$date = $i->format("Y-m-d");
			$teaching_id[] = get_teaching_id($lesson_id, $date);
		}
		for ($i = 0; $i < count($student_id); $i++) {
			for ($j = 0; $j < count($teaching_id); $j++) {
				$name = "mark_type_id_$student_id[$i]_$teaching_id[$j]";
				if (isset($_POST[$name])) {
					if ($_POST[$name] == "remove") {
						delete_mark($student_id[$i], $teaching_id[$j]);
					} else {
						$result = get_mark_type_id_from_lessons($student_id[$i], $teaching_id[$j]);
						if (isset($result["mark_type_id"][0])) {
							update_mark($student_id[$i], $teaching_id[$j], $_POST[$name]);
						} else {
							add_mark($student_id[$i], $teaching_id[$j], $_POST[$name]);
						}
					}
				}
			}
		}
		header("Location: index.php");
	}

	echo $document->saveHTML();
?>