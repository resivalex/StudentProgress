<?php
	include_once("template.php");
	include_once("funs.php");

	$document->appendChild($document->createElement("title", "Победа!"));
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$img = $document->createElement("img");
	$img->setAttribute("src", "tn.jpg");
	//$img->setAttribute("height", "750");
	$body->appendChild($img);
	
	echo $document->saveHTML();