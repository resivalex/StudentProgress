<?php

include_once("template.php");

$title = $document->createElement("title", "Главная");
$head->appendChild($title);

$body->appendChild(afs("*", "cards.php"));

//$body->appendChild(brfs());
echo $document->saveHTML();
