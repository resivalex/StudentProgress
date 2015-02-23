<?php
include("funs.php");
$document = new DOMDocument();
$arr = array();
$year = $_POST["y"];
$month = $_POST["m"];
$cur = new DateTime();
$cur->setDate($year, $month, 1);
$arr[] = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
$offset = $cur->diff(new DateTime("2000-01-03"))->days % 7;
$row = array();
for ($i = 0; $i < $offset; $i++) {
    $row[] = "";
}
$first = false;
while ($cur->format("m") == $month) {
    $radio = fs("input");
    $radio->setAttribute("type", "radio");
    $radio->setAttribute("name", "day");
    $radio->setAttribute("value", $cur->format("d"));
    $radio->setAttribute("id", "id_".$cur->format("d"));
    if (!$first) {
        $radio->setAttribute("checked", "true");
        $first = true;
    }
    $div = fs("div");
    $div->appendChild($radio);
    $label = fs("label", (int)$cur->format("d"));
    $label->setAttribute("for", "id_".$cur->format("d"));
    $div->appendChild($label);
    $row[] = $div;
    $offset = $cur->diff(new DateTime("2000-01-03"))->days % 7;
    if ($offset == 6) {
        $arr[] = $row;
        $row = array();
    }
    $cur->add(new DateInterval("P1D"));
}
$offset = $cur->diff(new DateTime("2000-01-03"))->days % 7;
if ($offset != 0) {
    do {
        $row[] = "";
        $offset++;
    } while ($offset != 7);
    $arr[] = $row;
}
$document->appendChild(simple_grid_table($arr, "text-align: center"));
echo $document->saveHTML();