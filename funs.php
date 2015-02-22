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

// инструмент для выбора одного из нескольких доступных вариантов
function select_tool($title, $name, $arr) {
    $result = fs("div");
    $result->setAttribute("class", "radio-toolbar");
    // заголовок
    $top = fs("div");
    $top->setAttribute("style", "border-style: outset; border-width: 1px; border-color: #8888AA; height: 30px;");
    $top_title = fs("label", $title);
    $top_title->setAttribute("style", "margin-top:5px; margin-left:5px;");
    $top->appendChild($top_title);
    $sep = fs("div");
    $top->setAttribute("onclick", "selectToolClick(this)");
    $result->appendChild($top);
    // переключатели
    $box = fs("div");
    $box->setAttribute("style", "display: none;");
    foreach ($arr as $line) {
        $cells = array_values($line);
        $radio = fs("input");
        $radio->setAttribute("type", "radio");
        $radio->setAttribute("name", $name);
        $radio->setAttribute("value", $cells[0]);
        $radio->setAttribute("id", $name."_".$cells[0]);
        if (!isset($first)) {
            $first = $radio;
            $top_label = fs("label", $cells[1]);
            $top_label->setAttribute("class", "right_note");
            $top_label->setAttribute("style", "margin-top:5px; margin-right:5px;");
            $top->appendChild($top_label);
        }
        $box->appendChild($radio);
        $label = fs("label", $cells[1]);
        $label->setAttribute("onclick", "$(this).parent().parent().find('.right_note').html($(this).html());$(this).parent().slideUp();");
        $label->setAttribute("for", $name."_".$cells[0]);
        if (!isset($first_label)) $first_label = $label;
        $box->appendChild($label);
        $box->appendChild(brfs());
    }
    $result->appendChild($box);
    if (isset($first)) {
        $first->setAttribute("checked", "true");
    }
    return $result;
}

function select(DOMDocument $document, $query, $name, $value, $title) {
    $select = $document->createElement("select");
    $select->setAttribute("name", $name);
    $res = mysql_query($query);
    while ($row = mysql_fetch_assoc($res)) {
        $option = $document->createElement("option", call_user_func($title, $row));
        $option->setAttribute("value", call_user_func($value, $row));
        $select->appendChild($option);
    }

    return $select;
}

function get_id($row) {
    return $row['id'];
}

function get_pairs($query) {
    return transverse(select_query($query));
}

function get_name($row) {
    return $row['name'];
}

function get_full_name($row) {
    return $row['surname']." ".$row['name']." ".$row['patronymic'];
}

function get_number($row) {
    return $row['number'];
}

function get_course_name($row) {
    return $row['number']." курс";
}

function select_student($document) {
    $query = "SELECT id, surname, name, patronymic FROM students";
    return select($document, $query, "student_id", "get_id", "get_full_name");
}

function select_group() {
    $smth = get_id_name_from_groups();
    $smth->bind_result($id, $name);
    $values = array();
    $names = array();
    while ($smth->fetch()) {
        $values[] = $id;
        $names[] = $name;
    }
    $smth->close();

    return custom_select("group_id", $values, $names);
}

function select_group_in_course($course_number) {
    $result = get_id_name_from_groups_in_course($course_number);

    return custom_select("group_id", $result["id"], $result["name"]);
}

function select_course() {
    $sql = $GLOBALS["sql"];
    $document = $GLOBALS["document"];
    $query = "SELECT number FROM courses ORDER BY number";
    $res = $sql->query($query);
    while ($row = $res->fetch_assoc()) {
        $values[] = $row["number"];
        $names[] = $row["number"]." курс";
    }

    return custom_select("course_number", $values, $names);
}

function get_subject($row) {
    return $row["name"];
}

function get_lesson($row) {
    $subject = $row["subject_name"];
    $group = $row["group_name"];
    $teacher = $row["surname"];

    return "$subject $group $teacher";
}

function select_lesson($document) {
    $query =
<<<'SQL'
SELECT lessons.id, subjects.name AS subject_name, groups.name AS group_name, teachers.surname
FROM lessons
JOIN subjects ON (subject_id = subjects.id)
JOIN groups ON (group_id = groups.id)
JOIN teachers ON (teacher_id = teachers.id)
SQL;
    return select($document, $query, "lesson_id", "get_id", "get_lesson");
}

