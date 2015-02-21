<?php

include_once("template.php");

function get_pairs($query) {
    return transverse(select_query($query));
}

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
  auditories.name AS auditory_name, users.surname AS user_name, time
FROM lessons
JOIN groups ON (group_id = groups.id)
JOIN subjects ON (subject_id = subjects.id)
JOIN auditories ON (auditory_id = auditories.id)
JOIN users ON (teacher_id = users.id)
SQL;

$body->appendChild(afs("Расписание", "schedule.php"));
$body->appendChild(custom_grid_table(transverse(select_query($query))));
$body->setAttribute("onload", "loadCalendar(2013,1)");

$form = formfs("edit_schedule.php");
$form->appendChild(select_tool("Группа" ,"group_id", get_pairs("SELECT id, name FROM groups ORDER BY name")));
$form->appendChild(select_tool("Предмет" ,"subject_id", get_pairs("SELECT id, name FROM subjects ORDER BY name")));
$form->appendChild(select_tool("Аудитория", "auditory_id", get_pairs("SELECT id, name FROM auditories ORDER BY name")));
$form->appendChild(select_tool("Преподаватель" ,"teacher_id",
    get_pairs("SELECT teachers.id, users.surname FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname")));

$month_pairs = [
    [1, "январь"], [2, "февраль"], [3, "март"], [4, "апрель"],
    [5, "май"], [6, "июнь"], [7, "июль"], [8, "август"],
    [9, "сентябрь"], [10, "октябрь"], [11, "ноябрь"], [12, "декабрь"]
];
$month_select_tool = select_tool("Месяц", "month", $month_pairs);
$labels = $month_select_tool->getElementsByTagName("label");
$num = 1;
foreach ($labels as $label) {
    /** @var $label DOMElement */
    $label->setAttribute("onclick", "loadCalendar(2013,".$num.")");
    $num++;
}
$day_select_tool = fs("div");
$day_select_tool->setAttribute("id", "day_select_tool");
$day_select_tool->setAttribute("class", "calendar-toolbar");
$hour_select_tool = select_tool("Часы", "hour", interval_pairs(7, 18, 1));
$minute_select_tool = select_tool("Минуты", "minute", interval_pairs(0, 55, 5));
$items = [[$month_select_tool, $day_select_tool, $hour_select_tool, $minute_select_tool]];
$time_table = simple_grid_table($items);
$time_table->setAttribute("class", "align_td_to_top");
$form->appendChild($time_table);
$submit_div = fs("div");
$submit = fs("input");
$submit->setAttribute("type", "submit");
$submit->setAttribute("value", "Добавить занятие");
$submit->setAttribute("style", "display:inline");
$submit_div->appendChild($submit);
$form->appendChild($submit_div);
$body->appendChild($form);


echo $document->saveHTML();
