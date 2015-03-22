
$(document).ready(onMarksForTeacherLoad);

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
        //$("#student_id").remove();
        $("#students").children().remove();
        removeMarks();
    }

    function removeMarks() {
        //$("#mark").children().remove();
        $("#marks").children().remove();
        $("#add_mark").css({display: "none"});
    }

    function loadMarks() {
        var commentLengthLimit = 20;
        var i;
        $("#marks").children().remove();
        var params = {
            student_id: $("#students").data("student_id"),
            lesson_id: $("#lesson_id").val()
        };
        serverQuery("student lesson marks", params, function(response) {
            response = $.parseJSON(response);
            response = rotable2DArray(toIndexArray(response));
            if (response.length > 0) {
                var data = scrollableTable({
                    target: $("#marks"),
                    classes: ["auto_margin", "progress_table", "top_padding"],
                    content: response.map(function(el) {
                        return [
                            el[2],
                            el[3].substr(0, commentLengthLimit) +
                                (el[3].length > commentLengthLimit? "..." : "")
                        ]
                    }),
                    rowHeaders: response.map(function(el) {return [el[1]]}),
                    columnHeaders: ["Отм.", "Комментарий"],
                    cornerElement: $("<div/>").text("Время")
                });
            } else {
                var $p = $("<p/>").appendTo($("#marks"));
                $p.css({textAlign: "center"}).text("Нет отметок за это занятие.");
            }
        });
        $("#select_mark_type").children().remove();
        serverQuery("mark types", function(response) {
            $("#add_mark").css({display: "table"});
            var $select_mark_type = $("#select_mark_type");
            $select_mark_type.children().remove();
            $("#comment").val("без комментариев");
            $select_mark_type.append(slidedSelectTool("Отметка", "mark_type_id", $.parseJSON(response)));
            $("#mark_type_id").selectmenu();
        })
    }

    function loadStudentList(group_id) {
        removeStudentList();
        //additionTable();
        var commentLengthLimit = 20;
        $("#students").children().remove();
        var params = {
            lesson_id: $("#lesson_id").val()
        };
        serverQuery("lesson students with info", params, function(response) {
            var i;
            response = $.parseJSON(response);
            response = toIndexArray(response);
            response = rotable2DArray(response);
            var tableContent = [];
            for (i = 0; i < response.length; i++) {
                var el = response[i][3];
                tableContent[i] = [response[i][2],
                    el === null? "" : el.substr(0, commentLengthLimit) +
                        (el.length > commentLengthLimit? "..." : "")
                ];
            }
            var rowHeaders = [];
            for (i = 0; i < response.length; i++) {
                rowHeaders[i] = response[i][1];
            }
            var data = scrollableTable({
                target: $("#students"),
                classes: ["auto_margin", "progress_table", "top_padding"],
                content: tableContent,
                rowHeaders: rowHeaders,
                columnHeaders: ["Посл.", "Комментарий"],
                cornerElement: $("<span/>").text("Студенты")
            });
            for (i = 0; i < data.rowOutDivs.length; i++) {
                var $el = data.rowOutDivs[i];
                $el.data("student_id", response[i][0]);
                $el.css({cursor: "pointer"}).click(function() {
                    $(".selected_cell", $(this).closest("table")).removeClass("selected_cell");
                    $(this).addClass("selected_cell");
                    $("#students").data("student_id", $(this).data("student_id"));
                    loadMarks();
                })
            }
        });
    }

    function loadLessons(group_id) {
        removeAuditoryTime();
        var params = {
            teacher_id: $("#teacher_id").val(),
            subject_id: $("#subject_id").val(),
            group_id: group_id
        };
        serverQuery("lessons by parameters", params, function(response) {
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
        var param = {
            subject_id: subject_id,
            teacher_id: $("#teacher_id").val()
        };
        serverQuery("groups by subject and teacher", param, function(response) {
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
        var params = {
            teacher_id: teacher_id
        };
        serverQuery("subjects by teacher", params, function(response) {
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
        serverQuery("involved teachers", function(response) {
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
        $("#add_button").button().click(function() {
            removeMarks();
            var params = {
                student_id: $("#students").data("student_id"),
                lesson_id: $("#lesson_id").val(),
                mark_type_id: $("#mark_type_id").val(),
                comment: $("#comment").val()
            };
            serverQuery("add mark", params, function(response) {
                if ($.parseJSON(response) == true) {
                    showMessage("Добавлено");
                } else {
                    showMessage("Неудача");
                }
                loadStudentList();
            });
        })
    });
}
