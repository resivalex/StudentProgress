<?php

include_once("template.php");

$title = $document->createElement("title", "Отметки");
$head->appendChild($title);

$body->appendChild(afs("На главную", "main_interface.php"));
$body->appendChild(brfs());
$body->appendChild(afs("К фильтру", "marks.php"));
$body->appendChild(brfs());

$filter_items = array();
//$filter_items[0][0] = "Курс";
//$cs = $document->createElement("label", "2");
//$filter_items[0][1] = $cs;
//$cs->setAttribute("style", "display:block;width:150px;text-align:right");
//$filter_items[1][0] = "Группа";
//$cs = $document->createElement("label", "Группа3");
//$cs->setAttribute("style", "display:block;width:150px;text-align:right");
//$filter_items[1][1] = $cs;
//$filter_items[2][0] = "Дисциплина";
//$cs = $document->createElement("label", "Гражданское право");
//$cs->setAttribute("style", "display:block;width:150px;text-align:right");
//$filter_items[2][1] = $cs;
$filter_items[0][0] = "Месяц";
$cs = $document->createElement("label", "май 2013");
$cs->setAttribute("style", "display:block;width:100px;text-align:right");
$filter_items[0][1] = $cs;
/** @var $filter_table DOMElement */
$filter_table = custom_grid_table($filter_items);
$filter_table->firstChild->firstChild->setAttribute("style", "width:100px");

$body->appendChild($filter_table);

$content = array();
for ($i = 1; $i <= 31; $i++) {
    $lb = $document->createElement("b");
    $lb->setAttribute("style", "text-align:center");
    $lb->appendChild($document->createTextNode($i));
    $content[0][$i] = $lb;
}
$arr[0] = "н";
$arr[1] = "2";
$arr[2] = "3";
$arr[3] = "4";
$arr[4] = "5";
for ($i = 5; $i <= 100; $i++) $arr[] = "";
srand(1);
for ($i = 1; $i <= 10; $i++) {
    for ($j = 1; $j <= 31; $j++) {
        $lb = $document->createElement("label");
        $lb->setAttribute("style", "display:block;width:30px;text-align:center");
        $lb->appendChild($document->createTextNode($arr[rand(0, 100)]));
        $content[$i][$j] = $lb;
    }
}
$two_table = $document->createElement("table");
$two_table->setAttribute("style", "margin:10px auto");
$two_table->setAttribute("cellspacing", "0");
$tr = $document->createElement("tr");
$two_table->appendChild($tr);
$td1 = $document->createElement("td");
$student_names = "Иностранный язык;Отечественная история;Теория государства и права;Информатика и математика;Естествознание;Экономика;Гражданское право;Культурология;Физическая культура;Русский язык и культура речи";
$snarr = explode(';', $student_names);
$content2 = array();
for ($i = 0; $i <= 10; $i++) {
    if ($i == 0) {
        $name = "Дисциплина";
    } else {
        $name = $document->createElement("label", $snarr[$i - 1]);
    }
    $content2[$i][0] = ($i == 0? "№" : $i);
    $content2[$i][1] = $name;
}
$student_list = custom_grid_table($content2);
$number_rows = $student_list->getElementsByTagName("tr");
$num_row = 0;
foreach ($number_rows as $row) {
    /** @var $row DOMElement */
    if ($num_row == 7) {
        $tds = $row->getElementsByTagName("td");
        foreach ($tds as $td) {
            /** @var $td DOMElement */
            $td->setAttribute("style", "background-color: #EEEEFF");
        }
    }
    $row->firstChild->setAttribute("align", "right");
    $num_row++;
}
$student_list->setAttribute("width", "250px");
$td1->setAttribute("valign", "top");
$tds = $student_list->getElementsByTagName("td");
foreach ($tds as $td) {
    $td->setAttribute("style", $td->getAttribute("style").";padding:3px");
}
$td1->appendChild($student_list);
$tr->appendChild($td1);
$td2 = $document->createElement("td");
$div2 = $document->createElement("div");
$div2->setAttribute("style", "width:450px;overflow-x:auto");
$td2->appendChild($div2);
$tr->appendChild($td2);
$body->appendChild($two_table);
$cgt = custom_grid_table($content);
$cgt->setAttribute("id", "mytable");
$tds = $cgt->getElementsByTagName("td");
foreach ($tds as $td) {
    $td->setAttribute("style", "padding:3px;height:26px");
}
$div2->appendChild($cgt);
$td3 = $document->createElement("td");
$content3 = array();

$tinfo =
    <<<TIN
    История исправлений (2):

