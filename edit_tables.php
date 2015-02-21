<?php

include_once("template.php");

function add_info_form($header, $table_name, $params) {
    $result = fs("div");
    $name_params = array();
    foreach ($params as $param) {
        $name_params[] = $param[1];
    }

    $header_element = fs("p", $header);
    $header_element->setAttribute("class", "section_header");
    $result->appendChild($header_element);

    // cуществующие записи
    $fields = array();
    foreach ($params as $param) {
        $fields[] = $param[1];
    }
    $script = fs("script", "loadRemovableTable('$table_name', '$table_name', splitSelectQueryFromParams('$table_name', ".json_encode($fields)."));");
    $ajax_div = fs("div");
    $ajax_div->setAttribute("id", $table_name);
    $ajax_div->appendChild($script);
    $result->appendChild($ajax_div);

    // форма для добавления записи
    $form = formfs("edit_tables.php");

    // создаём поля ввода
    $items = array();
    foreach ($params as $param) {
        $label = fs("label", $param[0]);
        $input = input_text($table_name."_".$param[1]);
        $input->setAttribute("id", $table_name."_".$param[1]);
        $items[] = [$label, $input];
    }
    $submit_div = fs("div");
    $submit_div->appendChild(custom_grid_table($items));
    $submit_div->setAttribute("style", "text-align:center");
    $submit = fs("input");
    $submit->setAttribute("type", "button");
    $submit->setAttribute("value", "Добавить");
    $submit->setAttribute("style", "display:inline");
    $submit->setAttribute("onclick", "addToTable('$table_name', ".json_encode($fields).")");
    $submit_div->appendChild($submit);
    $form->appendChild($submit_div);
    $form->appendChild(hidden("table_name", $table_name));

    $result->appendChild($form);

    return $result;
}

$head->appendChild(fs("title", "Редактировать таблицы"));
$body->appendChild(afs("Администрирование", "administration.php"));
$body->appendChild(add_info_form("Аудитории", "auditories", [["Название", "name"], ["Описание", "description"]]));
$body->appendChild(add_info_form("Дисциплины", "subjects", [["Название", "name"], ["Описание", "description"]]));
$body->appendChild(add_info_form("Группы", "groups", [["Название", "name"], ["Курс", "course"]]));

echo $document->saveHTML();
