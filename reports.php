<?php

include_once("template.php");

$head->appendChild(fs("title", "Отчёты по количеству студентов"));
$head->appendChild(scriptfs("javascript/reports.js"));

loadfs($body, "templates/reports_base.php");

out_page();
