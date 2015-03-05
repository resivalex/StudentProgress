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
    $form = formfs("accounts.php");

    $input_values = [["Фамилия", "surname"], ["Имя", "name"], ["Отчество", "patronymic"],
        ["Логин", "login"], ["Пароль", "password"], ["Эл. почта", "email"], ["Телефон", "phone"]];
    $items = array();
    foreach ($input_values as $value) {
        $label = fs("label", $value[0]);
        $input = input_text($value[1]);
        $items[] = [$label, $input];
    }
    $submit = fs("input");
    $submit->setAttribute("type", "button");
    $submit->setAttribute("value", "Добавить пользователя");
    $submit->setAttribute("onclick", "addToUsers('$role')");
    $submit_div = fs("div");
    $submit_div->appendChild(custom_grid_table($items));
    if ($role == "student") {
        $select_group = fs("div");
        $select_group->setAttribute("id", "select_group");
        $submit_div->appendChild($select_group);
    }
    $submit_div->appendChild($submit);
    $submit_div->setAttribute("style", "text-align:center");
    $form->appendChild($submit_div);
    $form->appendChild(hidden("role", $role));

    $form_div = fs("div");
    $form_div->appendChild($form);
    $form_div->setAttribute("style", "width: 300px;margin:0 auto;");

    $result->appendChild($form_div);

    return $result;
}

$title = new DOMElement("title", "Учётные записи");
$head->appendChild($title);

$body->appendChild(fs("script", "onAccountsLoad()"));
$body->appendChild(add_user_form("Студенты", "student"));
$body->appendChild(add_user_form("Преподаватели", "teacher"));
$body->appendChild(add_user_form("Начальники", "chief"));

out_page();
