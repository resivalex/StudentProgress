<?php
	include_once("template.php");
	include_once("funs.php");
	
	$head->appendChild($document->createElement("title", "Просмотр отметок"));
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);

	$role_name = $_SESSION["role"];	
	switch ($role_name) {
		case "student":
			include("show_marks_for_student.php");
			break;
		case "subcom":
			include("show_marks_for_subcom.php");
			break;
		case "teacher":
			include("show_marks_for_teacher.php");
			break;
		case "course_chief":
			include("show_marks_for_course_chief.php");
			break;
		case "chief":
			include("show_marks_for_chief.php");
			break;
		default:
			$body->appendChild(new DOMElement("h1", "У вас нет доступа к просмотру отметок!"));
	}
	
	echo $document->saveHTML();
?>