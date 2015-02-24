function submit_remove_id_value(value) {
	hidden = document.getElementById('remove_id');
	hidden.value = value;
	f = document.forms[0];
	f.submit();
}

function cant_remove_group() {
	alert('Нельзя удалить группу пока в ней есть студенты');
}

function cant_remove_subject() {
	alert('Нельзя удалить дисциплину пока она есть в занятиях');
}

function open_card(row, column) {
	el1 = document.getElementById("row");
	el1.value = row;
	el2 = document.getElementById("col");
	el2.value = column;
	frm = document.forms[0];
	frm.submit();
}

function loadCalendar(year, month) {
    $("#day_select_tool").load("calendar.php", {"y":year, "m":month});
}

// показать временное сообщение
function showMessage(message_text) {
    layer = $("#message_layer");
    if (layer.size() == 0) {
        layer = document.createElement("div");
        layer.setAttribute("id", "message_layer");
        $("body").append(layer);
        layer = $("#message_layer");
        layer.css({"z-index": 100, "position": "fixed", "bottom": "0px", "left": "0px", "width": "30%",
            "text-align": "center", "background-color": "white", "opacity": "0.9"});
    }
    txt = document.createElement("p");
    txt.style.fontWeight = 600;
    var $temp = $(txt);
    $temp.html(message_text);
    $temp.css({"border-style": "solid", "border-width": "1px", "border-color": "#CCCCFF", "margin": "0px"});
    $temp.hide();
    $temp.ready(function() {
        setTimeout(function() {
            $temp.slideDown();
        }, 100);
        setTimeout(function() {
            $temp.slideUp(400, function() {$temp.remove();});
        }, 30000);
    });
    $temp.click(function() {
        $temp.slideUp(400, function() {$temp.remove();});
    });

    layer.prepend($temp);
}

function getTableFromJSON(text) {
    text = jQuery.parseJSON(text);

    var table = document.createElement("table");
    var tr = [];
    for (var i in text) {
        for (var j = 0; j < text[i].length; j++) {
            tr[j] = document.createElement("tr");
            table.appendChild(tr[j]);
        }
        break;
    }
    for (var i = 0; i < tr.length; i++) {
        for (var j in text) {
            var td = document.createElement("td");
            td.innerHTML = text[j][i];
            tr[i].appendChild(td);
        }
    }
    return table;
}

function selectQuery(query, params, fun) {
    var temp = document.createElement("div");
    $(temp).load("select_query.php", {"query": query, "params": params}, fun);
}

function modifyQuery(query, params, fun) {
    var temp = document.createElement("div");
    $(temp).load("modify_query.php", {"query": query, "params": params}, fun);
}

function splitSelectQueryFromParams(table_name, params) {
    var query = "SELECT " + params[0];
    for (var i = 1; i < params.length; i++) {
        query += ", " + params[i];
    }
    query += ", id FROM " + table_name;
    return query;
}

