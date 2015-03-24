<?php

$queries_without_params = [
    "groups" => <<<SQL
SELECT id, name
FROM groups
ORDER BY name
SQL
    ,
    "teachers" => <<<SQL
SELECT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name
FROM teachers
JOIN users
ON teachers.id = users.id
ORDER BY name
SQL
    ,
    "subjects" => <<<SQL
SELECT id, name
FROM subjects
ORDER BY name
SQL
    ,
    "auditories" => <<<SQL
SELECT id, name
FROM auditories
ORDER BY name
SQL
    ,
    "non-empty groups" => <<<SQL
SELECT DISTINCT groups.id, groups.name
FROM groups
JOIN students ON groups.id = students.group_id
ORDER BY groups.name
SQL
    ,
    "mark types" => <<<SQL
SELECT id, short_name
FROM mark_types
ORDER BY short_name
SQL
    ,
    "involved teachers" => <<<SQL
SELECT DISTINCT teachers.id,
concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name
FROM teachers
JOIN users ON teachers.id = users.id
JOIN lessons ON teachers.id = lessons.teacher_id
ORDER BY teacher_name
SQL
    ,
    "involved groups" => <<<SQL
SELECT DISTINCT groups.id, groups.name FROM groups
JOIN lessons ON (groups.id = lessons.group_id)
ORDER BY groups.name
SQL

];

$query_functions["add user"] = function($pm) {
    $text = <<<SQL
INSERT INTO users
(name, surname, patronymic, login, password, role_id, email, phone)
VALUES
(?, ?, ?, ?, ?, (SELECT id FROM roles WHERE name = ?), ?, ?)
SQL;
    $query = [
        $text,
        $pm["name"],
        $pm["surname"],
        $pm["patronymic"],
        $pm["login"],
        $pm["password"],
        $pm["role_name"],
        $pm["email"],
        $pm["phone"]
    ];
    if ($pm["role_name"] == "student") {
        $student_text = <<<SQL
INSERT INTO students
(id, group_id)
VALUES
((SELECT max(id) FROM users), ?)
SQL;
        array_push($query, $student_text, $pm["group_id"]);
    } else {
        $table_map = [
            "student" => "students",
            "teacher" => "teachers",
            "chief" => "chiefs"
        ];
        $table = $table_map[$pm["role_name"]];
        $role_text = <<<SQL
INSERT INTO $table
(id)
VALUES
((SELECT max(id) FROM users))
SQL;
        array_push($query, $role_text);
    }
    return sql_query($query);
};

foreach ($queries_without_params as $name => $text) {
    $query_functions[$name] = function() use($text) {
        return sql_query($text);
    };
}

$user_tables = [
    "student" => "students",
    "teacher" => "teachers",
    "chief" => "chiefs"
];

foreach ($user_tables as $role => $table) {
    $query_functions["delete $role"] = function ($pm) use($table) {
        $role_text = <<<SQL
DELETE FROM $table
WHERE id = ?
SQL;
        $user_text = <<<SQL
DELETE FROM users
WHERE id = ?
SQL;
        $query = [
            $role_text,
            $pm["id"],
            $user_text,
            $pm["id"]
        ];
        return sql_query($query);
    };
}

$info_tables = [
    "auditory" => "auditories",
    "subject" => "subjects",
    "group" => "groups"
];

foreach ($info_tables as $name => $table) {
    $query_functions["add $name"] = function($pm) use($table) {
        $fields_text = implode(", ", array_keys($pm));
        $holders_text = implode(", ", array_fill(0, count($pm), "?"));
        $text = <<<SQL
INSERT INTO $table
($fields_text)
VALUES
($holders_text)
SQL;
        $query = array_values($pm);
        array_unshift($query, $text);

        return sql_query($query);
    };

    $query_functions["delete $name"] = function($pm) use($table) {
        $text = <<<SQL
DELETE FROM $table
WHERE id = ?
SQL;
        $query = [
            $text,
            $pm["id"]
        ];
        return sql_query($query);
    };

    $query_functions["$table for edition"] = function() use($table) {
        $fields = array_keys(sql_query("SELECT * FROM $table WHERE FALSE"));
        array_splice($fields, array_search("id", $fields, true), 1);
        array_push($fields, "id");
        $fields_text = implode(", ", $fields);
        $text = <<<SQL
SELECT $fields_text
FROM $table
ORDER BY id
SQL;
        return sql_query($text);
    };
}