"3" (20.05.2013 13:41:35)
"5" (20.05.2013 13:55:06)
TIN;
$div3 = $document->createElement("div");
$div3->setAttribute("valign", "top");
$div3->setAttribute("style", "width:200px;height:260px;overflow-y:auto");

$rep_form = $document->createElement("div");
$ftitle = $document->createElement("b", "Исправление");
$mcomm = $document->createElement("label", "Отметка");
$cs = custom_select("rep", [0, 1, 2, 3], ["", "плохо", "хорошо", "отлично"]);
$cs->setAttribute("style", "width:190px");
$mcomm2 = $document->createElement("label", "Комментарий");
$tar = $document->createElement("textarea");
$tar->setAttribute("style", "width:187px;height:55px");
$btn = $document->createElement("input");
$btn->setAttribute("type", "button");
$btn->setAttribute("value", "Исправить");
$btn->setAttribute("style", "width:190px");

$rep_form->appendChild($ftitle);
$rep_form->appendChild(brfs());
$rep_form->appendChild(brfs());
$rep_form->appendChild($mcomm);
$rep_form->appendChild($cs);
$rep_form->appendChild(brfs());
$rep_form->appendChild(brfs());
$rep_form->appendChild($mcomm2);
$rep_form->appendChild($tar);
$rep_form->appendChild(brfs());
$rep_form->appendChild(brfs());
$rep_form->appendChild($btn);
$white = $document->createElement("div");
$white->setAttribute("style", "background-color:#F7F7FF;border-width:1px;border-color:#CCCCCC;padding:3px");
$white->appendChild($rep_form);

$white->setAttribute("valign", "top");
//$div3->appendChild($white);

$mhistory = $document->createElement("div");
$ftitle = $document->createElement("b", "История отметки (2)");

$mhistory->appendChild($ftitle);

$tab1 = $document->createElement("table");
$tab1->setAttribute("style", "width:190px;border-collapse:collapse");
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "отлично");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "06.05.2013 13:55:06");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "Случайная ошибка");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$mhistory->appendChild($tab1);

$mhistory->appendChild(brfs());

$tab1 = $document->createElement("table");
$tab1->setAttribute("style", "width:190px;border-collapse:collapse");
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "плохо");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "06.05.2013 13:41:35");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$tr1 = $document->createElement("tr");
$td1 = $document->createElement("td", "Устный опрос");
$tr1->appendChild($td1);
$tab1->appendChild($tr1);
$mhistory->appendChild($tab1);
//$mhistory->appendChild($cs);
//$mhistory->appendChild(brfs());
//$mhistory->appendChild(brfs());
//$mhistory->appendChild($mcomm2);
//$mhistory->appendChild($tar);
//$mhistory->appendChild(brfs());
//$mhistory->appendChild(brfs());
//$mhistory->appendChild($btn);
$white = $document->createElement("div");
$white->setAttribute("style", "background-color:#F7F7FF;border-width:1px;border-color:#CCCCCC;padding:3px;position:relative;top:-15px");
$white->setAttribute("valign", "top");
$white->appendChild($mhistory);
$mhistory->setAttribute("valign", "top");

$div3->appendChild(brfs());
$div3->appendChild($white);

$content3[0][0] = $div3;
$cgt3 = custom_grid_table($content3);
$cgt3->firstChild->firstChild->setAttribute("valign", "top");
$tds = $cgt3->getElementsByTagName("td");
foreach ($td as $tds) {
    $td->setAttribute("valign", "top");
}
$cgt3->setAttribute("style", "widht:200px;height:294px");
$td3->setAttribute("valign", "top");
$td3->appendChild($cgt3);
$tr->appendChild($td3);

$script = $document->createElement("script");
$script->setAttribute("type", "text/javascript");
$body->appendChild($script);

$trs = $cgt->getElementsByTagName("tr");
$num_row = 0;
foreach ($trs as $tr) {
    $num_col = 0;
    $tds = $tr->getElementsByTagName("td");
    foreach ($tds as $td) {
        $td->setAttribute("style", $td->getAttribute("style").";text-align:center");
        if (($num_col == 5 && $num_row != 7) || ($num_col != 5 && $num_row == 7)) {
            $td->setAttribute("style", $td->getAttribute("style").";background-color:#EEEEFF");
        }
        if ($num_col == 5 && $num_row == 7) {
            $td->setAttribute("style", $td->getAttribute("style")."padding:2px;height:26px;border-width:2px;background-color:#FFFFFF");
            $td->firstChild->firstChild->nodeValue = "5";
        }
        $num_col++;
    }
    $num_row++;
}


echo $document->saveHTML();
?>
