
function onMarksForTeacherLoad() {
    function removeSubjects() {
        $("#subject_id").remove();
        removeGroups();
    }

    function removeGroups() {
        $("#group_id").remove();
        removeAuditoryTime();
    }

    function removeAuditoryTime() {
        $("#lesson_id").remove();
        removeStudentList();
    }

    function removeStudentList() {
        $("#student_id").remove();
        removeMark();
    }

    function removeMark() {
        $("#mark").children().remove();
    }

    function loadMark() {
        removeMark();
        var text =
            "SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks " +
            "JOIN mark_history ON marks.id = mark_history.mark_id " +
            "JOIN mark_types ON mark_history.mark_type_id = mark_types.id " +
            "JOIN students ON marks.student_id = students.id " +
            "JOIN lessons ON marks.lesson_id = lessons.id " +
            "WHERE students.id = ? AND lessons.id = ? " +
            "ORDER by mark_history.id DESC";
        var student_id = $("#student_id").data("value");
        var lesson_id = $("#lesson_id").val();
        sqlQuery([text, student_id, lesson_id], function(response) {
            if ($("#student_id").data("value") != undefined) {
                if ($.parseJSON(response).id.length == 0) {
                    response = "{\"message\": [\"Отметок нет!\"]}";
                }
                removeMark();
                var table = getTableFromJSON(response);
                table.className = "custom_table";
                $("#mark").append(table);
                var query =
                    "SELECT mark_types.id, mark_types.short_name " +
                    "FROM mark_types ORDER BY mark_types.short_name";
                sqlQuery(query, function (response) {
                    var select_mark = selectTool("Отметка", "mark_type_id", $.parseJSON(response));
                    var mark_table = document.createElement("table");
                    var tr = document.createElement("tr");
                    mark_table.appendChild(tr);
                    mark_table.style.width = "100%";
                    mark_table.style.borderCollapse = "collapse";
                    mark_table.style.borderWidth = "0";
                    $(".item", select_mark).each(function () {
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        $(td).append(this);
                    });
                    $(".box", select_mark).append(mark_table);
                    select_mark.style.width = "150px";
                    select_mark.style.marginLeft = select_mark.style.marginRight = "auto";
                    var comment_table = getTableFromJSON("{\"c\":[\"\"]}");
                    comment_table.className = "custom_table";
                    var comment_area = document.createElement("textarea");
                    comment_area.value = "без комментариев";
                    comment_area.id = "comment_area";
                    $("td", comment_table).append(comment_area);
                    var button = document.createElement("input");
                    button.type = "button";
                    button.style.display = "block";
                    button.style.marginLeft = button.style.marginRight = "auto";
                    button.value = "Добавить / Исправить";
                    $("#mark").append(select_mark).append(comment_table).append(button);
                    $(button).click(function() {
                        var student_id = $("#student_id").data("value");
                        var lesson_id = $("#lesson_id").val();
                        var mark_type_id = $("#mark_type_id").data("value");
                        var comment = $("#comment_area").val();
                        var text =
                            "INSERT INTO marks (student_id, lesson_id) " +
                            "SELECT student_id, lesson_id FROM (SELECT ? AS student_id, ? AS lesson_id) AS need " +
                            "LEFT OUTER JOIN " +
                            "(SELECT student_id, lesson_id FROM marks WHERE " +
                            "student_id = ? AND lesson_id = ?) AS fact " +
                            "USING (student_id, lesson_id) WHERE fact.student_id IS NULL ";
                        var query = [text, student_id, lesson_id, student_id, lesson_id];
                        text =
                            "INSERT INTO mark_history (mark_id, mark_type_id, time, comment) " +
                            "VALUES ((SELECT id FROM marks WHERE student_id = ? AND lesson_id = ?), " +
                            "?, CURRENT_TIMESTAMP, ?) ";
                        query.push(text, student_id, lesson_id, mark_type_id, comment);
                        sqlQuery(query, function(response) {
                            loadMark();
                        });
                    });
                });
            }
        });

    }

    function loadStudentList(group_id) {
        removeStudentList();
        var query = [
            "SELECT students.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name FROM lessons " +
            "JOIN students ON lessons.group_id = students.group_id " +
            "JOIN users ON (students.id = users.id) " +
            "WHERE lessons.id = ? ORDER BY name",
            $("#lesson_id").val()
        ];
        sqlQuery(query, function(response) {
            removeStudentList();
            var select_student = selectTool("Студенты", "student_id", $.parseJSON(response));
            $("#judging").append(select_student);
            $("#student_id").ready(loadMark).on("click", ".item", loadMark);
        });
    }

    function loadLessons(group_id) {
        removeAuditoryTime();
        var query = [
            "SELECT lessons.id AS id, concat(name, ' | ', time) AS name FROM lessons " +
            "JOIN auditories ON (lessons.auditory_id = auditories.id) " +
            "WHERE lessons.teacher_id = ? AND lessons.subject_id = ? AND lessons.group_id = ? " +
            "ORDER BY name",
            $("#teacher_id").val(),
            $("#subject_id").val(),
            group_id
        ];
        sqlQuery(query, function(response) {
            removeAuditoryTime();
            $("#select_auditory_time").append(slidedSelectTool("Аудитория | Время", "lesson_id", $.parseJSON(response)));
            $("#lesson_id").selectmenu({change: function() {
                loadStudentList($("#lesson_id").val());
            }}).ready(function() {
                loadStudentList($("#lesson_id").val());
            });
        });
    }

    function loadGroups(subject_id) {
        removeGroups();
        var query = [
            "SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) " +
            "WHERE lessons.subject_id = ? AND lessons.teacher_id = ? " +
            "ORDER BY name",
            subject_id,
            $("#teacher_id").val()
        ];
        sqlQuery(query, function(response) {
            removeGroups();
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)))
            $("#group_id").selectmenu({change: function() {
                loadLessons($("#group_id").val());
            }}).ready(function() {
                loadLessons($("#group_id").val());
            });
        })
    }

    function loadSubjects(teacher_id) {
        removeSubjects();
        var query = [
            "SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects " +
            "ON (lessons.subject_id = subjects.id) " +
            "WHERE lessons.teacher_id = ? ORDER BY name",
            teacher_id
        ];
        sqlQuery(query, function(response) {
            removeSubjects();
            $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
            $("#subject_id").selectmenu({change: function() {
                loadGroups($("#subject_id").val());
            }}).ready(function() {
                loadGroups($("#subject_id").val());
            });
        });
    }

    function loadTeachers() {
        var query =
            "SELECT DISTINCT teachers.id, " +
            "concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name " +
            "FROM teachers " +
            "JOIN users ON teachers.id = users.id " +
            "JOIN lessons ON teachers.id = lessons.teacher_id " +
            "ORDER BY teacher_name";
        sqlQuery(query, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").selectmenu({change: function() {
                loadSubjects($("#teacher_id").val());
            }}).ready(function() {
                loadSubjects($("#teacher_id").val());
            });
        });
    }

    $(document).ready(function() {
        loadTeachers();
    });
}