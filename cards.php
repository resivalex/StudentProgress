<?php
	include_once("template.php");
	include_once("funs.php");
	define("N", "8");
	
	$head->appendChild($document->createElement("title", "Карточки"));
	
	$a = $document->createElement("a", "На главную");
	$a->setAttribute("href", "index.php");
	$body->appendChild($a);
	
	$form = post_form($document, "cards.php");
	$body->appendChild($form);
	
	//session_start();
	if (!isset($_SESSION["card"]) || !isset($_POST["row"])) {
		$card = array();
		$open = array();
		for ($i = 0; $i < N; $i++) {
			for ($j = 0; $j < N; $j++) {
				$card[$i][$j] = (N / 2) * $i + ($j - $j % 2) / 2 + 1;
				$open[$i][$j] = 0;
			}
		}
		$card[-1][-1] = -1;
		$open[-1][-1] = 0;
		for ($i = 0; $i < 1000; $i++) {
			$x1 = rand(0, N - 1);
			$y1 = rand(0, N - 1);
			$x2 = rand(0, N - 1);
			$y2 = rand(0, N - 1);
			$temp = $card[$y1][$x1];
			$card[$y1][$x1] = $card[$y2][$x2];
			$card[$y2][$x2] = $temp;
		}
		$_SESSION["card"] = $card;
		$_SESSION["open"] = $open;
	}
	$card = $_SESSION["card"];
	$open = $_SESSION["open"];
	
	if (isset($_POST["row"])) {
		$row = $_POST["row"];
		$col = $_POST["col"];
		if ($open[$row][$col] == 0) $open[$row][$col] = 1;
	}
	$cnt1 = 0;
	for ($i = 0; $i < N; $i++) {
		for ($j = 0; $j < N; $j++) {
			if ($open[$i][$j] == 1) $cnt1++;
		}
	}
	if ($cnt1 == 2) {
		for ($i = 0; $i < N; $i++) {
			for ($j = 0; $j < N; $j++) {
				if ($open[$i][$j] == 1) {
					$open[$i][$j] = 3;
				}
			}
		}
	} elseif ($cnt1 == 1) {
		$cnt3 = 0;
		$coord = array();
		for ($i = 0; $i < N; $i++) {
			for ($j = 0; $j < N; $j++) {
				if ($open[$i][$j] == 3) {
					$coord[] = array($j, $i);
					$cnt3++;
				}
			}
		}
		if ($cnt3 == 2) {
			$x1 = $coord[0][0];
			$y1 = $coord[0][1];
			$x2 = $coord[1][0];
			$y2 = $coord[1][1];
			if ($card[$y1][$x1] == $card[$y2][$x2]) {
				$open[$y1][$x1] = 2;
				$open[$y2][$x2] = 2;
			} else {
				$open[$y1][$x1] = 0;
				$open[$y2][$x2] = 0;
			}
		}
	}
	$cnt2 = 0;
	for ($i = 0; $i < N; $i++) {
		for ($j = 0; $j < N; $j++) {
			if ($open[$i][$j]) $cnt2++;
		}
	}
	if ($cnt2 == N * N) {
		header("Location: good.php");
	}
	
	for ($i = 0; $i < N; $i++) {
		for ($j = 0; $j < N; $j++) {
			if ($open[$i][$j]) {
				$content[$i][$j] = $document->createElement("label", $card[$i][$j]);
			} else {
				$content[$i][$j] = $document->createElement("label", "");
			}
			if (isset($_POST["row"])) {
				$class = ($open[$i][$j] == 1 || $open[$i][$j] == 3)? "unclose" : "simple";
			} else {
				$class = "simple";
			}
			$label = $content[$i][$j];
			$content[$i][$j] = $document->createElement("div");
			$content[$i][$j]->setAttribute("class", $class);
			$content[$i][$j]->setAttribute("onclick", "open_card($i,$j)");
			$content[$i][$j]->appendChild($label);
		}
	}
	$table = custom_grid_table($content);
	$table->setAttribute("class", "game");
	$form->appendChild($table);
	
	$_SESSION["card"] = $card;
	$_SESSION["open"] = $open;
	
	$hidden = hidden("col", "");
	$hidden->setAttribute("id", "col");
	$form->appendChild($hidden);
	$hidden = hidden("row", "");
	$hidden->setAttribute("id", "row");
	$form->appendChild($hidden);
	
	echo $document->saveHTML();
?>