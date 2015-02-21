<?php

include("queries.php");

$table_name = $_POST["table_name"];
$id = $_POST["id"];

$query =
<<<"SQL"
DELETE FROM $table_name
WHERE id = $id
SQL;

if (!modify_query($query)) {
    echo "Удаление не удалось!\n$query";
}
