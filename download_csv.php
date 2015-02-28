<?php

$table = json_decode($_POST["table"], true);
$content = "";
foreach ($table["table"] as $row) {
    foreach ($row as $cell) {
        $cell = str_replace("\n", " ", $cell);
        $cell = str_replace("\r", " ", $cell);
        $cell = str_replace("\"", "\"\"", $cell);
        $content .= "\"".iconv('UTF-8', 'CP1251', $cell)."\";";
    }
    $content .= "\n";
}

header("Pragma: public");
header("Expires: 0");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Cache-Control: private", false);
header("Content-Type: application/x-msexcel");
header("Content-Disposition: attachment; filename=\"" . iconv('UTF-8', 'CP1251', 'table.csv') . "\";");
header("Content-Transfer-Encoding: binary");
header("Content-Length: " . strlen($content));

echo $content;