<?php

include_once("template.php");

$head->appendChild(fs("title", "Редактирование расписания"));

$query =
<<<SQL
SELECT groups.name AS groups_name, subjects.name AS subject_name,
  auditories.name AS auditory_name, users.surname AS user_name, time, lessons.id AS id
FROM lessons
JOIN groups ON (group_id = groups.id)
JOIN subjects ON (subject_id = subjects.id)
JOIN auditories ON (auditory_id = auditories.id)
JOIN users ON (teacher_id = users.id)
SQL;

$query = str_replace("\n", " ", $query);
$query = str_replace("\r", " ", $query);

$div = fs("div");
$div->setAttribute("id", "schedule");
$script = fs("script", "loadRemovableTable('lessons', 'schedule', '$query')");
$div->appendChild($script);
$body->appendChild($div);

$select_div = fs("div");

// фильтр для занития
function lesson_filter($id) {
    $res = fs("div");
    $res->setAttribute("id", $id);
    $res->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $res;
}

$script = fs("script", "onEditScheduleLoad()");
$body->appendChild($script);
$select_div->appendChild(lesson_filter("select_teacher"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_subject"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_group"));
$select_div->appendChild(brfs());
$select_div->appendChild(lesson_filter("select_auditory"));


$month_pairs = [
    [1, "январь"], [2, "февраль"], [3, "март"], [4, "апрель"],
    [5, "май"], [6, "июнь"], [7, "июль"], [8, "август"],
    [9, "сентябрь"], [10, "октябрь"], [11, "ноябрь"], [12, "декабрь"]
];

$select_month = fs("div");
$select_month->setAttribute("id", "select_month");
$select_month->setAttribute("style", "width: 150px; margin-right: 10px;");
$select_div->appendChild($select_month);


$select_hour = fs("div");
$select_hour->setAttribute("id", "select_hour");
//$select_month->setAttribute("style", "width: 150px; margin-right: 10px;");
$select_div->appendChild($select_hour);

$select_minute = fs("div");
$select_minute->setAttribute("id", "select_minute");
//$select_month->setAttribute("style", "width: 150px; margin-right: 10px;");
$select_div->appendChild($select_minute);


$day_select_tool = fs("div");
$day_select_tool->setAttribute("id", "day_select_tool");
$day_select_tool->setAttribute("class", "calendar-toolbar");
$items = [[$select_month, $day_select_tool, $select_hour, $select_minute]];
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
$submit->setAttribute("onclick", "addLesson()");
$submit_div->appendChild($submit);
$select_div->appendChild($submit_div);
$body->appendChild($select_div);


echo $document->saveHTML();
