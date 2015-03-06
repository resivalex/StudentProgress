function loadCalendar(year, month) {
    $("#day_select_tool").load("calendar.php", {"y":year, "m":month});
}

// показать временное сообщение
function showMessage(message_text, title_text) {
    if (title_text == undefined) {
        const max_len = 30;
        title_text = message_text.substr(0, max_len) + (message_text.length > max_len? "..." : "");
    }
    if (document.getElementById("message_layer") == undefined) {
        $("<div/>").attr("id", "message_layer").appendTo($("body"));
    }
    var $layer = $("#message_layer");
    var $message = $("<div/>").prependTo($layer);
    var $title = $("<p/>").css({marginTop: 0, marginBottom: 0, backgroundColor: "#eeeeff"}).text(title_text).appendTo($message);
    $title.append($("<label>&nbsp;&nbsp;x&nbsp;&nbsp;</label>").css({float: "right", backgroundColor: "#ccffcc"}).click(function() {
        $message.slideUp({duration: 300, easing: "easeOutQuart", complete: function() {$message.remove();}});
    }));
    var $p = $("<p/>").text(message_text).appendTo($message);
    setTimeout(function() {
        $message.slideUp({"duration": 3000, easing: "easeOutQuart", complete: function() {$message.remove();}});
    }, 60000);
    $p.hide();
    $p.dblclick(function() {$p.slideUp();});
    $title.click(function() {$p.slideToggle();});
    var $info_label = $("<label>&nbsp;&nbsp;i&nbsp;&nbsp;</label>").css({backgroundColor: "#bbbbff", float: "right"}).appendTo($title);
    if (message_text == title_text) {
        $p.remove();
        $info_label.css("visibility", "hidden");
    }
}

function OK() {
    showMessage("OK");
}

function showJSON(val, title_text) {
    showMessage(JSON.stringify(val), title_text);
}

function getTable(text, with_header) {
    var table = document.createElement("table");
    var tr = [];
    if (with_header) {
        var htr = document.createElement("tr");
        for (i in text) {
            var th = document.createElement("th");
            th.innerHTML = i;
            htr.appendChild(th);
        }
        table.appendChild(htr);
    }
    for (i in text) {
        for (j = 0; j < text[i].length; j++) {
            tr[j] = document.createElement("tr");
            table.appendChild(tr[j]);
        }
        if (text[i].length) break;
    }
    for (i = 0; i < tr.length; i++) {
        for (j in text) {
            var td = document.createElement("td");
            td.innerHTML = text[j][i];
            tr[i].appendChild(td);
        }
    }
    return table;

}

function getTableFromJSON(text) {
    return getTable($.parseJSON(text));
}

function sqlQuery(query, fun) {
    var temp = document.createElement("div");
    $(temp).load("sql_query.php", {"query": query}, fun);
}

function splitSelectQueryFromParams(table_name, params) {
    var query = "SELECT " + params[0];
    for (var i = 1; i < params.length; i++) {
        query += ", " + params[i];
    }
    query += ", id FROM " + table_name;
    return query;
}

function getDeleteQueryById(table_name, id) {
    return "DELETE FROM "+table_name+" WHERE id = "+id;
}

function getDeleteQueryForUser(table_name, id) {
    const tables = ["students", "teachers", "chiefs", "users"/*must be last*/];
    var query = [];
    for (i = 0; i < tables.length; i++) {
        query.push("DELETE FROM "+tables[i]+" WHERE id = "+id);
    }
    return query;
}

// загружает из базы данный ответ на query
function loadRemovableTable(table_name, id_name, query, get_delete_query) {
    var el = document.getElementById(id_name);

    if (get_delete_query == undefined) get_delete_query = getDeleteQueryById;
    sqlQuery(query, function(response) {
        var table = getTableFromJSON(response);
        table.className = "custom_table";
        $(table).children().each(function(index, element) {
            $(":last", element).each(function(index, element) {
                var id = element.innerHTML;
                element.innerHTML = "";
                var del = document.createElement("input");
                del.type = "button";
                del.value = "Удалить";
                $(del).click(function() {
                    del.setAttribute("disabled", "true");
                    var tr = del;
                    while ((tr.tagName).toUpperCase() != "TR") {
                        tr = tr.parentNode;
                    }
                    $(tr).fadeTo(500, 0.5);
                    sqlQuery(get_delete_query(table_name, id), function(response) {
                        del.removeAttribute("disabled");
                        if ($.parseJSON(response) === false) {
                            $(tr).fadeTo(500, 1.0);
                            showJSON(get_delete_query(table_name, id), "Неудача");
                            del.style.color = "#BBBBBB";
                        } else {
                            showMessage("Удалено");
                            $(tr).fadeTo(200, 0.0);
                            loadRemovableTable(table_name, id_name, query, get_delete_query);
                        }
                    });
                });
                element.appendChild(del);
            });
        });
        $(el).children().replaceWith(table);
    });
}

