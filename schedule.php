<?php

include_once("template.php");

$head->appendChild(fs("title", "Расписание"));

$body->appendChild(afs("На главную", "index.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Расписание для преподавателя", "schedule_for_teacher.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Расписание для студента", "schedule_for_student.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Редактирование расписания", "edit_schedule.php"));

echo $document->saveHTML();
