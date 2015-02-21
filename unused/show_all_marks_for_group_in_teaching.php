<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Показать все отметки");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "show_all_marks_for_group_in_teaching.php");
	$body->appendChild($form);
	
	if (!isset($_POST["lesson_id"])) {
		$table = input_form($document, "Выберите занятие", array("Занятие"), array(select_lesson($document)), "Выбрать");
		$form->appendChild($table);
	} else {
		$lesson_id = $_POST["lesson_id"];
		$query =
<<<SQL
SELECT subjects.name AS subject_name, groups.name AS group_name, teachers.surname, teachers.name, teachers.patronymic
FROM lessons
JOIN teachings ON (lessons.id = teachings.lesson_id)
JOIN subjects ON (lessons.subject_id = subjects.id)
JOIN groups ON (lessons.group_id = groups.id)
JOIN teachers ON (lessons.teacher_id = teachers.id)
WHERE lessons.id = $lesson_id
ORDER BY teachings.date
SQL;
		$res = mysql_query($query);
		$row = mysql_fetch_assoc($res);
		$left = array("Дисциплина", "Группа", "Преподаватель");
		$right = array($row["subject_name"], $row["group_name"], get_full_name($row));
		$info_table = two_info_table($document, $left, $right);
		$form->appendChild($info_table);
				
		// вывод отметок
				
		$query =
<<<SQL
SELECT students.surname, students.name, students.patronymic, mark_types.name AS mark, teachings.date
FROM marks
JOIN teachings ON (marks.teaching_id = teachings.id)
JOIN lessons ON (teachings.lesson_id = lessons.id)
JOIN students ON (student_id = students.id)
JOIN mark_types ON (mark_type_id = mark_types.id)
WHERE lessons.id = $lesson_id
ORDER BY teachings.date
SQL;
		$res = mysql_query($query);
		$content = array();
		$dates = array();
		while ($row = mysql_fetch_assoc($res)) {
			$full_name = get_full_name($row);
			$label = $document->createElement("label", $row["mark"]);
			$date = $row["date"];
			$dates[$date] = 1;
			$mark = $row["mark"];
			$content[$full_name][$date] = $mark;
		}
		$rows = array_keys($content);
		$cols = array_keys($dates);
		$table = grid_table($document, $rows, $cols, $content);
	}
	$form->appendChild($table);
		
	echo $document->saveHTML();
?>