// добавляет строку в базу данных на странице edit_tables
function addToTable(table_name, params) {
    var text = "INSERT INTO " + table_name + " (" + params[0];
    for (i = 1; i < params.length; i++) {
        text += ", " + params[i];
    }
    text += ") VALUES (?";
    for (i = 1; i < params.length; i++) {
        text += ", ?";
    }
    text += ")";
    var query = [text];
    for (i = 0; i < params.length; i++) {
        query.push(document.getElementById(table_name + "_" + params[i]).value);
    }
    sqlQuery(query, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            loadRemovableTable(table_name, table_name, splitSelectQueryFromParams(table_name, params));
        }
    });
}

// добавляет пользователя на странице accounts.php
function addToUsers(role_name) {
    var text = "INSERT INTO users ";
    text += "(name, surname, patronymic, login, password, role_id, email, phone) ";
    text += "VALUES (?, ?, ?, ?, ?, (SELECT id FROM roles WHERE name = ?), ?, ?)";
    var query = [text];
    var block = $("." + role_name);
    query.push($("input[name='name']", block).val());
    query.push($("input[name='surname']", block).val());
    query.push($("input[name='patronymic']", block).val());
    query.push($("input[name='login']", block).val());
    query.push($("input[name='password']", block).val());
    query.push(role_name);
    query.push($("input[name='email']", block).val());
    query.push($("input[name='phone']", block).val());
    var tab = {"student": "students", "teacher": "teachers", "chief": "chiefs"};
    if (role_name == "student") {
        query.push("INSERT INTO students (id, group_id) VALUES ((SELECT max(id) FROM users), ?)");
        query.push($("#group_id").data("value"));
    } else {
        query.push("INSERT INTO " + tab[role_name] + " (id) VALUES ((SELECT max(id) FROM users))");
    }

    sqlQuery(query, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            var query = "SELECT surname, users.name AS name, patronymic, login, password, email, phone, users.id AS id ";
            query += "FROM users ";
            query += "JOIN roles ON users.role_id = roles.id ";
            query += "WHERE roles.name = '" + role_name + "'";
            loadRemovableTable('users', role_name, query, getDeleteQueryForUser);
        }
    });
}

// функция для заполнения полей на login.php
function setFields() {
    $("input[name='login']").val("admin");
    $("input[name='password']").val("patented");
}

// добавляет занятие на странице edit_schedule.php
function addLesson() {
    var group_id = $("#group_id").data("value");
    var subject_id = $("#subject_id").data("value");
    var auditory_id = $("#auditory_id").data("value");
    var teacher_id = $("#teacher_id").data("value");
    var month = $("#month").data("value");
    var day = $("input[type='radio']").filter("[name='day']").val();
    var hour = $("#hour").data("value");
    var minute = $("#minute").data("value");
    var datetime = "2013-" + month + "-" + day + " " + hour + ":" + minute + ":00";
    var query = "INSERT INTO lessons ";
    query += "(group_id, subject_id, auditory_id, teacher_id, time) ";
    query += "VALUES ('"+group_id+"', '"+subject_id+"', '"+auditory_id+"', '"+teacher_id+"', '"+datetime+"')";
    sqlQuery(query, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(query, "Неудача");
        } else {
            showMessage("Добавлено");
            var select_query = "SELECT groups.name AS groups_name, subjects.name AS subject_name, ";
            select_query += "auditories.name AS auditory_name, users.surname AS user_name, time, lessons.id AS id ";
            select_query += "FROM lessons ";
            select_query += "JOIN groups ON (group_id = groups.id) ";
            select_query += "JOIN subjects ON (subject_id = subjects.id) ";
            select_query += "JOIN auditories ON (auditory_id = auditories.id) ";
            select_query += "JOIN users ON (teacher_id = users.id)";

            loadRemovableTable('lessons', 'schedule', select_query);
        }
    });
}

