<?php

include_once("template.php");

$head->appendChild(fs("title", "Редактирование расписания"));
$head->appendChild(scriptfs("edit_schedule.js"));

$body->appendChild(divfs("schedule"));

$select_div = fs("div");

// фильтр для занития
function lesson_filter($id) {
    $res = divfs($id);
    $res->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $res;
}

$select_div->appendChild(lesson_filter("select_teacher"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_subject"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_group"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_auditory"));

$day_select_tool = fs("div");
$day_select_tool->setAttribute("id", "day_select_tool");
$day_select_tool->setAttribute("class", "calendar-toolbar");
$items = [[$day_select_tool, divfs("select_hour"), divfs("select_minute")]];
$time_table = simple_grid_table($items);
$time_table->setAttribute("class", "align_td_to_top");
$time_table->setAttribute("style", "margin-left: auto; margin-right: auto;");
$select_div->appendChild($time_table);
$submit_div = fs("div");
$submit_div->setAttribute("style", "text-align: center;");
$submit = fs("input");
$submit->setAttribute("type", "button");
$submit->setAttribute("value", "Добавить занятие");
$submit->setAttribute("style", "margin: 0 auto;");
$submit->setAttribute("id", "add_lesson");
$submit_div->appendChild($submit);
$select_div->appendChild($submit_div);
$body->appendChild($select_div);

out_page();
