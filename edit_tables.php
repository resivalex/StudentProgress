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

    $result->appendChild(hiddenfs($table_name."_fields", json_encode($fields)));
    $result->appendChild(divfs($table_name, "ajax_div"));

    // создаём поля ввода
    $items = array();
    foreach ($params as $param) {
        $label = fs("label", $param[0]);
        $input = input_text($table_name."_".$param[1]);
        $input->setAttribute("id", $table_name."_".$param[1]);
        $items[] = [$label, $input];
    }
    $add_record_div = fs("div");
    $add_record_div->appendChild(custom_grid_table($items));
    $add_record_div->setAttribute("style", "text-align:center");
    $button = fs("button", "Добавить");
    $button->setAttribute("type", "button");
    $button->setAttribute("style", "display:inline");
    $button->setAttribute("id", "add_to_".$table_name);
    $button->setAttribute("class", "add_button");
    $add_record_div->appendChild($button);

    $result->appendChild($add_record_div);

    return $result;
}

$head->appendChild(fs("title", "Редактировать таблицы"));
$head->appendChild(scriptfs("edit_tables.js"));

$body->appendChild(add_info_form("Аудитории", "auditories", [["Название", "name"], ["Описание", "description"]]));
$body->appendChild(add_info_form("Дисциплины", "subjects", [["Название", "name"], ["Описание", "description"]]));
$body->appendChild(add_info_form("Группы", "groups", [["Название", "name"], ["Курс", "course"]]));

out_page();
