<?php

include_once("template.php");

$title = $document->createElement("title", "Отчёты");
$head->appendChild($title);

$query =
<<<SQL
SELECT COUNT(*) AS mark_count
FROM marks
SQL;

$result = select_query($query);

$result['mark_count'][0] .= ' (общее количество отметок)';

$body->appendChild(fs('h3', 'Отчёт по количеству отметок'));
$body->appendChild(custom_grid_table($result));

echo $document->saveHTML();
?>