function selectTool(title, id, params) {
    function div(class_name) {
        var res = document.createElement("div");
        res.className = class_name;
        return res;
    }
    var tool = div("select_tool");
    tool.id = id;
    var top = div("top");
    top.innerHTML = title;
    var note = document.createElement("label");
    note.className = "note";
    note.style.display = "none";
    top.appendChild(note);
    var box = div("box");
    tool.appendChild(top);
    tool.appendChild(box);
    var props = [];
    for (i in params) {
        props.push(i);
    }
    for (i = 0; i < params[props[0]].length; i++) {
        var item = div("item");
        $(item).data("value", params[props[0]][i]);
        $(item).addClass("item");
        item.innerHTML = params[props[1]][i];
        $(item).click(function() {
            $($(tool).data("current")).removeClass("current");
            $(this).addClass("current");
            $(tool).data("current", this);
            $(tool).data("value", $(this).data("value"));
            $(note).html($(this).html());
        });
        box.appendChild(item);
        if (i == 0) {
            $(tool).data("current", item);
            $(tool).data("value", params[props[0]][0]);
            $(item).addClass("current");
            $(note).html(params[props[1]][0]);
        }
    }

    return tool;
}

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
        query = "SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks ";
        query += "JOIN mark_history ON marks.id = mark_history.mark_id ";
        query += "JOIN mark_types ON mark_history.mark_type_id = mark_types.id ";
        query += "JOIN students ON marks.student_id = students.id ";
        query += "JOIN lessons ON marks.lesson_id = lessons.id ";
        query += "WHERE students.id = "+$("#student_id").data("value")+" AND ";
        query += "lessons.id = "+$("#lesson_id").data("value")+" ORDER by mark_history.id DESC";
        sqlQuery(query, function(response) {
            if ($("#student_id").data("value") != undefined) {
                if ($.parseJSON(response).id.length == 0) {
                    response = "{\"message\": [\"Отметок нет!\"]}";
                }
                response = response.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                removeMark();
                var table = getTableFromJSON(response);
                table.className = "custom_table";
                $("#mark").append(table);
                query = "SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name";
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
                        var lesson_id = $("#lesson_id").data("value");
                        var mark_type_id = $("#mark_type_id").data("value");
                        var comment = $("#comment_area").val();
                        var text = "INSERT INTO marks (student_id, lesson_id) ";
                        text += "SELECT student_id, lesson_id FROM (SELECT ? AS student_id, ? AS lesson_id) AS need ";
                        text += "LEFT OUTER JOIN ";
                        text += "(SELECT student_id, lesson_id FROM marks WHERE ";
                        text += "student_id = ? AND lesson_id = ?) AS fact ";
                        text += "USING (student_id, lesson_id) WHERE fact.student_id IS NULL ";
                        var query = [text, student_id, lesson_id, student_id, lesson_id];
                        text = "INSERT INTO mark_history (mark_id, mark_type_id, time, comment) ";
                        text += "VALUES ((SELECT id FROM marks WHERE student_id = ? AND lesson_id = ?), "
                        text += "?, CURRENT_TIMESTAMP, ?) ";
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
        query = "SELECT students.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name FROM lessons ";
        query += "JOIN students ON lessons.group_id = students.group_id ";
        query += "JOIN users ON (students.id = users.id) ";
        query += "WHERE lessons.id = "+$("#lesson_id").data("value")+" ORDER BY name";
        sqlQuery(query, function(response) {
            removeStudentList();
            var select_student = selectTool("Студенты", "student_id", $.parseJSON(response));
            $("#judging").append(select_student);
            $("#student_id").ready(loadMark).on("click", ".item", loadMark);
        });
    }

    function loadLessons(group_id) {
        removeAuditoryTime();
        query = "SELECT lessons.id AS id, concat(name, ' | ', time) AS name FROM lessons ";
        query += "JOIN auditories ON (lessons.auditory_id = auditories.id) ";
        query += "WHERE lessons.teacher_id = "+$("#teacher_id").data("value")+" AND ";
        query += "lessons.subject_id = "+$("#subject_id").data("value")+" AND ";
        query += "lessons.group_id = "+group_id+" ORDER BY name";
        sqlQuery(query, function(response) {
            removeAuditoryTime();
            $("#select_auditory_time").append(slidedSelectTool("Аудитория | Время", "lesson_id", $.parseJSON(response)));
            $("#lesson_id").ready(function() {
                loadStudentList($("#lesson_id").data("value"));
            }).on("click", ".item", function() {
                loadStudentList($(this).data("value"));
            });
        });
    }

    function loadGroups(subject_id) {
        removeGroups();
        query = "SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) ";
        query += "WHERE lessons.subject_id = "+subject_id+" AND ";
        query += "lessons.teacher_id = "+$("#teacher_id").data("value")+" ORDER BY name";
        sqlQuery(query, function(response) {
            removeGroups();
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)))
            $("#group_id").ready(function() {
                loadLessons($("#group_id").data("value"));
            }).on("click", ".item", function() {
                loadLessons($(this).data("value"));
            });
        })
    }

    function loadSubjects(teacher_id) {
        removeSubjects();
        query = "SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) ";
        query += "WHERE lessons.teacher_id = "+teacher_id+" ORDER BY name";
        sqlQuery(query, function(response) {
            removeSubjects();
            $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
            $("#subject_id").ready(function() {
                loadGroups($("#subject_id").data("value"));
            }).on("click", ".item", function() {
                loadGroups($(this).data("value"));
            });
        });
    }

    function loadTeachers() {
        var query = "SELECT DISTINCT teachers.id, ";
        query += "concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name ";
        query += "FROM teachers ";
        query += "JOIN users ON teachers.id = users.id ";
        query += "JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name";

        sqlQuery(query, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").ready(function() {
                loadSubjects($("#teacher_id").data("value"));
            }).on("click", ".item", function() {
                loadSubjects($(this).data("value"));
            });
        });
    }

    $("body").ready(function() {
        loadTeachers();
    });
}

