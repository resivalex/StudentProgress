<?php
include_once("queries.php");

$tables = sql_query("SHOW tables");
// order is important
$tables = [
//    "log",
    "roles",
    "users",
    "groups",
    "chiefs",
    "teachers",
    "subjects",
    "auditories",
    "lessons",
    "marks",
    "mark_types",
    "mark_history"
];

$content = [];
foreach ($tables as $table) {
    /** @var mysqli $sql */
    $sql = $GLOBALS["sql"];
    $result = $sql->query("SELECT * FROM $table");
    $fields = [];
    while ($field = $result->fetch_field()) {
        $fields[] = $field->name;
    }

    $select_result = [];
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $select_row = [];
        foreach ($row as $field => $value) {
            $select_row[$field] = $value;
        }
        $select_result[] = $select_row;
    }
    $content[$table] = $select_result;
}

$content = json_encode($content, JSON_PRETTY_PRINT);

header("Pragma: public");
header("Expires: 0");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: private", false);
header("Content-Type: application/json");
header("Content-Disposition: attachment; filename=\"" . iconv('UTF-8', 'CP1251', 'backup.json') . "\";");
header("Content-Transfer-Encoding: binary");
header("Content-Length: " . strlen($content));

echo $content;