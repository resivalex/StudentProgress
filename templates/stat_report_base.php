<?php
function checkbox_set($prefix, $id, $name) {
    echo <<<HTML
<div id="$prefix" class="filter_row">
HTML;
    for ($i = 0; $i < count($id); $i++) {
        $cur_id = $prefix."_".$id[$i];
        echo <<<HTML
    <input id="$cur_id" type="checkbox">
    <label for="$cur_id">$name[$i]</label>
HTML;
    }
    echo <<<HTML
</div>
HTML;
}

function report_types() {
    $id = [0, 1];
    $types = [
        "Средний балл",
        "Прогулы"
    ];
    checkbox_set("report_type", $id, $types);
}

function groups() {
    $res = sql_query("SELECT id, name FROM groups");
    checkbox_set("group", $res["id"], $res["name"]);
}

function subjects() {
    $res = sql_query("SELECT id, name FROM subjects");
    array_unshift($res["id"], 0);
    array_unshift($res["name"], "Любая");
    checkbox_set("subject", $res["id"], $res["name"]);
}

function teachers() {
    $res = sql_query("
      SELECT id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name
      FROM teachers
      JOIN users USING(id)");
    array_unshift($res["id"], 0);
    array_unshift($res["name"], "Любой");
    checkbox_set("teacher", $res["id"], $res["name"]);
}

function auditories() {
    $res = sql_query("SELECT id, name FROM auditories");
    array_unshift($res["id"], 0);
    array_unshift($res["name"], "Любая");
    checkbox_set("auditory", $res["id"], $res["name"]);
}

?>

<fieldset class="filter_group">
    <legend>Группы</legend>
    <?php groups(); ?>
</fieldset>
<fieldset class="filter_group">
    <legend>Тип отчёта</legend>
    <?php report_types() ?>
</fieldset>
<fieldset class="filter_group">
    <legend>Детали занятия</legend>
    <?php subjects(); ?>
    <?php teachers(); ?>
    <?php auditories(); ?>
</fieldset>
<fieldset class="filter_group">
    <legend>Интервал</legend>
    <div id="interval" class="filter_row">
        <label>С <input id="from" type="text"></label>
        <label> по <input id="to" type="text"></label>
        <button id="clear_dates">Сброс</button>
    </div>
</fieldset>
<div style="text-align: center">
    <button id="make_report">Создать отчёт</button>
</div>
<div id="content"></div>