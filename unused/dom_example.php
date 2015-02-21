<?php
$document = new DOMDocument();
$document->formatOutput = true;
$html = $document->createElement("html");
$document->appendChild($html);
$head = $document->createElement("head");
$body = $document->createElement("body");
$html->appendChild($head);
$html->appendChild($body);
$meta = $document->createElement("meta");
$meta->setAttribute("equiv", "Content-Type");
$meta->setAttribute("content", "text/html; Charset=Windows-1251");
$head->appendChild($meta);
$head->appendChild($document->createElement("title", "DOM Example"));
$h1 = $document->createElement("h1", "Paragraph");
$body->appendChild($h1);

$select = $document->createElement("select");
for ($i = 0; $i < 10; $i++) {
	$option = $document->createElement("option", $i);
	$option->setAttribute("value", $i);
	$select->appendChild($option);
}
$body->appendChild($select);

echo $document->saveXML();
?>