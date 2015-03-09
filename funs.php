<?php

function custom_select($name, $values, $names) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $select = $document->createElement("select");
    $select->setAttribute("name", $name);
    for ($i = 0; $i < count($values); $i++) {
        $option = $document->createElement("option", $names[$i]);
        $option->setAttribute("value", $values[$i]);
        $select->appendChild($option);
    }

    return $select;
}

function input_text($name) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $input = $document->createElement("input");
    $input->setAttribute("type", "text");
    $input->setAttribute("name", $name);

    return $input;
}

function submit($label) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $input = $document->createElement("input");
    $input->setAttribute("type", "submit");
    $input->setAttribute("value", $label);

    return $input;
}

function fs($tag, $body = "") {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    return $document->createElement($tag, $body);
}

function afs($what, $where) {
    $a = fs("a", $what);
    $a->setAttribute("href", $where);

    return $a;
}

function brfs() {
    return fs("br");
}

/**
@return  DOMElement  форма
 */
function post_form(DOMDocument $document, $path) {
    $form = $document->createElement("form");
    $form->setAttribute("action", $path);
    $form->setAttribute("method", "POST");
    $form->setAttribute("accept-charset", "UTF-8");

    return $form;
}

function transverse($arr) {
    $res = array();
    $row_keys = array_keys($arr);
    $col_keys = array_keys($arr[$row_keys[0]]);
    if (count($row_keys) == 0 || count($col_keys) == 0) return array();
    foreach ($col_keys as $col_key) {
        foreach ($row_keys as $row_key) {
            $res[$col_key][$row_key] = $arr[$row_key][$col_key];
        }
    }

    return $res;
}

function simple_grid_table($items, $cell_style = "") {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $table = $document->createElement("table");
    foreach ($items as $item) {
        $tr = $document->createElement("tr");
        $table->appendChild($tr);
        foreach ($item as $val) {
            $td = $document->createElement("td");
            $tr->appendChild($td);
            if (gettype($val) != "object") {
                $val = new DOMText($val);
            }
            $td->appendChild($val);
            if ($cell_style != "") {
                $td->setAttribute("style", $cell_style);
            }
        }
    }

    return $table;
}

function custom_grid_table($items, $cell_style = "") {
    $result = simple_grid_table($items, $cell_style);
    $result->setAttribute("class", "custom_table");
    return $result;
}

function scriptfs($path) {
    $script = fs("script");
    $script->setAttribute("type", "text/javascript");
    $script->setAttribute("src", $path);
    $script->setAttribute("charset", "UTF-8");
    return $script;
}

function hiddenfs($id, $value) {
    $hidden = fs("input");
    $hidden->setAttribute("type", "hidden");
    $hidden->setAttribute("id", $id);
    $hidden->setAttribute("value", $value);
    return $hidden;
}

function divfs($id, $class = "") {
    $div = fs("div");
    $div->setAttribute("id", $id);
    if ($class != "") $div->setAttribute("class", $class);
    return $div;
}