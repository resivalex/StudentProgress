<?php

include_once("template.php");

$title = $document->createElement("title", "Резервирование");
$head->appendChild($title);

$body->appendChild(fs("h1", "Создать копию"));
$body->appendChild(fs("h1", "Восстановить из копии"));

out_page();
