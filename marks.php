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

$query =
<<<SQL
SELECT
  groups.name AS group_name,
  subjects.name AS subject_name,
  auditories.name AS auditory_name,
  users.surname AS teacher_name,
  time,
  lessons.id AS lesson_id
FROM lessons
JOIN groups ON (groups.id = group_id)
JOIN subjects ON (subjects.id = subject_id)
JOIN auditories ON (auditories.id = auditory_id)
JOIN users ON (users.id = teacher_id)
ORDER BY time
SQL;

$items = transverse(select_query($query));
foreach ($items as &$row) {
    $choose_button = submit("Выбрать");
    $choose_code = "loadLesson('{$row['lesson_id']}');";
    $choose_code .= "getElementById('lesson_table').style.display='none';";
    $choose_code .= "getElementById('rechoose').style.display='inline-block';";
    $choose_button->setAttribute("onclick", $choose_code);
    $row['lesson_id'] = $choose_button;
}
$lesson_table = custom_grid_table($items);
$lesson_table->setAttribute("id", "lesson_table");
$body->appendChild($lesson_table);
$rechoose = submit("Перевыбрать занятие");
$rechoose_code = "getElementById('lesson_judging').innerHTML='';";
$rechoose_code .= "getElementById('lesson_table').style.display='table';";
$rechoose_code .= "this.style.display='none';";
$rechoose->setAttribute("onclick", $rechoose_code);
$rechoose->setAttribute("style", "display: none");
$rechoose->setAttribute("id", "rechoose");
$div = fs("div");
$body->appendChild($div);
$div->appendChild($rechoose);
$div->setAttribute("style", "text-align:center");
$body->appendChild($div);

$lesson_judging = fs("div");
$lesson_judging->setAttribute("id", "lesson_judging");
$body->appendChild($lesson_judging);

echo $document->saveHTML();
?>
