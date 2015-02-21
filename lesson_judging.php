<?php
include("funs.php");
include("queries.php");
$document = new DOMDocument();
$lesson_id = $_GET["lesson_id"];
$query =
<<<"SQL"
SELECT
  groups.name AS group_name,
  subjects.name AS subject_name,
  auditories.name AS auditory_name,
  users.surname AS teacher_name,
  time,
  group_id
FROM lessons
JOIN groups ON (groups.id = group_id)
JOIN subjects ON (subjects.id = subject_id)
JOIN auditories ON (auditories.id = auditory_id)
JOIN users ON (users.id = teacher_id)
WHERE lessons.id = $lesson_id
SQL;

$arr = transverse(select_query($query));
$group_id = $arr[0]["group_id"];
unset($arr[0]["group_id"]);
$document->appendChild(custom_grid_table($arr, "text-align: center"));

if (count($arr) != 0) {
    $query =
<<<"SQL"
SELECT users.surname, users.name, users.patronymic, students.id AS student_id
FROM students
JOIN users ON (users.id = students.id)
WHERE group_id = $group_id
ORDER BY users.surname, users.name, patronymic
SQL;
    $arr = transverse(select_query($query));
    $first = true;
    foreach ($arr as &$row) {
        $checkbox = fs("input");
        $checkbox->setAttribute("name", "student_id");
        $checkbox->setAttribute("type", "radio");
        $checkbox->setAttribute("value", $row["student_id"]);
        $checkbox->setAttribute("id", "student_id_".$row["student_id"]);
        $checkbox->setAttribute("style", "display:none");
//        if ($first) {
//            $checkbox->setAttribute("checked", "true");
//            $first = false;
//        }
        $div = fs("div");
        $div->setAttribute("class", "radio-toolbar");
        $div->appendChild($checkbox);
        $label = fs("label", "[Focus]");
        $label->setAttribute("for", "student_id_".$row["student_id"]);
        $label->setAttribute("style", "width:50px");
        $label->setAttribute("onclick", "loadStudentProgress($lesson_id, {$row["student_id"]});getElementById('student_judging').innerHTML=''");
        $div->appendChild($label);
        $row["student_id"] = $div;
    }
    $document->appendChild(custom_grid_table($arr));
    $div = fs("div");
    $div->setAttribute("id", "student_judging");
    $document->appendChild($div);
}

$debug = fs("div");
$debug->setAttribute("id", "debug");
$document->appendChild($debug);

echo $document->saveHTML();