$query_functions["users in role"] = function($pm) {
    $text = <<<SQL
SELECT concat(surname, ' ', users.name, ' ', patronymic) AS name, login, password, email, phone, users.id AS id
FROM users
JOIN roles ON users.role_id = roles.id
WHERE roles.name = ?
SQL;
    $query = [
        $text,
        $pm["role_name"]
    ];
    return sql_query($query);
};

$query_functions["delete lesson"] = function($pm) {
    $text = <<<SQL
DELETE FROM lessons
WHERE id = ?
SQL;
    $query = [
        $text,
        $pm["id"]
    ];
    return sql_query($query);
};

$query_functions["lessons with info"] = function() {
    $text = <<<SQL
SELECT groups.name AS group_name, subjects.name AS subject_name,
auditories.name AS auditory_name, users.surname AS user_name, time, lessons.id AS id
FROM lessons
JOIN groups ON (group_id = groups.id)
JOIN subjects ON (subject_id = subjects.id)
JOIN auditories ON (auditory_id = auditories.id)
JOIN users ON (teacher_id = users.id)
ORDER BY time
SQL;
    return sql_query($text);
};

$query_functions["add lesson"] = function($pm) {
    $text = <<<SQL
INSERT INTO lessons
(group_id, subject_id, auditory_id, teacher_id, time)
VALUES
(?, ?, ?, ?, ?)
SQL;
    $query = [
        $text,
        $pm["group_id"],
        $pm["subject_id"],
        $pm["auditory_id"],
        $pm["teacher_id"],
        $pm["time"]
    ];
    return sql_query($query);
};

$query_functions["students from group"] = function($pm) {
    $text = <<<SQL
SELECT students.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name
FROM students
JOIN users ON students.id = users.id
JOIN groups ON students.group_id = groups.id
WHERE groups.id = ?
ORDER BY name
SQL;
    $query = [
        $text,
        $pm["group_id"]
    ];
    return sql_query($query);
};

