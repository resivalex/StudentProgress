<?php

include_once("template.php");

$title = $document->createElement("title", "Администрирование");
$head->appendChild($title);

$body->appendChild(afs("На главную", "index.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Учётные записи", "accounts.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Радактирование таблиц", "edit_tables.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Резервирование", "reservation.php"));
$body->appendChild(brfs());
$body->appendChild(afs("Все таблицы", "all_tables.php"));
$body->appendChild(brfs());
//$body->appendChild(brfs());
out_page();
