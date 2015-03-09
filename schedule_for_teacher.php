<?php

include_once("template.php");

$head->appendChild(fs("title", "Расписание для преподавателя"));
$head->appendChild(scriptfs("schedule_for_teacher.js"));

function id_div($id) {
    $div = fs("div");
    $div->setAttribute("id", $id);
    return $div;
}

// выбор преподавателя
$select_teacher = id_div("select_teacher");
$select_teacher->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
$body->appendChild($select_teacher);
$body->appendChild(brfs());

// таблица с расписанием
$body->appendChild(id_div("schedule_table"));

out_page();
