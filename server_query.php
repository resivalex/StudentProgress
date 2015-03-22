<?php

include_once("queries.php");
$query_functions = [];
include_once("query_functions.php");

$name = $_POST["name"];
if (!isset($_POST["params"])) {
    $params = null;
} else {
    $params = $_POST["params"];
}
to_log(["server_query", $name, $params]);

if (isset($query_functions[$name])) {
    echo json_encode($query_functions[$name]($params));
} else {
    echo json_encode("No available query with name '$name'");
}
