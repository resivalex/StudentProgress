<?php
include_once("template.php");

$title = $document->createElement("title", "Главная");
$head->appendChild($title);
loadfs($body, "templates/about.php");

out_page();