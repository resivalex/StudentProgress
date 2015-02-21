<?php
	include_once("template.php");
	
	unset($_SESSION["username"]);
    unset($_SESSION["roles"]);
	header("Location: index.php");
	
	echo $document->saveHTML();
?>