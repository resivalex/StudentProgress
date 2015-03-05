<?php

include_once("template.php");

$head->appendChild(fs("title", "Отметки"));

$body->appendChild(afs("На главную", "index.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Вариант для преподавателя", "marks_for_teacher.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Отметки студента", "marks_for_student.php"));

out_page();
