<?php

include_once("template.php");

function interval_pairs($from, $to, $step) {
    $result = array();
    while ($from <= $to) {
        $result[] = [$from, $from];
        $from += $step;
    }
    return $result;
}

$head->appendChild(fs("title", "Редактирование расписания"));

if (isset($_POST["group_id"])) {
    $group_id = $_POST["group_id"];
    $subject_id = $_POST["subject_id"];
    $auditory_id = $_POST["auditory_id"];
    $teacher_id = $_POST["teacher_id"];
    $month = $_POST["month"];
    $day = $_POST["day"];
    $hour = $_POST["hour"];
    $minute = $_POST["minute"];
    $datetime = "2013-".$month."-".$day." ".$hour.":".$minute.":00";

    $query =
<<<"SQL"
INSERT INTO lessons
(group_id, subject_id, auditory_id, teacher_id, time)
VALUES
('$group_id', '$subject_id', '$auditory_id', '$teacher_id', '$datetime')
SQL;
    modify_query($query);
}

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

$body->appendChild(afs("Расписание", "schedule.php"));
$div = fs("div");
$div->setAttribute("id", "schedule");
$script = fs("script", "loadRemovableTable('lessons', 'schedule', '$query')");
$div->appendChild($script);
$body->appendChild($div);
//$body->setAttribute("onload", "loadCalendar(2013,1)");

$select_div = fs("div");
//$select_group = select_tool("Группа" ,"group_id", get_pairs("SELECT id, name FROM groups ORDER BY name"));
//$select_group->setAttribute("style", "width: 40%");
//$select_subject = select_tool("Предмет" ,"subject_id", get_pairs("SELECT id, name FROM subjects ORDER BY name"));
//$select_subject->setAttribute("style", "width: 40%");
//$select_auditory = select_tool("Аудитория", "auditory_id", get_pairs("SELECT id, name FROM auditories ORDER BY name"));
//$select_auditory->setAttribute("style", "width: 40%");
//$select_teacher = select_tool("Преподаватель" ,"teacher_id",
//    get_pairs("SELECT teachers.id, users.surname FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname"));
//$select_teacher->setAttribute("style", "width: 40%");
//$select_div->appendChild($select_group);
//$select_div->appendChild(brfs());
//$select_div->appendChild($select_subject);
//$select_div->appendChild(brfs());
//$select_div->appendChild($select_auditory);
//$select_div->appendChild(brfs());
//$select_div->appendChild($select_teacher);

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