// загружает из базы данный ответ на query
function loadRemovableTable(table_name, id_name, query) {
    var el = document.getElementById(id_name);

    selectQuery(query, {}, function(response) {
        var table = getTableFromJSON(response);
        table.className = "custom_table";
        $(table).children().each(function(index, element) {
            $(element).find(":last").each(function(index, element) {
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
                    modifyQuery("DELETE FROM " + table_name + " WHERE id = " + id, {}, function(response) {
                        del.removeAttribute("disabled");
                        if ($.parseJSON(response) === false) {
                            $(tr).fadeTo(500, 1.0);
                            showMessage("Неудача");
                            del.style.color = "#BBBBBB";
                        } else {
                            showMessage("Удалено");
                            $(tr).fadeTo(200, 0.0);
                            loadRemovableTable(table_name, id_name, query);
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
    var query = "INSERT INTO " + table_name + " (" + params[0];
    for (var i = 1; i < params.length; i++) {
        query += ", " + params[i];
    }
    query += ") VALUES (?";
    for (var i = 1; i < params.length; i++) {
        query += ", ?";
    }
    query += ")";
    var qparams = [""];
    for (var i = 0; i < params.length; i++) {
        qparams[0] += "s";
        qparams.push(document.getElementById(table_name + "_" + params[i]).value);
    }
    modifyQuery(query, qparams, function(response) {
        if (jQuery.parseJSON(response) === false) {
            showMessage("Неудача");
            showMessage(query);
            showMessage(qparams);
        } else {
            showMessage("Добавлено");
            loadRemovableTable(table_name, table_name, splitSelectQueryFromParams(table_name, params));
        }
    });
}

// добавляет пользователя на странице accounts.php
function addToUsers(role_name) {
    var query = "INSERT INTO users ";
    query += "(name, surname, patronymic, login, password, role_id, email, phone) ";
    query += "VALUES (?, ?, ?, ?, ?, (SELECT id FROM roles WHERE name = ?), ?, ?)";
    var params = [];
    params.push("ssssssss");
    var block = $("." + role_name);
    params.push(block.find("input[name='name']").val());
    params.push(block.find("input[name='surname']").val());
    params.push(block.find("input[name='patronymic']").val());
    params.push(block.find("input[name='login']").val());
    params.push(block.find("input[name='password']").val());
    params.push(role_name);
    params.push(block.find("input[name='email']").val());
    params.push(block.find("input[name='phone']").val());

    modifyQuery(query, params, function(response) {
        showMessage(response);
        if ($.parseJSON(response) === false) {
            showMessage("Неудача");
            showMessage(query);
            showMessage(params);
        } else {
            showMessage("Добавлено");
            var query = "SELECT surname, users.name AS name, patronymic, login, password, email, phone, users.id AS id ";
            query += "FROM users ";
            query += "JOIN roles ON users.role_id = roles.id ";
            query += "WHERE roles.name = '" + role_name + "'";

            loadRemovableTable('users', role_name, query);
        }
    })
}

// функция для заполнения полей на login.php
function setFields() {
    $("input[name='login']").val("admin");
    $("input[name='password']").val("patented");
}

// добавляет занятие на странице edit_schedule.php
function addLesson() {
    showMessage($("#teacher_id").data("value"));
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
    modifyQuery(query, {}, function(response) {
        showMessage(response);
        if ($.parseJSON(response) === false) {
            showMessage("Неудача");
            showMessage(query);
        } else {
            showMessage("Добавлено");
            var select_query = "SELECT groups.name AS groups_name, subjects.name AS subject_name, ";
            select_query += "auditories.name AS auditory_name, users.surname AS user_name, time, lessons.id AS id "
            select_query += "FROM lessons "
            select_query += "JOIN groups ON (group_id = groups.id) "
            select_query += "JOIN subjects ON (subject_id = subjects.id) "
            select_query += "JOIN auditories ON (auditory_id = auditories.id) "
            select_query += "JOIN users ON (teacher_id = users.id)";

            loadRemovableTable('lessons', 'schedule', select_query);
        }
    });
}

//function selectTool(title, name, params) {
//    var tool = document.createElement("div");
//
//    tool.className = "radio-toolbar";
//    tool.id = name;
//    var top = document.createElement("div");
//    var box = document.createElement("div");
//    top.style.borderStyle = "outset";
//    top.style.borderWidth = "1px";
//    top.style.borderColor = "#8888AA";
//    top.style.height = "30px";
//    var top_title = document.createElement("label");
//    top_title.innerHTML = title;
//    top_title.style.marginTop = "5px";
//    top_title.style.marginLeft = "5px";
//    top.appendChild(top_title);
//    $(top).click(function() {
//        $(box).slideToggle();
//    });
//    tool.appendChild(top);
//    box.style.display = "none";
//    var first = null;
//    var top_label = document.createElement("label");
//    var props = [];
//    for (var i in params) {
//        props.push(i);
//    }
//    for (var i = 0; i < params[props[0]].length; i++) {
//        var radio = document.createElement("input");
//        radio.type = "radio";
//        radio.name = name;
//        radio.value = params[props[0]][i];
//        radio.id = name+"_"+params[props[0]][i];
//        if (first == null) {
//            first = radio;
//            top_label.innerHTML = params[props[1]][i];
//            top_label.className = "right_note";
//            top_label.style.marginTop = "5px";
//            top_label.style.marginRight = "5px";
//            top.appendChild(top_label);
//        }
//        box.appendChild(radio);
//        var label = document.createElement("label");
//        $(label).click(function() {
//            $(top_label).html($(this).html());
//            $(box).slideUp();
//        });
//        label.innerHTML = params[props[1]][i];
//        label.setAttribute("for", radio.id);
//        box.appendChild(label);
//        box.appendChild(document.createElement("br"));
//    }
//    top_title.innerHTML += " (" + params[props[0]].length + ")";
//    tool.appendChild(box);
//    if (first != null) {
//        first.checked = true;
//    }
//
//    return tool;
//}

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
    for (var i in params) {
        props.push(i);
    }
    for (var i = 0; i < params[props[0]].length; i++) {
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

function onMarksLoad() {
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
        selectQuery(query, {}, function(response) {
            if ($("#student_id").data("value") != undefined) {
                if ($.parseJSON(response).id.length == 0) {
                    response = "{\"message\": [\"Отметок нет!\"]}";
                }
                removeMark();
                var table = getTableFromJSON(response);
                table.className = "custom_table";
                $("#mark").append(table);
                query = "SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name";
                selectQuery(query, {}, function (response) {
                    var select_mark = selectTool("Отметка", "mark_type_id", $.parseJSON(response));
                    var mark_table = document.createElement("table");
                    var tr = document.createElement("tr");
                    mark_table.appendChild(tr);
                    mark_table.style.width = "100%";
                    mark_table.style.borderCollapse = "collapse";
                    mark_table.style.borderWidth = "0";
                    $(select_mark).find(".item").each(function () {
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        $(td).append(this);
                    });
                    $(select_mark).find(".box").append(mark_table);
                    select_mark.style.width = "150px";
                    select_mark.style.marginLeft = select_mark.style.marginRight = "auto";
                    var comment_table = getTableFromJSON("{\"c\":[\"\"]}");
                    comment_table.className = "custom_table";
                    var comment_area = document.createElement("textarea");
                    comment_area.value = "без комментариев";
                    comment_area.id = "comment_area";
                    $(comment_table).find("td").append(comment_area);
                    $("#mark").append(select_mark).append(comment_table);
                    var button = document.createElement("input");
                    button.type = "button";
                    button.style.display = "block";
                    button.style.marginLeft = button.style.marginRight = "auto";
                    button.value = "Добавить / Исправить";
                    $("#mark").append(button);
                    $(button).click(function() {
                        query = "CALL add_mark("+$("#student_id").data("value")+","+$("#lesson_id").data("value")+",";
                        query += $("#mark_type_id").data("value")+",'"+$("#comment_area").val()+"')";
                        modifyQuery(query, {}, function(response) {
                            loadMark();
                        });
                    });
                });
            }
        });

    }

    function loadStudentList(group_id) {
        removeStudentList();
        query = "SELECT users.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name FROM lessons ";
        query += "JOIN students ON lessons.group_id = students.group_id ";
        query += "JOIN users ON users.id = students.id ";
        query += "WHERE lessons.id = "+$("#lesson_id").data("value")+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            removeStudentList();
            var select_student = selectTool("Студенты", "student_id", $.parseJSON(response));
            //select_student.style.width = "50%";
            //select_student.style.marginLeft = "auto";
            //select_student.style.marginRight = "auto";
            $("#judging").append(select_student);
            $("student_id").ready(function() {
                loadMark();
            });
            $("#student_id .item").click(function() {
                loadMark();
            })
        });
    }

    function loadLessons(group_id) {
        removeAuditoryTime();
        query = "SELECT lessons.id AS id, concat(name, ' | ', time) AS name FROM lessons ";
        query += "JOIN auditories ON (lessons.auditory_id = auditories.id) ";
        query += "WHERE lessons.teacher_id = "+$("#teacher_id").data("value")+" AND ";
        query += "lessons.subject_id = "+$("#subject_id").data("value")+" AND ";
        query += "lessons.group_id = "+group_id+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            removeAuditoryTime()
            $("#select_auditory_time").append(slidedSelectTool("Аудитория | Время", "lesson_id", $.parseJSON(response)));
            $("#lesson_id").ready(function() {
                loadStudentList($("#lesson_id").data("value"));
            });
            $("#lesson_id .item").click(function() {
                loadStudentList($(this).data("value"));
            });
        });
    }

    function loadGroups(subject_id) {
        removeGroups();
        query = "SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) ";
        query += "WHERE lessons.subject_id = "+subject_id+" AND ";
        query += "lessons.teacher_id = "+$("#teacher_id").data("value")+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            removeGroups();
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)))
            $("#group_id").ready(function() {
                loadLessons($("#group_id").data("value"));
            });
            $("#group_id .item").click(function() {
                loadLessons($(this).data("value"));
            });
        })
    }

    function loadSubjects(teacher_id) {
        removeSubjects();
        query = "SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) ";
        query += "WHERE lessons.teacher_id = "+teacher_id+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            removeSubjects();
            $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
            $("#subject_id").ready(function() {
                loadGroups($("#subject_id").data("value"));
            });
            $("#subject_id .item").click(function() {
                loadGroups($(this).data("value"));
            });
        });
    }

    function loadTeachers() {
        var query = "SELECT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";

        selectQuery(query, {}, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").ready(function() {
                loadSubjects($("#teacher_id").data("value"));
            });
            $("#teacher_id .item").click(function() {
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
    $(tool).find(".box").css("display", "none");
    $(tool).find(".item").click(function() {
        $(this).parent().slideUp();
        $(tool).find(".note").fadeIn();
    });
    $(tool).find(".note").css("display", "block");
    $(tool).find(".top").click(function() {
        $(tool).find(".box").slideToggle();
        $(tool).find(".note").fadeToggle();
    });
    return tool;
}

function onEditScheduleLoad() {
    $("body").ready(function() {
        var query = "SELECT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) ";
        query += "FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";
        selectQuery(query, {}, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM subjects ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM groups ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM auditories ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_auditory").append(slidedSelectTool("Аудитория", "auditory_id", $.parseJSON(response)));
        });
        var month_names = {
            id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            name: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
        };
        $("#select_month").append(slidedSelectTool("Месяц", "month", month_names));
        loadCalendar(2013, 1);
        $("#month .item").click(function() {
            loadCalendar(2013, $(this).data("value"));
        })
        $("#month label[for]").click(function() {
            id = this.getAttribute("for");
            loadCalendar(2013, $("#"+id).val());
        });
        $("#select_hour").append(slidedSelectTool("Часы", "hour", {id: progression(7, 18, 1), name: progression(7, 18, 1)}));
        $("#select_minute").append(slidedSelectTool("Минуты", "minute", {id: progression(0, 55, 5), name: progression(0, 55, 5)}));
    });
}
