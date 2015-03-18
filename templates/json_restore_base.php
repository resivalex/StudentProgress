<?php

//header('Content-Type: text/plain; charset=utf-8');
?>
<p style="text-align: center;">
<?php
try {

    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($_FILES['backup']['error']) ||
        is_array($_FILES['backup']['error'])
    ) {
        throw new RuntimeException('Неверные параметры.');
    }

    // Check $_FILES['upfile']['error'] value.
    switch ($_FILES['backup']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('Файл не отправлен.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Слишком большой файл.');
        default:
            throw new RuntimeException('Неизвестная ошибка.');
    }

    // You should also check filesize here. 
    if ($_FILES['backup']['size'] > 10000000) {
        throw new RuntimeException('Слишком большой файл.');
    }

    // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
    // Check MIME Type by yourself.
//    $finfo = new finfo(FILEINFO_MIME_TYPE);
//    if (false === $ext = array_search(
//            $finfo->file($_FILES['backup']['tmp_name']),
//            array(
//                'jpg' => 'image/jpeg',
//                'png' => 'image/png',
//                'gif' => 'image/gif',
//            ),
//            true
//        )) {
//        throw new RuntimeException('Invalid file format.');
//    }

    // You should name it uniquely.
    // DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
    // On this example, obtain safe unique name from its binary data.
//    if (!move_uploaded_file(
//        $_FILES['backup']['tmp_name'],
//        sprintf('./uploads/%s.%s',
//            sha1_file($_FILES['backup']['tmp_name']),
//            $ext
//        )
//    )) {
//        throw new RuntimeException('Failed to move uploaded file.');
//    }

    echo 'Файл загружен успешно.';
    $ok = true;

} catch (RuntimeException $e) {

    echo $e->getMessage();

}
echo "</p>";

if (isset($ok)) {
    $content = file_get_contents($_FILES["backup"]["tmp_name"]);
//echo <<<HTML
//<div style="margin: auto; overflow: auto; width: 720px; height: 360px">
//<pre>$content</pre>
//</div>
//HTML;
    $content = json_decode($content, true);
    echo "<div class=\"auto_margin\" style=\"width: 90%;\">";
    /** @var mysqli $sql */
    $sql = $GLOBALS["sql"];
    foreach ($content as $table_name => $table) {
        foreach ($table as $row) {
            $query_left = "INSERT INTO $table_name (";
            $query_right = "VALUES (";
            foreach ($row as $field => $value) {
                $query_left .= $field . ", ";
                $query_right .= "'" . $sql->escape_string($value) . "', ";
            }
            $query_left = substr($query_left, 0, count($query_left) - 3);
            $query_right = substr($query_right, 0, count($query_right) - 3);
            $query = $query_left . ") " . $query_right . ")";
            $res = $sql->query($query) ? "OK" : $sql->error;
            $color = $res == "OK" ? "#afa" : "#faa";
            echo "<pre style=\"background-color: $color; overflow: auto;\">$query\n$res</pre>";
        }
    }
    echo "</div>";
}