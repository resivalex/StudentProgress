<?php
$login_page = "something";

include_once("template.php");
include_once("funs.php");

if (!isset($_SESSION["from_uri"])) $_SESSION["from_uri"] = "/index.php";

if (isset($_SESSION["username"])) header("Location: {$_SESSION["from_uri"]}");

if (isset($_POST["login"]) && isset($_POST["password"])) {
    $login = $_POST["login"];
    $password = $_POST["password"];
    if ($login == "admin" && $password == "patented") {
        $_SESSION["username"] = "admin";
        $_SESSION["role"] = "admin";
        header("Location: {$_SESSION["from_uri"]}");
    } else {
        $query =
<<<SQL
SELECT roles.name AS role_name
FROM users
JOIN roles ON (roles.id = users.role_id)
WHERE login = ? AND password = ?
SQL;
		$result = select_query($query, array("ss", $login, $password));
        if (isset($result["role_name"][0])) {
            $_SESSION["username"] = $login;
            $_SESSION["role"] = $result["role_name"][0];

            header("Location: {$_SESSION["from_uri"]}");
        }
    }
}
	
$head->appendChild($document->createElement("title", "Авторизация"));
$form = post_form($document, "login.php");
$body->appendChild($form);

$content[0][0] = "Логин";
$content[0][1] = input_text("login");
$content[1][0] = "Пароль";
$password_edit = input_text("password");
$password_edit->setAttribute("type", "password");
$content[1][1] = $password_edit;
$table = custom_grid_table($content);
$form->appendChild($table);
$submit = submit("Вход");
$submit_div = fs("div");
$submit_div->appendChild($submit);
$fast_submit = submit("Cheat!");
$fast_submit->setAttribute("onclick", "setFields()");
$submit_div->appendChild($fast_submit);
$submit_div->setAttribute("style", "text-align:center");
$form->appendChild($submit_div);

out_page();
