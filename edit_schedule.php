<?php

include_once("template.php");

$head->appendChild(fs("title", "Редактирование расписания"));
$head->appendChild(scriptfs("javascript/edit_schedule.js"));

loadfs($body, "templates/edit_schedule_base.php");

out_page();
