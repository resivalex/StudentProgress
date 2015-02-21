<?php

include("queries.php");

$lesson_id = $_GET["lesson_id"];
$student_id = $_GET["student_id"];
$mark_type = $_GET["mark_type"];

$query =
<<<"SQL"
SELECT COUNT(*) AS records
FROM marks
WHERE lesson_id = $lesson_id AND student_id = $student_id
SQL;

$result = select_query($query);

if ($result['records'][0] == 0) {
    $query =
<<<"SQL"
INSERT INTO marks
(lesson_id, student_id)
VALUES
($lesson_id, $student_id)
SQL;

    modify_query($query);
}

$query =
<<<"SQL"
SELECT id
FROM marks
WHERE lesson_id = $lesson_id AND student_id = $student_id
SQL;

$result = select_query($query);

$mark_id = $result['id'][0];

$query =
<<<"SQL"
INSERT INTO mark_history
(mark_type_id, mark_id, time, comment)
VALUES
($mark_type, $mark_id, NOW(), 'alpha')
SQL;

modify_query($query);