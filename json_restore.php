<?php
include_once("template.php");

$title = $document->createElement("title", "Восстановление данных");
$head->appendChild($title);
loadfs($body, "templates/json_restore_base.php");

out_page();