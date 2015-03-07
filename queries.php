<?php

//$sql = new mysqli("p:localhost", "h78268_root", "m3i4n3t", "h78268_sp");
$sql = new mysqli("p:localhost", "root", "m3i4n3t", "student_progress");
$sql->query("SET NAMES 'utf8'");

function to_log($text) {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];

    $action = $sql->escape_string(json_encode($text));
    $sql->query("INSERT INTO log (time, action) VALUES (CURRENT_TIMESTAMP, '$action')");
}

function sql_query($query) {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];

    to_log($query);
    $result = "";
    if (gettype($query) == "string") {
        $query = [$query];
    }
    if (gettype($query) == "array") {
        $sql->autocommit(false);
        for ($i = 0; $i < count($query); $i++) {
            $text = "";
            $from = 0;
            $j = $i;
            do {
                $to = strpos($query[$i], "?", $from);
                if ($to === false) {
                    $text .= substr($query[$i], $from);
                    $result = $sql->query($text);
                    if ($result === false) {
                        $error = $sql->error;
                        $sql->rollback();
                        $sql->autocommit(true);
                        to_log($error);

                        return false;
                    }
                } else {
                    $text .= substr($query[$i], $from, $to - $from);
                    $text .= "'{$sql->escape_string($query[++$j])}'";
                    $from = $to + 1;
                }
            } while ($to !== false);
            $i = $j;
        }
        $sql->commit();
        $sql->autocommit(true);
        if (gettype($result) != "boolean") {
            $select_result = [];
            while ($field = $result->fetch_field()) {
                $select_result[$field->name] = array();
            }
            while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
                foreach ($row as $field => $value) {
                    $select_result[$field][] = $value;
                }
            }
            return $select_result;
        }
        return $result;
    } else {
        return false;
    }
}
