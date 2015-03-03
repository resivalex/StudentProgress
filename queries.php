<?php

$sql = new mysqli("p:localhost", "root", "m3i4n3t", "student_progress");
//$sql = new mysqli("p:mysql.hostinger.ru", "u110559410_root", "m3i4n3t", "u110559410_stude");
$sql->query("SET NAMES 'utf8'");

function select_query($query, $param = "") {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];
    $select_result = array();

    $query_to_log = "INSERT INTO log (time, action) VALUES (CURRENT_TIMESTAMP, '";
    $query_to_log .= $sql->escape_string("select_query(\"".$query."\")")."')";
    $sql->query($query_to_log);

    if ($param == "") {
        $result = $sql->query($query);
    } else {
        $smth = $sql->prepare($query);
        if ($param) {
            $code = "";
            for ($i = 0; $i < count($param); $i++) {
                $code .= '$' . "var$i = " . '$param[' . $i . '];' . "\n";
            }
            $code .= '$smth->bind_param($var0';
            for ($i = 1; $i < count($param); $i++) {
                $code .= ", " . '$' . "var$i";
            }
            $code .= ");\n";
            eval($code);
        }
        if (gettype($smth) != "object") {
            var_dump($sql->error);
            var_dump($query);
        }
        if (!$smth->execute()) {
            $smth->close();
            return false;
        }
        $result = $smth->get_result();
    }
    while ($field = $result->fetch_field()) {
        $select_result[$field->name] = array();
    }
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        foreach ($row as $field => $value) {
            $select_result[$field][] = $value;
        }
    }
    if (isset($smth)) $smth->close();

    return $select_result;
}

function modify_query($query, $param = "") {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];

    $query_to_log = "INSERT INTO log (time, action) VALUES (CURRENT_TIMESTAMP, '";
    $query_to_log .= $sql->escape_string("modify_query(\"".$query."\")")."')";
    $sql->query($query_to_log);

    if ($param == "") {
        $result = $sql->query($query);
    } else {
        $smth = $sql->prepare($query);
        if ($param) {
            $code = "";
            for ($i = 0; $i < count($param); $i++) {
                $code .= '$' . "var$i = " . '$param[' . $i . '];' . "\n";
            }
            $code .= '$smth->bind_param($var0';
            for ($i = 1; $i < count($param); $i++) {
                $code .= ", " . '$' . "var$i";
            }
            $code .= ");\n";
            eval($code);
        }
        if (gettype($smth) != "object") {
            var_dump($sql->error);
            var_dump($query);
        }
        $result = $smth->execute();
    }
    if (isset($smth)) $smth->close();

    return $result;
}

