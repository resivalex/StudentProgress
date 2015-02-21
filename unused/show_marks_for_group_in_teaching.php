<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Показать отметки");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "show_marks_for_group_in_teaching.php");
	$body->appendChild($form);
	
	if (!isset($_POST["teaching_id"])) {
		$text = array("Проведение");
		$input = array(select_teaching($document));
		$table = input_form($document, "Выберите проведение занятия", $text, $input, "Выбрать");
		$form->appendChild($table);
	} else {
		$teaching_id = $_POST["teaching_id"];
		$query =
<<<SQL
SELECT subjects.name AS subject_name, groups.name AS group_name, teachers.surname, teachers.name, teachers.patronymic, date
FROM teachings
JOIN lessons ON (lesson_id = lessons.id)
JOIN subjects ON (lessons.subject_id = subjects.id)
JOIN groups ON (lessons.group_id = groups.id)
JOIN teachers ON (lessons.teacher_id = teachers.id)
WHERE teachings.id = $teaching_id
SQL;
		
		$res = mysql_query($query);
		$row = mysql_fetch_assoc($res);
		
		$left = array("Дисциплина", "Группа", "Преподаватель", "Дата");
		$right = array($row["subject_name"], $row["group_name"], get_full_name($row), $row["date"]);
		$info_table = two_info_table($document, $left, $right);
		
		// вывод отметок
				
		$query =
<<<SQL
SELECT students.surname, students.name, students.patronymic, mark_types.name AS mark
FROM marks
JOIN students ON (student_id = students.id)
JOIN mark_types ON (mark_type_id = mark_types.id)
WHERE teaching_id = $teaching_id
SQL;
		$res = mysql_query($query);
		$cols = array("Студент", "Отметка"); // ?
		$rows = array();
		$cnt = 0;
		while ($row = mysql_fetch_assoc($res)) {
			$full_name = get_full_name($row);
			$rows[$cnt][0] = $full_name; // ?
			$rows[$cnt][1] = $row["mark"]; // ?
			$cnt++;
		}
		$form->appendChild($info_table);
		$mark_table = column_table($document, $cols, $rows); // ?
		$form->appendChild($mark_table); // ?
	}
		
	echo $document->saveHTML();
?>