function select_mark_type($document) {
    $query = "SELECT id, name FROM mark_types";
    return select($document, $query, "mark_type_id", "get_id", "get_name");
}

function select_subject() {
    $result = get_id_name_from_subjects();

    return custom_select("subject_id", $result["id"], $result["name"]);
}

function select_teacher() {
    $smth = get_id_surname_name_patronymic_from_teachers();
    $values = array();
    $names = array();
    $name = "";
    $patronymic = "";
    $smth->bind_result($id, $surname, $name, $patronymic);
    while ($smth->fetch()) {
        $values[] = $id;
        $names[] = "$surname $name $patronymic";
    }
    $smth->close();

    return custom_select("teacher_id", $values, $names);
}

function input_text($name) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $input = $document->createElement("input");
    $input->setAttribute("type", "text");
    $input->setAttribute("name", $name);

    return $input;
}

function input_row(DOMDocument $document, $label, $input_element) {
    $tr = $document->createElement("tr");
    $td = $document->createElement("td", $label);
    $tr->appendChild($td);
    $td = $document->createElement("td");
    $td->appendChild($input_element);
    $tr->appendChild($td);

    return $tr;
}

function submit($label) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $input = $document->createElement("input");
    $input->setAttribute("type", "submit");
    $input->setAttribute("value", $label);

    return $input;
}

function submit_form(DOMDocument $document, $label) {
    $tr = $document->createElement("tr");
    $td = $document->createElement("td");
    $td->setAttribute("colspan", "2");
    $td->setAttribute("align", "center");
    $tr->appendChild($td);
    $input = $document->createElement("input");
    $input->setAttribute("type", "submit");
    $input->setAttribute("value", $label);
    $td->appendChild($input);

    return $tr;
}

function a_link(DOMDocument $document, $href, $label) {
    $a = $document->createElement("a", $label);
    $a->setAttribute("href", $href);

    return $a;
}

function get_teaching($row) {
    return get_lesson($row)." ".$row["date"];
}

function select_teaching($document) {
    $query =
<<<'SQL'
SELECT teachings.id, subjects.name AS subject_name, groups.name AS group_name, teachers.surname, teachings.date
FROM teachings
JOIN lessons ON (lesson_id = lessons.id)
JOIN subjects ON (subject_id = subjects.id)
JOIN groups ON (group_id = groups.id)
JOIN teachers ON (teacher_id = teachers.id)
SQL;
    return select($document, $query, "teaching_id", "get_id", "get_teaching");
}

function add_empty_line_in_select(DOMDocument $document, $select) {
    $option = $document->createElement("option");
    $options = $select->getElementsByTagName("option");
    $select->insertBefore($option, $options->item(0));

    return $select;
}

function grid_table(DOMDocument $document, $rows, $cols, $content) {
    $table = $document->createElement("table");
    $table->setAttribute("class", "grid_table");
    for ($i = 0; $i <= count($rows); $i++) {
        $tr = $document->createElement("tr");
        $tr->setAttribute("class", "grid_row");
        $table->appendChild($tr);
        for ($j = 0; $j <= count($cols); $j++) {
            $text = null;
            if ($i == 0 && $j > 0) $text = $cols[$j - 1];
            if ($i > 0 && $j == 0) $text = $rows[$i - 1];
            if ($i > 0 && $j > 0 && isset($content) && isset($content[$rows[$i - 1]]) && isset($content[$rows[$i - 1]][$cols[$j - 1]])) {
                $text = $content[$rows[$i - 1]][$cols[$j - 1]];
            }
            $td = $document->createElement("td", $text);
            $td->setAttribute("class", "grid_cell");
            $tr->appendChild($td);
        }
    }

    return $table;
}

function column_table(DOMDocument $document, $cols, $rows) {
    $table = $document->createElement("table");
    $table->setAttribute("class", "grid_table");
    $tr = $document->createElement("tr");
    $tr->setAttribute("class", "grid_row");
    $table->appendChild($tr);
    for ($i = 0; $i < count($cols); $i++) {
        $th = $document->createElement("th", $cols[$i]);
        $th->setAttribute("class", "grid_cell");
        $tr->appendChild($th);
    }
    for ($i = 0; $i < count($rows); $i++) {
        $tr = $document->createElement("tr");
        $tr->setAttribute("class", "grid_row");
        $table->appendChild($tr);
        for ($j = 0; $j < count($cols); $j++) {
            $text = $rows[$i][$j];
            $td = $document->createElement("td", $text);
            $td->setAttribute("class", "grid_cell");
            $tr->appendChild($td);
        }
    }

    return $table;
}

