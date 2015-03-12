<?php

include_once("template.php");

$head->appendChild($document->createElement("title", "Лог"));

$table_data = sql_query("SELECT time, action FROM log ORDER BY id DESC");
loadfs($body, "templates/log_base.php", ["table_data" => $table_data]);

out_page();
