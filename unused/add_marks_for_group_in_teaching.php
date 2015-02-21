<?php
	include_once("template.php");
	include_once("funs.php");
	
	$title = $document->createElement("title", "Выставить отметки");
	$head->appendChild($title);
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "add_marks_for_group_in_teaching.php");
	$body->appendChild($form);

	$table = $document->createElement("table");
	$table->setAttribute("style", "margin:0px auto");
	$form->appendChild($table);
	
	if (!isset($_POST["lesson_id"]) && !isset($_POST["teaching_id"])) {
		$text = array("Занятие", "Дата");
		$input = array(select_lesson($document), input_text($document, "date"));
		$table = input_form($document, "Выберите занятие", $text, $input, "Выбрать");
		$form->appendChild($table);
	} else {
		if (isset($_POST["teaching_id"])) {
			$teaching_id = $_POST["teaching_id"];
		} else {
			$lesson_id = $_POST["lesson_id"];
			$date = $_POST["date"];
			
			$query =
<<<SQL
INSERT INTO teachings
(lesson_id, date)
VALUES
('$lesson_id', '$date')
SQL;
			mysql_query($query);
		
			$query =
<<<SQL
SELECT id
FROM teachings
WHERE lesson_id = '$lesson_id'
		AND date = '$date'
SQL;
			$res = mysql_query($query);
			$row = mysql_fetch_assoc($res);
			$teaching_id = $row["id"];
		}
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
		$right = array($row["subject_name"], $row["group_name"], get_full_name($row));
		
		$query =
<<<SQL
SELECT date
FROM teachings
WHERE id = $teaching_id
SQL;
		mysql_query($query);
		$right[] = $row["date"];
		
		$form->appendChild(two_info_table($document, $left, $right));
		
		if (!isset($date)) {
			$query =
<<<SQL
SELECT date
FROM teachings
WHERE id = $teaching_id
SQL;
			$res = mysql_query($query);
			$row = mysql_fetch_assoc($res);
			$date = $row["date"];
		}
	}
	if (isset($_POST["lesson_id"])) {
		$lesson_id = $_POST["lesson_id"];
		$date = $_POST["date"];
		$query =
<<<SQL
SELECT id
FROM teachings
WHERE lesson_id = '$lesson_id'
		AND date = '$date'
SQL;
		$res = mysql_query($query);
		$row = mysql_fetch_assoc($res);
		$teaching_id = $row["id"];
						
		$hidden = $document->createElement("input");
		$hidden->setAttribute("type", "hidden");
		$hidden->setAttribute("name", "teaching_id");
		$hidden->setAttribute("value", $teaching_id);
		$form->appendChild($hidden);
		
		$query =
<<<SQL
SELECT students.id, students.surname, students.name, students.patronymic
FROM teachings
JOIN lessons ON (lesson_id = lessons.id)
JOIN students ON (lessons.group_id = students.group_id)
WHERE teachings.id = '$teaching_id'
SQL;
		$text = array();
		$input = array();
		
		$res = mysql_query($query);
		while ($row = mysql_fetch_assoc($res)) {
			$full_name = get_full_name($row);
			$text[] = $full_name;
			$select = select_mark_type($document);
			$select->setAttribute("name", $select->getAttribute("name")."_{$row["id"]}");
			$select = add_empty_line_in_select($document, $select);
			$input[] = $select;
		}
		$table = input_form($document, "Выберите отметки", $text, $input, "Добавить отметки");
		$form->appendChild($table);
	}
	if (isset($_POST["teaching_id"])) {
		$teaching_id = $_POST["teaching_id"];	
		$query =
<<<SQL
SELECT students.id
FROM teachings
JOIN lessons ON (lesson_id = lessons.id)
JOIN students ON (lessons.group_id = students.group_id)
WHERE teachings.id = $teaching_id
SQL;
		$res = mysql_query($query);
		while ($row = mysql_fetch_assoc($res)) {
			if (isset($_POST["mark_type_id_{$row["id"]}"])) {
				$student_id = $row["id"];
				$mark_type_id = $_POST["mark_type_id_{$row["id"]}"];
				$query =
<<<SQL
INSERT INTO marks
(student_id, teaching_id, mark_type_id)
VALUES
('$student_id', '$teaching_id', '$mark_type_id')
SQL;
				mysql_query($query);
			}
		}
	}
		
	echo $document->saveHTML();
?>