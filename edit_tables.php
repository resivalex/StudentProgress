<?php

include_once("template.php");

$head->appendChild(fs("title", "Редактировать таблицы"));
$head->appendChild(scriptfs("javascript/edit_tables.js"));

$vars["header"] = "Аудитории";
$vars["table_name"] = "auditories";
$vars["params"] = [["Название", "name"], ["Описание", "description"]];
loadfs($body, "templates/edit_tables_table.php", $vars);

$vars["header"] = "Дисциплины";
$vars["table_name"] = "subjects";
$vars["params"] = [["Название", "name"], ["Описание", "description"]];
loadfs($body, "templates/edit_tables_table.php", $vars);

$vars["header"] = "Группы";
$vars["table_name"] = "groups";
$vars["params"] = [["Название", "name"], ["Курс", "course"]];
loadfs($body, "templates/edit_tables_table.php", $vars);

out_page();
