<?php

include_once("template.php");

$title = $document->createElement("title", "Отметки");
$head->appendChild($title);

// фильтр для занития
function lesson_filter($id) {
    $res = fs("div");
    $res->setAttribute("id", $id);
    $res->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $res;
}

$script = fs("script", "onMarksForTeacherLoad()");
$body->appendChild($script);
$body->appendChild(lesson_filter("select_teacher"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_subject"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_group"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_auditory_time"));
$body->appendChild(brfs());

// студенты и отметки
$judging_table = fs("table");
$judging_table->setAttribute("style", "margin-left: auto; margin-right: auto; width: 60%;");
$tr = fs("tr");
$judging_table->appendChild($tr);

// студенты
$judging_div = fs("div");
$judging_div->setAttribute("id", "judging");
$td = fs("td");
$td->setAttribute("style", "width: 50%; vertical-align: top;");
$td->appendChild($judging_div);
$tr->appendChild($td);

// отметки
$mark_div = fs("div");
$mark_div->setAttribute("id", "mark");
$td = fs("td");
$td->setAttribute("style", "width: 50%;");
$td->appendChild($mark_div);
$tr->appendChild($td);
$body->appendChild($judging_table);

echo $document->saveHTML();
?>