$query_functions["student marks"] = function($pm) {
    $text = <<<SQL
SELECT
  subjects.name AS subject_name,
  concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name,
  mark_history.time, mark_types.short_name, mark_history.comment
FROM mark_history
JOIN
  (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_marks
  ON mark_history.id = last_marks.id
JOIN mark_types ON mark_history.mark_type_id = mark_types.id
JOIN marks ON mark_history.mark_id = marks.id
JOIN students ON marks.student_id = students.id
JOIN lessons ON marks.lesson_id = lessons.id
JOIN subjects ON lessons.subject_id = subjects.id
JOIN teachers ON lessons.teacher_id = teachers.id
JOIN users ON teachers.id = users.id
WHERE students.id = ?
ORDER BY mark_history.time
SQL;
    $query = [
        $text,
        $pm["student_id"]
    ];
    return sql_query($query);
};

$query_functions["student lesson marks"] = function($pm) {
    $text = <<<SQL
SELECT mark_history.id, mark_history.time, mark_types.short_name, mark_history.comment
FROM marks
JOIN mark_history ON marks.id = mark_history.mark_id
JOIN mark_types ON mark_history.mark_type_id = mark_types.id
JOIN students ON marks.student_id = students.id
JOIN lessons ON marks.lesson_id = lessons.id
WHERE students.id = ? AND lessons.id = ?
ORDER by mark_history.id DESC
SQL;
    $query = [
        $text,
        $pm["student_id"],
        $pm["lesson_id"]
    ];
    return sql_query($query);
};

$query_functions["lesson students with info"] = function($pm) {
    $text = <<<SQL
SELECT current_students.id AS student_id,
concat(users.surname, ' ', users.name, ' ', users.patronymic) AS student_name,
mark_types.short_name, last_marks.comment
FROM
(SELECT students.id FROM lessons
JOIN groups ON lessons.group_id = groups.id
JOIN students ON groups.id = students.group_id
WHERE lessons.id = ?) AS current_students
LEFT OUTER JOIN
(SELECT marks.id, marks.student_id FROM marks
WHERE marks.lesson_id = ?) AS current_marks
ON current_students.id = current_marks.student_id
LEFT OUTER JOIN
(SELECT mark_history.id, mark_history.mark_id,
mark_history.mark_type_id, mark_history.comment
FROM mark_history
JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_changes
ON mark_history.id = last_changes.id) AS last_marks
ON current_marks.id = last_marks.mark_id
LEFT OUTER JOIN mark_types ON last_marks.mark_type_id = mark_types.id
JOIN users ON current_students.id = users.id
ORDER BY student_name
SQL;
    $query = [
        $text,
        $pm["lesson_id"],
        $pm["lesson_id"]
    ];
    return sql_query($query);
};

$query_functions["lessons by parameters"] = function($pm) {
    $text = <<<SQL
SELECT lessons.id AS id, concat(name, ' | ', time) AS name
FROM lessons
JOIN auditories ON (lessons.auditory_id = auditories.id)
WHERE lessons.teacher_id = ? AND lessons.subject_id = ? AND lessons.group_id = ?
ORDER BY name
SQL;
    $query = [
        $text,
        $pm["teacher_id"],
        $pm["subject_id"],
        $pm["group_id"]
    ];
    return sql_query($query);
};

$query_functions["groups by subject and teacher"] = function($pm) {
    $text = <<<SQL
SELECT DISTINCT groups.id, groups.name
FROM lessons
JOIN groups ON (lessons.group_id = groups.id)
WHERE lessons.subject_id = ? AND lessons.teacher_id = ?
ORDER BY name
SQL;
    $query = [
        $text,
        $pm["subject_id"],
        $pm["teacher_id"]
    ];
    return sql_query($query);
};

$query_functions["subjects by teacher"] = function($pm) {
    $text = <<<SQL
SELECT DISTINCT subjects.id, subjects.name
FROM lessons
JOIN subjects
ON (lessons.subject_id = subjects.id)
WHERE lessons.teacher_id = ?
ORDER BY name
SQL;
    $query = [
        $text,
        $pm["teacher_id"]
    ];
    return sql_query($query);
};

$query_functions["add mark"] = function($pm) {
    $to_marks = <<<SQL
INSERT INTO marks (student_id, lesson_id)
SELECT student_id, lesson_id FROM (SELECT ? AS student_id, ? AS lesson_id) AS need
LEFT OUTER JOIN
(SELECT student_id, lesson_id FROM marks WHERE
student_id = ? AND lesson_id = ?) AS fact
USING (student_id, lesson_id) WHERE fact.student_id IS NULL
SQL;
    $to_history = <<<SQL
INSERT INTO mark_history (mark_id, mark_type_id, time, comment)
VALUES ((SELECT id FROM marks WHERE student_id = ? AND lesson_id = ?),
?, CURRENT_TIMESTAMP, ?)
SQL;
    $query = [
        $to_marks,
        $pm["student_id"],
        $pm["lesson_id"],
        $pm["student_id"],
        $pm["lesson_id"],
        $to_history,
        $pm["student_id"],
        $pm["lesson_id"],
        $pm["mark_type_id"],
        $pm["comment"]
    ];
    return sql_query($query);
};

$query_functions["lessons by group"] = function($pm) {
    $text = <<<SQL
SELECT subjects.name AS subject_name,
concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name,
auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons
JOIN subjects ON (lessons.subject_id = subjects.id)
JOIN teachers ON (lessons.teacher_id = teachers.id)
JOIN users ON (teachers.id = users.id)
JOIN groups ON (lessons.group_id = groups.id)
JOIN auditories ON (lessons.auditory_id = auditories.id)
WHERE groups.id = ?
ORDER BY subjects.name, teacher_name, auditories.name, lessons.time
SQL;
    $query = [
        $text,
        $pm["group_id"]
    ];
    return sql_query($query);
};

$query_functions["lessons by teacher"] = function($pm) {
    $text = <<<SQL
SELECT subjects.name AS subject_name, groups.name AS group_name,
auditories.name AS auditory_name, lessons.time AS lesson_time
FROM lessons
JOIN subjects ON lessons.subject_id = subjects.id
JOIN groups ON lessons.group_id = groups.id
JOIN auditories ON lessons.auditory_id = auditories.id
WHERE teacher_id = ?
SQL;
    $query = [
        $text,
        $pm["teacher_id"]
    ];
    return sql_query($query);
};

$query_functions["students by filters"] = function($pm) {
    $course = $pm["course"];
//    $group = $pm["group"];
//    $subject = $pm["subject"];
//    $teacher = $pm["teacher"];
//    $auditory = $pm["auditory"];
    $was = $pm["was"];
    $is = $pm["is"];

    $sets = [
        "course",
        "group",
        "subject",
        "teacher",
        "auditory"
    ];
    $idMap = [
        "group" => "groups",
        "subject" => "subjects",
        "teacher" => "teachers",
        "auditory" => "auditories"
    ];

    // construct SQL condition
    $query = ["Will be replaced below"];
    $conditions = " TRUE";
    // course
    $ids = $course;
    if ($ids[0]) {
        $localConditions = " AND (";
        for ($i = 0; $i < count($ids); $i++) {
            if ($i != 0) $localConditions .= " OR";
            $localConditions .= " groups.course = ?";
            array_push($query, $ids[$i]);
        }
        $localConditions .= ")";
        $conditions .= $localConditions;
    }
    // other checkboxes
    for ($i = 0; $i < count($sets); $i++) {
        if (!isset($idMap[$sets[$i]])) continue;
        $ids = $pm[$sets[$i]];
        $tableName = $idMap[$sets[$i]];
        if ($ids[0]) {
            $localConditions = " AND (";
            for ($j = 0; $j < count($ids); $j++) {
                if ($j != 0) $localConditions .= " OR";
                $localConditions .= " " . $tableName . ".id = ?";
                array_push($query, $ids[$j]);
            }
            $localConditions .= ")";
            $conditions .= $localConditions;
        }
    }
    // mark conditions
    if ($was) {
        $conditions .= " AND mark_types.id = ?";
        array_push($query, $was);
    }
    if ($is) {
        $conditions .= <<<SQL
AND students.id IN
(SELECT students.id FROM students
JOIN marks ON students.id = marks.student_id
JOIN (SELECT * FROM (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_ids
       JOIN mark_history USING(id)) AS last_marks
   ON marks.id = last_marks.mark_id
WHERE last_marks.mark_type_id = ?)
SQL;
        array_push($query, $is);
    }
    // date interval conditions
    if (isset($pm["from"])) {
        $conditions .= " AND lessons.time >= ?";
        array_push($query, $pm["from"]);
    }
    if (isset($pm["to"])) {
        $conditions .= " AND lessons.time < ?";
        array_push($query, $pm["to"]);
    }
    $join_to_marks = <<<SQL
JOIN marks ON students.id = marks.student_id
JOIN mark_history ON marks.id = mark_history.mark_id
JOIN mark_types ON mark_history.mark_type_id = mark_types.id
SQL;
    if (!$was && !$is) {
        $join_to_marks = "";
    }

    $text = <<<SQL
SELECT concat(users.surname, ' ', users.name, ' ', users.patronymic) AS student_name,
   groups.name AS group_name, groups.course AS course
FROM
(SELECT DISTINCT students.id AS id
FROM students
JOIN groups ON students.group_id = groups.id
JOIN lessons ON groups.id = lessons.group_id
JOIN teachers ON lessons.teacher_id = teachers.id
JOIN subjects ON lessons.subject_id = subjects.id
JOIN auditories ON lessons.auditory_id = auditories.id
$join_to_marks
WHERE $conditions
) AS student_ids
JOIN users ON student_ids.id = users.id
JOIN students ON student_ids.id = students.id
JOIN groups ON students.group_id = groups.id
ORDER BY course, group_name, student_name
SQL;
    $query[0] = $text;
    return sql_query($query);
};