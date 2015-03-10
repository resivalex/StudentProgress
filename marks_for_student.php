<?php

include_once("template.php");

$head->appendChild(fs("title", "Отметки студента"));
$head->appendChild(scriptfs("javascript/marks_for_student.js"));

loadfs($body, "templates/marks_for_student_base.php");

out_page();
