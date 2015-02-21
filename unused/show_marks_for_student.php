<?php
	$tab = array();
		
	$username = $_SESSION["username"];
	$student_id = get_student_id_from_username($username);

	$tab = array();
	
	$tab[0][0] = "Фамилия";
	$tab[1][0] = "Имя";
	$tab[2][0] = "Отчество";
	
	$query =
<<<SQL
SELECT surname, name, patronymic
FROM students
WHERE id = ?
SQL;
	$full_name = select_query($query, array("i", $student_id));
	
	$tab[0][1] = $full_name["surname"][0];
	$tab[1][1] = $full_name["name"][0];
	$tab[2][1] = $full_name["patronymic"][0];
	
	$table = custom_grid_table($tab);
	$body->appendChild($table);
	
	$query =
<<<SQL
SELECT DISTINCT teachings.date
FROM marks
JOIN mark_types ON (marks.mark_type_id = mark_types.id)
JOIN teachings ON (teaching_id = teachings.id)
JOIN lessons ON (lesson_id = lessons.id)
JOIN subjects ON (subject_id = subjects.id)
WHERE student_id = ?
ORDER BY teachings.date
SQL;
	$result = select_query($query, array("i", $student_id));
	$dates = $result["date"];
	$ndates = array();
	foreach ($dates as $key => $value) {
		$ndates[$value] = $key;
	}
	
	$query =
<<<SQL
SELECT DISTINCT subjects.name
FROM marks
JOIN mark_types ON (marks.mark_type_id = mark_types.id)
JOIN teachings ON (teaching_id = teachings.id)
JOIN lessons ON (lesson_id = lessons.id)
JOIN subjects ON (subject_id = subjects.id)
WHERE student_id = ?
ORDER BY subjects.name
SQL;
	$result = select_query($query, array("i", $student_id));
	$subjects = $result["name"];
	$nsubjects = array();
	foreach ($subjects as $key => $value) {
		$nsubjects[$value] = $key;
	}
	
	$query =
<<<SQL
SELECT subjects.name AS subject_name, mark_types.name AS mark_type_name, teachings.date
FROM marks
JOIN mark_types ON (marks.mark_type_id = mark_types.id)
JOIN teachings ON (teaching_id = teachings.id)
JOIN lessons ON (lesson_id = lessons.id)
JOIN subjects ON (subject_id = subjects.id)
WHERE student_id = ?
SQL;
	$result = select_query($query, array("i", $student_id));
		
	$tab = array();
	
	for ($i = 0; $i <= count($subjects); $i++) {
		for ($j = 0; $j <= count($dates); $j++) {
			$tab[$i][$j] = "";
		}
	}
	for ($i = 0; $i < count($subjects); $i++) {
		$tab[$i + 1][0] = $subjects[$i];
	}
	for ($i = 0; $i < count($dates); $i++) {
		$tab[0][$i + 1] = $dates[$i];
	}
	for ($i = 0; $i < count($result["subject_name"]); $i++) {
		$tab[$nsubjects[$result["subject_name"][$i]] + 1][$ndates[$result["date"][$i]] + 1] = $result["mark_type_name"][$i];
	}
	
	$table = custom_grid_table($tab);
	$body->appendChild($table);
?>