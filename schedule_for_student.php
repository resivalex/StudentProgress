<?php

include_once("template.php");

$head->appendChild(fs("title", "Расписание для студента"));

function select_div($id) {
    $div = fs("div");
    $div->setAttribute("id", $id);
    $div->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $div;
}

// скрипт
$body->appendChild(fs("script", "onScheduleForStudentLoad()"));

// выбор студента
$body->appendChild(select_div("select_group"));
$body->appendChild(brfs());

// таблица с расписанием
$schedule_table = fs("div");
$schedule_table->setAttribute("id", "schedule_table");
$body->appendChild($schedule_table);

out_page();
