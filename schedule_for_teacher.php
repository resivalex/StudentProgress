<?php

include_once("template.php");

$head->appendChild(fs("title", "Расписание для преподавателя"));
$head->appendChild(scriptfs("javascript/schedule_for_teacher.js"));

loadfs($body, "templates/schedule_for_teacher_base.php");

out_page();
