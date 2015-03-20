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

function courses() {
    checkbox_set("course", [0, 1, 2, 3, 4, 5], ["Любой", 1, 2, 3, 4, 5]);
}

function groups() {
    $res = sql_query("SELECT id, name FROM groups");
    array_unshift($res["id"], 0);
    array_unshift($res["name"], "Любая");
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

function mark_options() {
    $res = sql_query("SELECT id, short_name FROM mark_types");
    array_unshift($res["id"], 0);
    array_unshift($res["short_name"], "Любая");
    for ($i = 0; $i < count($res["id"]); $i++) {
        echo <<<HTML
<option value="{$res["id"][$i]}">{$res["short_name"][$i]}</option>
HTML;

    }
}

?>

<fieldset class="filter_group">
    <legend>Группы</legend>
    <?php courses(); ?>
    <?php groups(); ?>
</fieldset>
<fieldset class="filter_group">
    <legend>Отметки</legend>
    <div class="filter_row">
        <label style="font-family: Verdana;">Итоговая </label>
        <select id="is">
            <?php mark_options(); ?>
        </select>
    </div>
    <div class="filter_row">
        <label style="font-family: Verdana;">Была </label>
        <select id="was">
            <?php mark_options(); ?>
        </select>
    </div>
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