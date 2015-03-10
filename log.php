<?php

include_once("template.php");

$head->appendChild($document->createElement("title", "Лог"));

$table_data = sql_query("SELECT time, action FROM log ORDER BY id DESC");
$vis = array();
$i = 0;
foreach ($table_data as $key => $value2) {
    $vis[$i][] = $document->createElement("strong", $key);
    foreach ($value2 as $value3) {
        $vis[$i][] = $value3;
    }
    $i++;
}
$table = custom_grid_table(transverse($vis));
$body->appendChild($table);

out_page();
