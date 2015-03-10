<?php

include_once("template.php");

$head->appendChild(fs("title", "Расписание для студента"));
$head->appendChild(scriptfs("javascript/schedule_for_student.js"));

loadfs($body, "templates/schedule_for_student_base.php");

out_page();
