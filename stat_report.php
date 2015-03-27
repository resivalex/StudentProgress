<?php

include_once("template.php");

$head->appendChild(fs("title", "Статистика"));
$head->appendChild(scriptfs("javascript/stat_report.js"));

loadfs($body, "templates/stat_report_base.php");

out_page();