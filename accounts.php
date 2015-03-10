<?php

include_once("template.php");
include_once("funs.php");

function user_list($role) {
    $div = divfs($role);
    $div->setAttribute("class", "ajax_div");
    return $div;
}

$head->appendChild(fs("title", "Учётные записи"));
$head->appendChild(scriptfs("javascript/accounts.js"));

$vars["header_text"] = "Студенты";
$vars["role"] = "student";
loadfs($body, "templates/accounts_table.php", $vars);
$vars["header_text"] = "Преподаватели";
$vars["role"] = "teacher";
loadfs($body, "templates/accounts_table.php", $vars);
$vars["header_text"] = "Начальники";
$vars["role"] = "chief";
loadfs($body, "templates/accounts_table.php", $vars);

out_page();