function progression(from, to, step) {
    var res = [];
    while (from <= to) {
        res.push(from);
        from += step;
    }
    return res;
}

function slidedSelectTool(title, id, params) {
    var tool = selectTool(title, id, params);
    $(".box", tool).css("display", "none").css("position", "absolute").css("background-color", "#CCCCFF");
    $(".item", tool).click(function() {
        $(this).parent().slideUp();
        $(".note", tool).fadeIn();
    });
    $(".note", tool).css("display", "block");
    $(".top", tool).click(function() {
        $(".box", tool).css("width", $(tool).width());
        $(".box", tool).slideToggle();
        $(".note", tool).fadeToggle();
    });
    $(tool).mouseleave(function() {
        $(".box", tool).slideUp();
        $(".note", tool).fadeIn();
    });
    return tool;
}

function onEditScheduleLoad() {
    $("body").ready(function() {
        var query = "SELECT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) ";
        query += "FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";
        sqlQuery(query, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM subjects ORDER BY name";
        sqlQuery(query, function(response) {
            $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM groups ORDER BY name";
        sqlQuery(query, function(response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM auditories ORDER BY name";
        sqlQuery(query, function(response) {
            $("#select_auditory").append(slidedSelectTool("Аудитория", "auditory_id", $.parseJSON(response)));
        });
        var month_names = {
            id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            name: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
        };
        $("#select_month").append(slidedSelectTool("Месяц", "month", month_names));
        loadCalendar(2013, 1);
        $("#month").on("click", ".item", function() {
            loadCalendar(2013, $(this).data("value"));
        }).on("click", "label[for]", function() {
            id = this.getAttribute("for");
            loadCalendar(2013, $("#"+id).val());
        });
        $("#select_hour").append(slidedSelectTool("Часы", "hour", {id: progression(7, 18, 1), name: progression(7, 18, 1)}));
        $("#select_minute").append(slidedSelectTool("Минуты", "minute", {id: progression(0, 55, 5), name: progression(0, 55, 5)}));
    });
}

function sortableTable(params) {
    var table = getTable(params, true);
    $("th", table).each(function(index, el) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = el.innerHTML;
        button.style.width = "100%";
        el.innerHTML = "";
        el.appendChild(button);
        index++;
        $(this).click(function() {
            var tds = $("tr td:nth-child("+index+")", table).get();
            var ord = [];
            for (i = 0; i < tds.length; i++) ord.push(i);
            ord.sort(function (a, b) {
                if (tds[a].innerHTML > tds[b].innerHTML) return 1;
                if (tds[a].innerHTML < tds[b].innerHTML) return -1;
                return 0;
            });
            var trs = $("tr:has(td)", table).get();
            for (i = 0; i < tds.length; i++) {
                $(table).append(trs[ord[i]]);
            }
        });
    });
    return table;
}

function onScheduleForTeacherLoad() {
    function loadSchedule() {
        $("#schedule_table").children().remove();
        query = "SELECT subjects.name AS subject_name, groups.name AS group_name, ";
        query += "auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons ";
        query += "JOIN subjects ON (lessons.subject_id = subjects.id) ";
        query += "JOIN groups ON (lessons.group_id = groups.id) ";
        query += "JOIN auditories ON (lessons.auditory_id = auditories.id) ";
        query += "WHERE teacher_id = "+$("#teacher_id").data("value")+" ";
        query += "ORDER BY subjects.name, groups.name, auditories.name, lessons.time";

        sqlQuery(query, function(response) {
            var $shedule_table = $("#schedule_table");
            $shedule_table.children().remove();
            var table = sortableTable($.parseJSON(response));
            table.className = "custom_table";
            var ths = $("input[type='button']", table).get();
            var titles = ["Дисциплина", "Группа", "Аудитория", "Время"];
            for (var i = 0; i < 4; i++) {
                ths[i].value = titles[i];
            }
            $shedule_table.append(table);
        });
    }

    $("body").ready(function () {
        query = "SELECT DISTINCT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name ";
        query += "FROM teachers ";
        query += "JOIN users ON teachers.id = users.id ";
        query += "JOIN lessons ON teachers.id = lessons.teacher_id ";
        query += "ORDER BY name";
        sqlQuery(query, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").ready(loadSchedule).on("click", ".item", loadSchedule);
        });
    });
}

function onScheduleForStudentLoad() {
    function loadSchedule() {
        $("#schedule_table").children().remove();
        query = "SELECT subjects.name AS subject_name, ";
        query += "concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name, ";
        query += "auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons ";
        query += "JOIN subjects ON (lessons.subject_id = subjects.id) ";
        query += "JOIN teachers ON (lessons.teacher_id = teachers.id) ";
        query += "JOIN users ON (teachers.id = users.id) ";
        query += "JOIN groups ON (lessons.group_id = groups.id) ";
        query += "JOIN auditories ON (lessons.auditory_id = auditories.id) ";
        query += "WHERE groups.id = "+$("#group_id").data("value")+" ";
        query += "ORDER BY subjects.name, teacher_name, auditories.name, lessons.time";

        sqlQuery(query, function(response) {
            var $schedule_table = $("#schedule_table");
            $schedule_table.children().remove();
            var table = sortableTable($.parseJSON(response));
            table.className = "custom_table";
            var ths = $("input[type='button']", table).get();
            var titles = ["Дисциплина", "Преподаватель", "Аудитория", "Время"];
            for (var i = 0; i < 4; i++) {
                ths[i].value = titles[i];
            }
            $schedule_table.append(table);
        });
    }

    $("body").ready(function () {
        query = "SELECT DISTINCT groups.id, groups.name FROM groups ";
        query += "JOIN lessons ON (groups.id = lessons.group_id) ";
        query += "ORDER BY groups.name";
        sqlQuery(query, function (response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
            $("#group_id").ready(loadSchedule).on("click", ".item", loadSchedule);
        })
    });
}

function csvDownloadForm() {
    const table_selector = "table";
    const active_table_selector = "table.current";

    function onSelection() {
        var $body = $("body");
        $body.data("table_selection", true);
        $("#download_button").val("Выберите таблицу");
        $body.on("mouseenter", table_selector, onMouseEnter);
        $body.on("mouseleave", table_selector, onMouseLeave);
        $body.on("click", active_table_selector, onTableClickInSelection);
    }

    function offSelection() {
        var $body = $("body");
        $body.data("table_selection", false);
        $("#download_button").val("Сохранить в .csv");
        $body.off("mouseenter", table_selector, onMouseEnter);
        $body.off("mouseleave", table_selector, onMouseLeave);
        $body.off("click", active_table_selector, onTableClickInSelection);
    }

    const selection_style = [["border-style", "solid"], ["border-width", "3.013px"], ["border-color", "red"]];

    function checkCurrent() {
        function changeStyleProperty(el, prop, val) {
            $(el).data(prop, el.style.getPropertyValue(prop));
            $(el).css(prop, val);
        }
        function restoreStyleProperty(el, prop) {
            var val = $(el).data(prop);
            if (val == undefined) {
                el.style.removeProperty(prop);
            } else {
                $(el).css(prop, $(el).data(prop));
            }
        }
        $(".current").each(function() {
            if ($(this).data("stored")) {
                for (var i = 0; i < selection_style.length; i++) {
                    restoreStyleProperty(this, selection_style[i][0]);
                }
                $(this).data("stored", false);
            }
        }).removeClass("current");
        $(".mouse_over:last").addClass("current");
        $(".current").each(function() {
            if (!$(this).data("stored")) {
                for (var i = 0; i < selection_style.length; i++) {
                    changeStyleProperty(this, selection_style[i][0], selection_style[i][1]);
                }
                $(this).data("stored", true);
            }
        });
    }

    function onMouseEnter() {
        $(this).addClass("mouse_over");
        checkCurrent();
    }

    function onMouseLeave() {
        $(this).removeClass("mouse_over");
        checkCurrent();
    }

    function onTableClickInSelection() {
        offSelection();

        function restoreStyleProperty(el, prop) {
            var val = $(el).data(prop);
            if (val == undefined) {
                el.style.removeProperty(prop);
            } else {
                $(el).css(prop, $(el).data(prop));
            }
        }
        restoreStyleProperty(this, "border-style");
        restoreStyleProperty(this, "border-width");
        restoreStyleProperty(this, "border-color");

        var tab_array = [];
        $(".current tr").filter(function(index, el) {return $(el).closest("table").hasClass("current");}).each(function () {
            tab_array.push([]);
            var row = this;
            var tds = $("td, th", this).filter(function(index, el) {return $(el).closest("table").hasClass("current");}).get();
            for (var i = 0; i < tds.length; i++) {
                tab_array[tab_array.length - 1].push($(tds[i]).text());
            }
        });
        $("#json_container").val("{\"table\":"+JSON.stringify(tab_array)+"}");
        $("#csv_form").submit();
    }
    var form = document.createElement("form");
    form.id = "csv_form";
    form.acceptCharset = "utf-8";
    form.method = "post";
    form.action = "download_csv.php";
    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "table";
    hidden.id = "json_container";
    form.appendChild(hidden);
    var download = document.createElement("input");
    download.id = "download_button";
    download.type = "button";
    download.value = "Сохранить в .csv";
    $(download).click(function () {
        if ($("body").data("table_selection")) {
            offSelection();
        } else {
            onSelection();
        }
    });
    form.appendChild(download);

    return form;
}

function setOfArraysToArrayOfSets(val) {
    var res, first = true;
    for (i in val) {
        if (first) {
            res = [];
            for (j = 0; j < val[i].length; j++) {
                res.push(Object());
            }
            first = false;
        }
        for (j = 0; j < val[i].length; j++) {
            res[j][i] = val[i][j];
        }
    }
    return res;
}

function onMarksForStudentLoad() {
    function loadMarks() {
        $("#marks_table").children().remove();
        query = "SELECT subjects.name AS subject_name, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name, mark_history.time, ";
        query += "mark_types.short_name, mark_history.comment FROM mark_history ";
        query += "JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) ";
        query += "AS last_marks ON mark_history.id = last_marks.id ";
        query += "JOIN mark_types ON mark_history.mark_type_id = mark_types.id ";
        query += "JOIN marks ON mark_history.mark_id = marks.id ";
        query += "JOIN students ON marks.student_id = students.id ";
        query += "JOIN lessons ON marks.lesson_id = lessons.id ";
        query += "JOIN subjects ON lessons.subject_id = subjects.id ";
        query += "JOIN teachers ON lessons.teacher_id = teachers.id ";
        query += "JOIN users ON teachers.id = users.id ";
        query += "WHERE students.id = "+$("#student_id").data("value")+" ";
        query += "ORDER BY mark_history.time";

        sqlQuery(query, function(response) {
            showMessage(response);
            var $marks_talbe = $("#marks_table");
            $marks_talbe.children().remove();
            var data = setOfArraysToArrayOfSets($.parseJSON(response));
            data.sort(function(a, b) {a = a.time; b = b.time; return (a < b? -1 : (a > b? +1 : 0));});
            var tab = Object();
            var subject_names = Object(), times = Object();
            for (i = 0; i < data.length; i++) {
                data[i].time = data[i].time.substring(0, 10);
                subject_names[data[i].subject_name] = true;
                times[data[i].time] = true;
                if (tab[data[i].subject_name] == undefined) tab[data[i].subject_name] = Object();
                if (tab[data[i].subject_name][data[i].time] != undefined) {
                    tab[data[i].subject_name][data[i].time] += ", "+data[i].short_name;
                } else {
                    tab[data[i].subject_name][data[i].time] = data[i].short_name;
                }
            }
            var beauty = document.createElement("table");
            var subject_array = [];
            for (i in subject_names) {
                subject_array.push(i);
            }
            var time_array = [];
            for (i in times) {
                time_array.push(i);
            }
            subject_array.sort();
            time_array.sort();
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            tr.appendChild(td);
            for (i = 0; i < time_array.length; i++) {
                td = document.createElement("td");
                td.innerHTML = time_array[i];
                tr.appendChild(td);
            }
            beauty.appendChild(tr);
            for (i = 0; i < subject_array.length; i++) {
                tr = document.createElement("tr");
                td = document.createElement("td");
                td.innerHTML = subject_array[i];
                tr.appendChild(td);
                for (j = 0; j < time_array.length; j++) {
                    td = document.createElement("td");
                    td.innerHTML = (tab[subject_array[i]][time_array[j]] == undefined? "-" : tab[subject_array[i]][time_array[j]]);
                    tr.appendChild(td);
                }
                beauty.appendChild(tr);
            }
            var table = sortableTable($.parseJSON(response));
            table = beauty;  //debug
            table.className = "custom_table";
            //var ths = $("input[type='button']", table).get();
            //var titles = ["Предмет", "Преподаватель", "Дата", "Отметка", "Комментарий"];
            //for (var i = 0; i < titles.length; i++) {
            //    ths[i].value = titles[i];
            //}
            $marks_talbe.append(table);
        });
    }

    function loadStudents(group_id) {
        $("#select_student").children().remove();
        $("#marks_table").children().remove();
        query = "SELECT students.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name FROM students ";
        query += "JOIN users ON students.id = users.id ";
        query += "JOIN groups ON students.group_id = groups.id ";
        query += "WHERE groups.id = "+$("#group_id").data("value")+" ORDER BY name";
        sqlQuery(query, function(response) {
            var $select_student = $("#select_student");
            $select_student.children().remove();
            var select_student = slidedSelectTool("Студенты", "student_id", $.parseJSON(response));
            $select_student.append(select_student);
            $("#student_id").ready(loadMarks).on("click", ".item", loadMarks);
        });
    }

    $("body").ready(function () {
        query = "SELECT DISTINCT groups.id, groups.name FROM groups ";
        query += "JOIN students ON (groups.id = students.group_id) ";
        query += "ORDER BY groups.name";
        sqlQuery(query, function (response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
            $("#group_id").ready(loadStudents).on("click", ".item", loadStudents);
        });
    });
}

function navigationMenu() {
    var menu_structure = {
        "categories": [
            {
                "title": "Администрирование",
                "content": [
                    {
                        "title": "Учётные записи",
                        "url": "accounts.php"
                    },
                    {
                        "title": "Редактировать таблицы",
                        "url": "edit_tables.php"
                    },
                    {
                        "title": "Резервирование",
                        "url": "reservation.php"
                    },
                    {
                        "title": "Все таблицы",
                        "url": "all_tables.php"
                    },
                    {
                        "title": "Лог",
                        "url": "log.php"
                    }
                ]
            },
            {
                "title": "Расписание",
                "content": [
                    {
                        "title": "Для преподавателя",
                        "url": "schedule_for_teacher.php"
                    },
                    {
                        "title": "Для студента",
                        "url": "schedule_for_student.php"
                    },
                    {
                        "title": "Редактировать расписание",
                        "url": "edit_schedule.php"
                    }
                ]
            },
            {
                "title": "Отметки",
                "content": [
                    {
                        "title": "Для преподавателя",
                        "url": "marks_for_teacher.php"
                    },
                    {
                        "title": "Для студента",
                        "url": "marks_for_student.php"
                    }
                ]
            },
            {
                "title": "Отчёты",
                "content": [
                    {
                        "title": "Количество отметок",
                        "url": "reports.php"
                    }
                ]
            },
            {
                "title": "Пользователь",
                "content": [
                    {
                        "title": "Выйти",
                        "url": "logout.php"
                    },
                    {
                        "title": "*",
                        "url": "cards.php"
                    }
                ]
            }
        ]
    };

    var div = document.createElement("div");
    div.className = "navigation_div";
    var menu = document.createElement("ul");
    div.appendChild(menu);
    menu.className = "navigation_menu";
    $(menu).mouseenter(function() {$(menu).data("over_menu", true)});
    $(menu).mouseleave(function() {$(menu).data("over_menu", false)});
    $(menu).on("click", ">li", function() {
        if ($(this).hasClass("active")) {
            $(".navigation_menu li li").css("display", "none");
            $(".navigation_menu > li").removeClass("active");
        } else {
            $(".navigation_menu li li").css("display", "none");
            $(".navigation_menu > li").removeClass("active");
            $("li", this).css("display", "block");
            $(this).addClass("active");
        }
    });
    $(document).click(function () {
        if (!$(menu).data("over_menu")) {
            $(".navigation_menu li li").css("display", "none");
            $(".navigation_menu > li").removeClass("active");
        }
    });
    for (var i = 0; i < menu_structure.categories.length; i++) {
        var category = menu_structure.categories[i];
        var cat_li = document.createElement("li");
        menu.appendChild(cat_li);
        var p = document.createElement("p");
        p.textContent = category.title;
        cat_li.appendChild(p);
        var cat_ul = document.createElement("ul");
        cat_li.appendChild(cat_ul);
        for (var j = 0; j < category.content.length; j++) {
            var content = category.content[j];
            var a = document.createElement("a");
            a.textContent = content.title;
            a.href = content.url;
            var link = document.createElement("li");
            link.appendChild(a);
            cat_ul.appendChild(link);
        }
    }
    csv_download_form = csvDownloadForm();
    $("#download_button", csv_download_form).css("position", "absolute");
    $("#download_button", csv_download_form).css("right", "20px");
    $("#download_button", csv_download_form).css("top", "20px");

    div.appendChild(csv_download_form);

    return div;
}

function onCardsLoad() {
    function onClick(el) {
        el = el.currentTarget;
        if ($("label", el).html() != "") return;
        var $unclose = $(".game .unclose");
        var $labels = $("label", $unclose);
        if ($unclose.size() == 2) {
            if ($labels.first().html() != $labels.last().html()) {
                $labels.html("");
            }
            $unclose.removeClass("unclose").addClass("simple");
        }
        $(el).removeClass("simple").addClass("unclose");
        $("label", el).text(el.id);
        if ($(".game label").filter(function () {
                return $(this).html() == "";
            }).size() == 0) {
            location = "good.php";
        }
    }

    function autoPlay() {
        if ($("#bot_mode:checked").size() == 0) return;
        var $empty = $(".game .simple").filter(function () {
            return $("label", this).html() == "";
        });
        if ($empty.size() == 0) return;
        onClick({currentTarget: $empty.get(Math.floor(Math.random() * $empty.size()))});
    }

    $(document).ready(function() {
        $(".game").on("click", ".simple", onClick);

        setInterval(autoPlay, 200);

    });
}

function onAccountsLoad() {
    $(document).ready(function () {
        var query = "SELECT id, name FROM groups ORDER BY name";
        sqlQuery(query, function(response) {
            var $table = $("#student + div table");
            $table.append("<tr><td colspan='2'/></tr>");
            $("td:last", $table).append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
        });
    });
}