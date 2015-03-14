<?php

include_once("template.php");

$title = $document->createElement("title", "Резервирование");
$head->appendChild($title);
$head->appendChild(scriptfs("javascript/reservation.js"));

loadfs($body, "templates/reservation_base.php");

out_page();
