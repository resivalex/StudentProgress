<?php

include_once("template.php");

$title = $document->createElement("title", "Отметки");
$head->appendChild($title);

$body->appendChild(afs("На главную", "index.php"));
$body->appendChild(brfs());

// фильтр для занития
function lesson_filter($id) {
    $res = fs("div");
    $res->setAttribute("id", $id);
    $res->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $res;
}

$script = fs("script", "onMarksLoad()");
$body->appendChild($script);
$body->appendChild(lesson_filter("select_teacher"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_subject"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_group"));
$body->appendChild(brfs());
$body->appendChild(lesson_filter("select_auditory_time"));
$body->appendChild(brfs());
$judging_div = fs("div");
$judging_div->setAttribute("id", "judging");
$body->appendChild($judging_div);

echo $document->saveHTML();
?>