function two_info_table(DOMDocument $document, $left, $right) {
    $table = $document->createElement("table");
    $table->setAttribute("class", "grid_table");
    for ($i = 0; $i < count($left); $i++) {
        $tr = $document->createElement("tr");
        $tr->setAttribute("class", "grid_row");
        $table->appendChild($tr);
        $td = $document->createElement("td", $left[$i]);
        $td->setAttribute("class", "grid_cell");
        $tr->appendChild($td);
        $td = $document->createElement("td", $right[$i]);
        $td->setAttribute("class", "grid_cell");
        $tr->appendChild($td);
    }

    return $table;
}

function input_form(DOMDocument $document, $title, $text, $input, $submit_name) {
    $table = fs("table");
    $table->setAttribute("class", "input_table");
    $tr = $document->createElement("tr");
    $table->appendChild($tr);
    $th = $document->createElement("th", $title);
    $th->setAttribute("colspan", "2");
    $tr->appendChild($th);
    for ($i = 0; $i < count($text); $i++) {
        $tr = $document->createElement("tr");
        $table->appendChild($tr);
        $td = $document->createElement("td", $text[$i]);
        $tr->appendChild($td);
        $td = $document->createElement("td");
        $td->appendChild($input[$i]);
        $tr->appendChild($td);
    }
    $tr = $document->createElement("tr");
    $table->appendChild($tr);
    $td = $document->createElement("td");
    $td->setAttribute("colspan", "2");
    $td->setAttribute("align", "center");
    $tr->appendChild($td);
    $submit = $document->createElement("input");
    $submit->setAttribute("type", "submit");
    $submit->setAttribute("value", $submit_name);
    $td->appendChild($submit);

    return $table;
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

function formfs($action_url) {
    $form = fs("form");
    $form->setAttribute("accept-charset", "utf-8");
    $form->setAttribute("method", "POST");
    $form->setAttribute("action", $action_url);

    return $form;
}

function get_table_name($row) {
    $keys = array_keys($row);
    return $row[$keys[0]];
}

function select_table() {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];
    $document = $GLOBALS["document"];

    $query = "SHOW TABLES FROM student_progress";
    $values = array();
    $names = array();
    $result = $sql->query($query);
    while ($row = $result->fetch_array()) {
        $values[] = $row[0];
        $names[] = $row[0];
    }

    return custom_select("table", $values, $names);
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

function hidden($name, $value) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $hidden = $document->createElement("input");
    $hidden->setAttribute("type", "hidden");
    $hidden->setAttribute("name", $name);
    $hidden->setAttribute("value", $value);

    return $hidden;
}

function input_grid_form(DOMDocument $document, $rows, $cols, $input) {
    $table = $document->createElement("table");
    $table->setAttribute("class", "grid_table");
    for ($i = 0; $i <= count($rows); $i++) {
        $tr = $document->createElement("tr");
        $tr->setAttribute("class", "grid_row");
        $table->appendChild($tr);
        for ($j = 0; $j <= count($cols); $j++) {
            $text = null;
            if ($i == 0 && $j > 0) $text = $cols[$j - 1];
            if ($i > 0 && $j == 0) $text = $rows[$i - 1];
            $td = $document->createElement("td", $text);
            if ($i > 0 && $j > 0) {
                $input_element = $input[$i - 1][$j - 1];
                $td->appendChild($input_element);
            }
            $td->setAttribute("class", "grid_cell");
            $tr->appendChild($td);
        }
    }

    return $table;
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

function message($text) {
    /** @var $document DOMDocument */
    $document = $GLOBALS["document"];
    $div = $document->createElement("div", $text);
    $div->setAttribute("class", "message");

    return $div;
}

function generate_password() {
    $s = "";
    $c = "abcdefghigklmnopqrstuvwxyz0123456789";
    for ($i = 0; $i < 10; $i++) {
        $s .= $c[rand(0, strlen($c) - 1)];
    }
    return $s;
}
?>