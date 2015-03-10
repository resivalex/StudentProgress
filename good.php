<?php
include_once("template.php");
include_once("funs.php");

$document->appendChild($document->createElement("title", "Победа!"));

$img = $document->createElement("img");

$img->setAttribute("src", "images/tn.jpg");
$img->setAttribute("style", "display: block; margin: 0 auto;");
$body->appendChild($img);

out_page();
