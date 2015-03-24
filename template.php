<?php
include_once("funs.php");
include_once("queries.php");

ini_set("display_errors","1");
ini_set("display_startup_errors","1");
ini_set("error_reporting", E_ALL);
date_default_timezone_set("Europe/Moscow");

session_start();
if (!isset($_SESSION["username"])) {
    if (!isset($login_page)) {
        $_SESSION["from_uri"] = $_SERVER["REQUEST_URI"];
        header("Location: login.php");
    }
}

$document = new DOMDocument("1.0", "UTF-8");
$document->formatOutput = true;

$html = $document->createElement("html");
$document->appendChild($html);

$head = $document->createElement("head");
$body = $document->createElement("body");
$html->appendChild($head);
$html->appendChild($body);

loadfs($head, "templates/template_base.php");

loadfs($body, "templates/navigation.php", isset($_SESSION["username"])? "" : ["hide_menu" => true]);

to_log(["URL request", $_SERVER["SCRIPT_NAME"], isset($_SESSION["username"])? $_SESSION["username"] : "not in system"]);
if (!is_access($_SERVER["SCRIPT_NAME"]) && !isset($login_page)) {
    $p = fs("p", "Нет прав для доступа к этой странице");
    $p->setAttribute("style", "color: red; text-align: center;");
    $body->appendChild($p);
    out_page();
    exit;
}

function out_page() {
    echo '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><!-- <!DOCTYPE html> -->';
    echo "\n";
    /** @var DOMDocument $document */
    loadfs($GLOBALS["body"], "templates/page_bottom.php");
    $document = $GLOBALS["document"];
    echo $document->saveHTML();
}