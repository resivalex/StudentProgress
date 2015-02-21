<?php

include_once("template.php");

$title = $document->createElement("title", "Главная");
$head->appendChild($title);

$body->appendChild(afs("Администрирование", "administration.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Расписание", "schedule.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Отметки", "marks.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Отчёты", "reports.php"));
$body->appendChild(brfs());
$body->appendChild(afs("*", "cards.php"));

//$body->appendChild(brfs());
echo $document->saveHTML();
