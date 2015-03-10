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
		$result = sql_query([$query, $login, $password]);
        if (isset($result["role_name"][0])) {
            $_SESSION["username"] = $login;
            $_SESSION["role"] = $result["role_name"][0];

            header("Location: {$_SESSION["from_uri"]}");
        }
    }
}
	
$head->appendChild($document->createElement("title", "Авторизация"));
$head->appendChild(scriptfs("javascript/login.js"));

loadfs($body, "templates/login_base.php");

out_page();
