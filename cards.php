<?php

include_once("template.php");
include_once("funs.php");
define("N", "8");

$head->appendChild($document->createElement("title", "Карточки"));
$head->appendChild(scriptfs("cards.js"));

$val = array();
for ($i = 0; $i < N * N; $i++) {
    $val[] = floor($i / 2 + 1);
}
for ($i = 0; $i < N * N; $i++) {
    $ind = rand(0, N * N - 1);
    $t = $val[$i];
    $val[$i] = $val[$ind];
    $val[$ind] = $t;
}
$content = array();
for ($i = 0; $i < N; $i++) {
    for ($j = 0; $j < N; $j++) {
        $label = $document->createElement("label");
        $content[$i][$j] = $document->createElement("div");
        $content[$i][$j]->setAttribute("id", $val[$i * N + $j]);
        $content[$i][$j]->setAttribute("class", "simple");
        $content[$i][$j]->appendChild($label);
    }
}
$table = custom_grid_table($content);
$table->setAttribute("class", "game");
$body->appendChild($table);

$bot_div = fs("div");
$bot_mode = fs("input");
$bot_mode->setAttribute("type", "checkbox");
$bot_mode->setAttribute("id", "bot_mode");
$body->appendChild($bot_mode);
$bot_label = fs("label", "Пусть пока компьютер поиграет сам");
$bot_label->setAttribute("for", "bot_mode");
$body->appendChild($bot_label);
$bot_div->appendChild($bot_mode);
$bot_div->appendChild($bot_label);
$bot_div->setAttribute("style", "margin: 0 auto; display: table;");
$body->appendChild($bot_div);

out_page();
