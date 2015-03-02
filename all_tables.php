<?php

include_once("template.php");

$head->appendChild($document->createElement("title", "Все таблицы"));

$query = "SHOW TABLES";

$result = $sql->query($query);
while ($row = $result->fetch_array()) {
    $table_list[] = $row[0];
}

foreach ($table_list as $value) {
    $h3 = $document->createElement("h3", $value);
    $h3->setAttribute("align", "center");
    $body->appendChild($h3);
    $table_data = select_query("SELECT * FROM $value");
    $vis = array();
    $i = 0;
    foreach ($table_data as $key => $value2) {
        $vis[$i][] = $document->createElement("b", $key);
        foreach ($value2 as $value3) {
            $vis[$i][] = $value3;
        }
        $i++;
    }
    $table = custom_grid_table(transverse($vis));
    $table->setAttribute("style", "width: 80%");
    $body->appendChild($table);
}

echo $document->saveHTML();