<?php

include_once("template.php");
include_once("funs.php");

function user_list($role) {
    $query =
<<<"SQL"
SELECT surname, users.name AS name, patronymic, login, password, email, phone, users.id AS id
FROM users
JOIN roles ON users.role_id = roles.id
WHERE roles.name = "$role"
SQL;

    $ajax_div = fs("div");
    $ajax_div->setAttribute("id", $role);
    $query = str_replace("\n", " ", $query);
    $query = str_replace("\r", " ", $query);
    $ajax_div->appendChild(fs("script", "loadRemovableTable('users', '$role', '$query', getDeleteQueryForUser);"));

    return $ajax_div;
}

function add_user_form($header_text, $role)
{
    /** @var $document DOMDocument */
    $result = fs("div");
    $result->setAttribute("class", $role);

    $header = fs("p", $header_text);
    $header->setAttribute("class", "section_header");

    $result->appendChild($header);

    $result->appendChild(user_list($role));
    $add_user_div = fs("div");
    $add_user_div->setAttribute("style", "width: 300px;margin:0 auto;");

    $input_values = [["Фамилия", "surname"], ["Имя", "name"], ["Отчество", "patronymic"],
        ["Логин", "login"], ["Пароль", "password"], ["Эл. почта", "email"], ["Телефон", "phone"]];
    $items = array();
    foreach ($input_values as $value) {
        $label = fs("label", $value[0]);
        $input = input_text($value[1]);
        $items[] = [$label, $input];
    }
    $button = fs("button", "Добавить пользователя");
    $button->setAttribute("type", "button");
    $button->setAttribute("onclick", "addToUsers('$role')");
    $button_div = fs("div");
    $button_div->appendChild(custom_grid_table($items));
    if ($role == "student") {
        $select_group = fs("div");
        $select_group->setAttribute("id", "select_group");
        $button_div->appendChild($select_group);
    }
    $button_div->appendChild($button);
    $button_div->setAttribute("style", "text-align:center");
    $add_user_div->appendChild($button_div);


    $result->appendChild($add_user_div);

    return $result;
}

$title = new DOMElement("title", "Учётные записи");
$head->appendChild($title);

$body->appendChild(fs("script", "onAccountsLoad()"));
$body->appendChild(add_user_form("Студенты", "student"));
$body->appendChild(add_user_form("Преподаватели", "teacher"));
$body->appendChild(add_user_form("Начальники", "chief"));

out_page();
