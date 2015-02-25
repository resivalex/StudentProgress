<?php

include_once("template.php");

$head->appendChild(fs("title", "Редактирование расписания"));

function id_div($id) {
    $div = fs("div");
    $div->setAttribute("id", $id);
    return $div;
}

$body->appendChild(fs("script", "onScheduleForTeacherLoad()"));
$body->appendChild(id_div("select_teacher"));
$body->appendChild(brfs());
$body->appendChild(id_div("schedule_table"));

echo $document->saveHTML();