function sql_query($query) {
    /** @var $sql mysqli */
    $sql = $GLOBALS["sql"];

    $action = $sql->escape_string(json_encode($query));
    $sql->query("INSERT INTO log (time, action) VALUES (CURRENT_TIMESTAMP, '$action')");
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
                        $sql->rollback();
                        $sql->autocommit(true);
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

//function add_student($surname, $name, $patronymic, $group_id) {
//    $query =
//        <<<SQL
//        INSERT INTO users
//(login, password, role_id)
//VALUES
//(?, ?, ?)
//SQL;
//    $login = "student".rand(1000, 9999);
//    $password = generate_password();
//    $role_id = get_role_id("student");
//    modify_query($query, array("ssi", $login, $password, $role_id));
//
//    $query =
//        <<<SQL
//        INSERT INTO students
//(surname, name, patronymic, group_id, user_id)
//VALUES
//(?, ?, ?, ?, ?)
//SQL;
//    $user_id = get_user_id($login, $password, $role_id);
//    modify_query($query, array("sssii", $surname, $name, $patronymic, $group_id, $user_id));
//}
//
//function get_user_id($login, $password, $role_id) {
//    $query =
//        <<<SQL
//        SELECT id
//FROM users
//WHERE login = ? AND password = ? AND role_id = ?
//SQL;
//    $result = select_query($query, array("ssi", $login, $password, $role_id));
//
//    return $result["id"][0];
//}
//
//function add_group($name, $course_number) {
//    $query =
//        <<<SQL
//        INSERT INTO groups
//(name, course_number, subcom_id)
//VALUES
//(?, ?, NULL)
//SQL;
//    modify_query($query, array("si", $name, $course_number));
//}
//
///**
// * @return mysqli_stmt
// */
//function get_id_name_from_groups() {
//    /** @var $sql mysqli */
//    $sql = $GLOBALS["sql"];
//    $query =
//        <<<SQL
//        SELECT id, name
//FROM groups
//SQL;
//    $smth = $sql->prepare($query);
//    $smth->execute();
//
//    return $smth;
//}
//
///**
// * @param $course_number
// * @return array
// */
//function get_id_name_from_groups_in_course($course_number) {
//    $query =
//        <<<SQL
//        SELECT id, name
//FROM groups
//WHERE course_number = ?
//SQL;
//    return select_query($query, array("i", $course_number));
//}
//
//function delete_group($id) {
//    $query =
//        <<<SQL
//        DELETE FROM groups
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $id));
//}
//
//function count_students_in_group($id) {
//    $query =
//        <<<SQL
//        SELECT COUNT(*) AS count
//FROM students
//WHERE students.group_id = ?
//SQL;
//    $result = select_query($query, array("i", $id));
//
//    return $result["count"][0];
//}
//
//function get_group_name($id) {
//    $query =
//        <<<SQL
//        SELECT name
//FROM groups
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $id));
//
//    return $result["name"][0];
//}
//
//function get_id_surname_name_patronymic_from_students_in_group($group_id) {
//    $query =
//        <<<SQL
//        SELECT id, surname, name, patronymic
//FROM students
//WHERE group_id = ?
//SQL;
//    return select_query($query, array("i", $group_id));
//}
//
//function  get_role_id($role_name) {
//    $query =
//        <<<SQL
//        SELECT id
//FROM roles
//WHERE name = ?
//SQL;
//    $result = select_query($query, array("s", $role_name));
//
//    return $result["id"][0];
//}
//
//function delete_student($id) {
//    $query =
//        <<<SQL
//        SELECT user_id
//FROM students
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $id));
//    $user_id = $result["user_id"][0];
//
//    $query =
//        <<<SQL
//        DELETE FROM students
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $id));
//
//    $query =
//        <<<SQL
//        DELETE FROM users
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $user_id));
//}
//
//function add_teacher($surname, $name, $patronymic) {
//    $query =
//        <<<SQL
//        INSERT INTO users
//(login, password, role_id)
//VALUES
//(?, ?, ?)
//SQL;
//    $login = "teacher".rand(1000, 9999);
//    $password = generate_password();
//    $role_id = get_role_id("teacher");
//    modify_query($query, array("ssi", $login, $password, $role_id));
//
//    $query =
//        <<<SQL
//        INSERT INTO teachers
//(surname, name, patronymic, user_id)
//VALUES
//(?, ?, ?, ?)
//SQL;
//    $user_id = get_user_id($login, $password, $role_id);
//    modify_query($query, array("sssi", $surname, $name, $patronymic, $user_id));
//}
//
//function delete_teacher($id) {
//    $query =
//        <<<SQL
//        SELECT user_id
//FROM teachers
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $id));
//    $user_id = $result["user_id"][0];
//
//    $query =
//        <<<SQL
//        DELETE FROM teachers
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $id));
//
//    $query =
//        <<<SQL
//        DELETE FROM users
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $user_id));
//}
//
///**
// * @return mysqli_stmt
// */
//function get_id_surname_name_patronymic_from_teachers() {
//    /** @var $sql mysqli */
//    $sql = $GLOBALS["sql"];
//
//    $query =
//        <<<SQL
//        SELECT id, surname, name, patronymic
//FROM teachers
//SQL;
//    $smth = $sql->prepare($query);
//    $smth->execute();
//
//    return $smth;
//}
//
//function count_lessons_in_subject($subject_id) {
//    $query =
//        <<<SQL
//        SELECT COUNT(*) AS count
//FROM subjects
//JOIN lessons ON (lessons.subject_id = ?)
//SQL;
//    $result = select_query($query, array("i", $subject_id));
//
//    return $result["count"][0];
//}
//
//function get_id_name_from_subjects() {
//    $query =
//        <<<SQL
//        SELECT id, name
//FROM subjects
//SQL;
//    return select_query($query, null);
//}
//
//function delete_subject($id) {
//    $query =
//        <<<SQL
//        DELETE FROM subjects
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $id));
//}
//
//function add_subject($name) {
//    $query =
//        <<<SQL
//        INSERT INTO subjects
//(name)
//VALUES
//(?)
//SQL;
//    modify_query($query, array("s", $name));
//}
//
//function delete_lesson($id) {
//    $query =
//        <<<SQL
//        DELETE FROM lessons
//WHERE id = ?
//SQL;
//    modify_query($query, array("i", $id));
//}
//
//function add_lesson($subject_id, $group_id, $teacher_id) {
//    $query =
//        <<<SQL
//        INSERT INTO lessons
//(subject_id, group_id, teacher_id)
//VALUES
//(?, ?, ?)
//SQL;
//    modify_query($query, array("iii", $subject_id, $group_id, $teacher_id));
//}
//
//function get_id_subjectname_groupname_surname_name_patronymic_from_lessons() {
//    $query =
//        <<<SQL
//        SELECT lessons.id,
//		subjects.name AS subject_name,
//		groups.name AS group_name,
//		teachers.surname,
//		teachers.name,
//		teachers.patronymic
//FROM lessons
//JOIN subjects ON (subjects.id = lessons.subject_id)
//JOIN groups ON (groups.id = lessons.group_id)
//JOIN teachers ON (teachers.id = lessons.teacher_id)
//SQL;
//    return select_query($query, null);
//}
//
//function get_subject_name($id) {
//    $query =
//        <<<SQL
//        SELECT name
//FROM subjects
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $id));
//
//    return $result["name"][0];
//}
//
//function get_id_name_from_groups_in_subject($subject_id) {
//    $query =
//        <<<SQL
//        SELECT groups.id, groups.name
//FROM lessons
//JOIN groups ON (groups.id = lessons.group_id)
//JOIN students ON (students.group_id = groups.id)
//WHERE subject_id = ?
//GROUP BY groups.id
//ORDER BY groups.name
//SQL;
//    return select_query($query, array("i", $subject_id));
//}
//
//function get_lesson_id($subject_id, $group_id) {
//    $query =
//        <<<SQL
//        SELECT id
//FROM lessons
//WHERE subject_id = ? AND group_id = ?
//SQL;
//    $result = select_query($query, array("ii", $subject_id, $group_id));
//
//    return $result["id"][0];
//}
//
//function add_teaching($lesson_id, $date) {
//    $query =
//        <<<SQL
//        INSERT INTO teachings
//(lesson_id, date)
//VALUES
//(?, ?)
//SQL;
//    modify_query($query, array("is", $lesson_id, $date));
//}
//
//function get_teaching_id($lesson_id, $date) {
//    $query =
//        <<<SQL
//        SELECT id
//FROM teachings
//WHERE lesson_id = ? AND date = ?
//SQL;
//    $result = select_query($query, array("is", $lesson_id, $date));
//
//    return $result["id"][0];
//}
//
//function get_mark_type_id_from_lessons($student_id, $teaching_id) {
//    $query =
//        <<<SQL
//        SELECT mark_type_id
//FROM marks
//WHERE student_id = ? AND teaching_id = ?
//SQL;
//    return select_query($query, array("ii", $student_id, $teaching_id));
//}
//
//function get_id_from_students_in_lesson($lesson_id) {
//    $query =
//        <<<SQL
//        SELECT students.id
//FROM lessons
//JOIN groups ON (lessons.group_id = groups.id)
//JOIN students ON (groups.id = students.group_id)
//WHERE lessons.id = ?
//SQL;
//    return select_query($query, array("i", $lesson_id));
//}
//
//function delete_mark($student_id, $teaching_id) {
//    $query =
//        <<<SQL
//        DELETE FROM marks
//WHERE student_id = ? AND teaching_id = ?
//SQL;
//    modify_query($query, array("ii", $student_id, $teaching_id));
//}
//
//function update_mark($student_id, $teaching_id, $mark_type_id) {
//    $query =
//        <<<SQL
//        UPDATE marks
//SET mark_type_id = ?
//WHERE student_id = ? AND teaching_id = ?
//SQL;
//    modify_query($query, array("iii", $mark_type_id, $student_id, $teaching_id));
//}
//
//function add_mark($student_id, $teaching_id, $mark_type_id) {
//    $query =
//        <<<SQL
//        INSERT INTO marks
//(student_id, teaching_id, mark_type_id)
//VALUES
//(?, ?, ?)
//SQL;
//    modify_query($query, array("iii", $student_id, $teaching_id, $mark_type_id));
//}
//
//function get_id_name_from_mark_types() {
//    $query =
//        <<<SQL
//        SELECT id, name
//FROM mark_types
//ORDER BY id
//SQL;
//    return select_query($query, null);
//}
//
//function get_role_name($role_id) {
//    $query =
//        <<<SQL
//        SELECT name
//FROM roles
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $role_id));
//
//    return $result["name"][0];
//}
//
//function get_role_title($role_id) {
//    $query =
//        <<<SQL
//        SELECT title
//FROM roles
//WHERE id = ?
//SQL;
//    $result = select_query($query, array("i", $role_id));
//
//    return $result["title"][0];
//}
//
//function get_student_id_from_username($username) {
//    $query =
//        <<<SQL
//        SELECT students.id
//FROM users
//JOIN students ON (users.id = students.user_id)
//WHERE users.login = ?
//SQL;
//    $result = select_query($query, array("s", $username));
//
//    return $result["id"][0];
//}
