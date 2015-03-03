<?php

include_once("queries.php");

echo(json_encode(sql_query($_POST["query"])));
