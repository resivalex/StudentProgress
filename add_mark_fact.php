<?php

include("queries.php");

$lesson_id = $_GET["lesson_id"];
$student_id = $_GET["student_id"];

$query =
<<<"SQL"
INSERT INTO marks
(lesson_id, student_id)
VALUES
($lesson_id, $student_id)
SQL;

modify_query($query);