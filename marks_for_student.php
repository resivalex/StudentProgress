<?php

include_once("template.php");

$head->appendChild(fs("title", "Отметки студента"));

function select_div($id) {
    $div = fs("div");
    $div->setAttribute("id", $id);
    $div->setAttribute("style", "width: 40%; margin-left: auto; margin-right: auto;");
    return $div;
}

// скрипт
$body->appendChild(fs("script", "onMarksForStudentLoad()"));

// выбор студента
$body->appendChild(select_div("select_group"));
$body->appendChild(brfs());
$body->appendChild(select_div("select_student"));
$body->appendChild(brfs());

// таблица с расписанием
$marks_table = fs("div");
$marks_table->setAttribute("id", "marks_table");
$body->appendChild($marks_table);

out_page();
