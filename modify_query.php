<?php

include_once("queries.php");

if (isset($_POST["params"])) {
    $res = modify_query($_POST["query"], $_POST["params"]);
} else {
    $res = modify_query($_POST["query"]);
}

echo json_encode($res);
