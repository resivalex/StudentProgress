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
session_start();
to_log(["server_query", $name, $params, $_SESSION["username"]]);

$accsess_map = [
    "groups" => "acst",
    "teachers" => "acst",
    "subjects" => "acst",
    "auditories" => "acst",
    "non-empty groups" => "acst",
    "mark types" => "acst",
    "involved teachers" => "acst",
    "involved groups" => "acst",
    "add user" => "a",
    "delete chief" => "a",
    "delete student" => "a",
    "delete teacher" => "a",
    "add auditory" => "a",
    "add subject" => "a",
    "add group" => "a",
    "delete auditory" => "a",
    "delete subject" => "a",
    "delete group" => "a",
    "auditories for edition" => "acst",
    "subjects for edition" => "acst",
    "groups for edition" => "acst",
    "users in role" => "acst",
    "delete lesson" => "a",
    "lessons with info" => "acst",
    "add lesson" => "a",
    "students from group" => "acst",
    "student marks" => "acst",
    "student lesson marks" => "acst",
    "lesson students with info" => "acst",
    "lessons by parameters" => "acst",
    "groups by subject and teacher" => "acst",
    "subjects by teacher" => "acst",
    "add mark" => "a",
    "lessons by group" => "acst",
    "lessons by teacher" => "acst",
    "students by filters" => "acst",
    "average statistics" => "ac",
    "absent statistics" => "ac"
];

// only for testing
$accsess_map["change role"] = "acst";
$query_functions["change role"] = function($pm) {
    $_SESSION["role"] = $pm["role"];
    return true;
};
//////////////////////////

if (isset($query_functions[$name])) {
    if (!isset($accsess_map[$name])) {
        echo "No access map for query";
    } else {
        $short_role = [
            "admin" => "a",
            "chief" => "c",
            "student" => "s",
            "teacher" => "t"
        ];
        if (strpos($accsess_map[$name], $short_role[$_SESSION["role"]]) === false) {
            echo "No access to query";
        } else {
            echo json_encode($query_functions[$name]($params));
        }
    }
} else {
    echo "No available query with such name";
}
