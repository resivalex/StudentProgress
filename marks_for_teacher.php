<?php

include_once("template.php");

$title = $document->createElement("title", "Отметки");
$head->appendChild($title);
$head->appendChild(scriptfs("javascript/marks_for_teacher.js"));

loadfs($body, "templates/marks_for_teacher_base.php");

out_page();
