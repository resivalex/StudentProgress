<?php

include("queries.php");

if (isset($_POST["params"])) {
    $res = select_query($_POST["query"], $_POST["params"]);
} else {
    $res = select_query($_POST["query"]);
}

echo json_encode($res);
