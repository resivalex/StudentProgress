<?php

function list_div($arr) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $div = $document->createElement("div");
    foreach ($arr as $ar) {
        $div->appendChild($document->createElement("label", $ar));
        $div->appendChild(brfs());
    }
    return $div;
}

include_once("template.php");

$title = $document->createElement("title", "Отчёты");
$head->appendChild($title);

$body->appendChild(afs("На главную", "index.php"));
$body->appendChild(brfs());
$body->appendChild(afs("На главную", "main_interface.php"));
$body->appendChild(brfs());
$body->appendChild(afs("К фильтру", "marks.php"));
$body->appendChild(brfs());

$filter_items = array();
$filter_items[0][0] = "Тип отчёта";
$cs = $document->createElement("label", "Количество отметок");
$filter_items[0][1] = $cs;
$cs->setAttribute("style", "display:block;width:150px;text-align:right");
//$filter_items[1][0] = "Упорядочить";
//$cs = $document->createElement("label", "Группа");
//$cs->setAttribute("style", "display:block;width:150px;text-align:right");
//$filter_items[1][1] = $cs;
$filter_table = custom_grid_table($filter_items);

$body->appendChild($filter_table);

$link = $document->createElement("b", "Фильтры");
$divl = $document->createElement("div");
$divl->setAttribute("align", "center");
$divl->appendChild($link);
$body->appendChild($divl);
$ar[0][0] = "Курсы";
$ar[0][1] = "-";
$ar[1][0] = "Группы";
$ar[1][1] = list_div(["Группа2, Группа3, Группа5"]);//"Группа2, Группа3, Группа4, Группа5";
$ar[2][0] = "Дисциплины";
$ar[2][1] = list_div(["Естествознание, Культурология"]);
$ar[3][0] = "Преподаватели";
$ar[3][1] = "-";
$ar[4][0] = "Типы отметок";
$ar[4][1] = "отсутствовал";
$ar[5][0] = "Интервал";
$ar[5][1] = list_div(["01.05.2013 - 27.05.2013"]);
$ar[6][0] = "Упорядочить";
$ar[6][1] = list_div(["Количество (убыв.), Группа (возр.)"]);
$settings = custom_grid_table($ar);
$settings->setAttribute("width", "400");
$body->appendChild($settings);

$body->appendChild(brfs());
$link = $document->createElement("b", "Отчёт");
$divl = $document->createElement("div");
$divl->setAttribute("align", "center");
$divl->appendChild($link);
$body->appendChild($divl);


$content2 = array();
for ($i = 0; $i <= 6; $i++) {
    if ($i == 0) {
        $name = "Студент";
    } else {
        $name = $document->createElement("label", "+");
    }
    $content2[$i][0] = ($i == 0? $document->createElement("b", "№") : $i);
    $content2[$i][1] = ($i == 0? $document->createElement("b", "Курс") : $i);
    $content2[$i][2] = ($i == 0? $document->createElement("b", "Группа") : $i);
    $content2[$i][3] = ($i == 0? $document->createElement("b", "Дисциплина") : $i);
    $content2[$i][4] = ($i == 0? $document->createElement("b", "Преподаватель") : $i);
    $content2[$i][5] = ($i == 0? $document->createElement("b", "Тип отметки") : $i);
    $content2[$i][6] = ($i == 0? $document->createElement("b", "Количество") : $i);
}
$content2[1][1] = "3";
$content2[2][1] = "1";
$content2[3][1] = "2";
$content2[4][1] = "3";
$content2[5][1] = "2";
$content2[6][1] = "1";
$content2[1][2] = "Группа5";
$content2[2][2] = "Группа2";
$content2[3][2] = "Группа3";
$content2[4][2] = "Группа5";
$content2[5][2] = "Группа3";
$content2[6][2] = "Группа2";
$content2[1][3] = "Культурология";
$content2[2][3] = "Культурология";
$content2[3][3] = "Естествознание";
$content2[4][3] = "Культурология";
$content2[5][3] = "Естествознание";
$content2[6][3] = "Естествознание";
$content2[1][4] = "Карпова Ю. П.";
$content2[2][4] = "Карпова Ю. П.";
$content2[3][4] = "Огнев А. А.";
$content2[4][4] = "Карпова Ю. П.";
$content2[5][4] = "Огнев А. А.";
$content2[6][4] = "Огнев А. А.";
$content2[1][5] = "отсутствовал";
$content2[2][5] = "отсутствовал";
$content2[3][5] = "отсутствовал";
$content2[4][5] = "отсутствовал";
$content2[5][5] = "отсутствовал";
$content2[6][5] = "отсутствовал";
$content2[1][6] = "33";
$content2[2][6] = "25";
$content2[3][6] = "19";
$content2[4][6] = "19";
$content2[5][6] = "17";
$content2[6][6] = "16";
$table = custom_grid_table($content2);
$table->setAttribute("width", "800");
$body->appendChild($table);

$link = $document->createElement("input");
$link->setAttribute("type", "button");
$link->setAttribute("value", "Сохранить в формате .csv (Excel)");
$divl = $document->createElement("div");
$divl->setAttribute("align", "center");
$divl->appendChild($link);
$body->appendChild($divl);

$tds = $table->getElementsByTagName("td");
foreach ($tds as $td) {
    $td->setAttribute("align", "center");
}

out_page();
