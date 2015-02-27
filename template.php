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

$meta = $document->createElement("meta");
$meta->setAttribute("http-equiv", "Content-Type");
$meta->setAttribute("content", "text/html; Charset=UTF-8");
$head->appendChild($meta);

$no_cache = $document->createElement("meta");
$no_cache->setAttribute("http-equiv", "pragma");
$no_cache->setAttribute("content", "no-cache");
$head->appendChild($no_cache);

$link = $document->createElement("link");
$link->setAttribute("rel", "stylesheet");
$link->setAttribute("type", "text/css");
$link->setAttribute("href", "style.css");
$head->appendChild($link);

// jquery ui css
$link = $document->createElement("link");
$link->setAttribute("rel", "stylesheet");
$link->setAttribute("type", "text/css");
$link->setAttribute("href", "jquery-ui-1.11.3.custom/jquery-ui.css");
$head->appendChild($link);

$icon_link = $document->createElement("link");
$icon_link->setAttribute("rel", "shortcut icon");
$icon_link->setAttribute("type", "image/png");
$icon_link->setAttribute("href", "favicon.png");
$head->appendChild($icon_link);

$script = $document->createElement("script");
$script->setAttribute("type", "text/javascript");
$script->setAttribute("src", "jquery-2.1.3.js");
$script->setAttribute("charset", "UTF-8");
$head->appendChild($script);

// jquery ui script
$script = $document->createElement("script");
$script->setAttribute("type", "text/javascript");
$script->setAttribute("src", "jquery-ui-1.11.3.custom/jquery-ui.js");
$script->setAttribute("charset", "UTF-8");
$head->appendChild($script);

// my script
$script = $document->createElement("script");
$script->setAttribute("type", "text/javascript");
$script->setAttribute("src", "script.js");
$script->setAttribute("charset", "UTF-8");
$head->appendChild($script);

if (isset($_SESSION["username"])) {
    $body->appendChild(fs("script", "$('body').append(navigationMenu())"));
}

echo '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><!-- <!DOCTYPE html> -->';
echo "\n";
?> 