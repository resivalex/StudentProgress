<?php
include("funs.php");
include("queries.php");
$document = new DOMDocument();
$lesson_id = $_GET["lesson_id"];
$student_id = $_GET["student_id"];
$query =
<<<"SQL"
SELECT COUNT(*) AS records
FROM marks
WHERE lesson_id = $lesson_id AND student_id = $student_id
SQL;

$result = select_query($query);
if ($result["records"][0] == 0) {
    $document->appendChild(custom_grid_table([["Отметок ещё нет"]]));
} else {
    $document->appendChild(custom_grid_table([["Есть отметки"]]));

    $query =
<<<"SQL"
SELECT mark_types.name, time, comment
FROM marks
JOIN mark_history ON (mark_id = marks.id)
JOIN mark_types ON (mark_type_id = mark_types.id)
WHERE lesson_id = $lesson_id AND student_id = $student_id
SQL;

    $document->appendChild(custom_grid_table(transverse(select_query($query))));
}

$query =
<<<SQL
SELECT id, short_name
FROM mark_types
SQL;

$mark_types = select_query($query);
$mark_selector = select_tool("Отметка", "mark_type", transverse($mark_types));
$mark_selector->setAttribute("id", "added_mark");

$document->appendChild($mark_selector);

$add_button = submit("Добавить");
$add_button->setAttribute("style", "display: inline-block");
$add_button->setAttribute("onclick", "addMark($lesson_id, $student_id, checkedRadio('mark_type'));loadStudentProgress($lesson_id, $student_id)");
$document->appendChild($add_button);

echo $document->saveHTML();