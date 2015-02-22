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

function simpleAJAX(id, address, params, readyFunc) {
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (id != '') {
                document.getElementById(id).innerHTML = xmlHttp.responseText;
            }
            if (readyFunc) readyFunc(xmlHttp.responseText);
        }
    }
    for (i = 0; i < params.length; i++) {
        address += (i == 0? '?' : '&') + params[i][0] + '=' + params[i][1];
    }
    xmlHttp.open("GET", address, true);
    xmlHttp.send();
}

function simpleAJAX2(id, address, params) {
    if (window.XMLHttpRequest) {
        xmlHttp2 = new XMLHttpRequest();
    } else {
        xmlHttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttp2.onreadystatechange = function() {
        if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200) {
            if (id != '') {
                document.getElementById(id).innerHTML = xmlHttp2.responseText;
            }
        }
    }
    for (i = 0; i < params.length; i++) {
        address += (i == 0? '?' : '&') + params[i][0] + '=' + params[i][1];
    }
    xmlHttp2.open("GET", address, true);
    xmlHttp2.send();
}

function loadCalendar(year, month) {
    simpleAJAX('day_select_tool', 'calendar.php', [['y', year], ['m', month]]);
}

function loadLesson(lesson_id) {
    simpleAJAX('lesson_judging', 'lesson_judging.php', [['lesson_id', lesson_id]]);
}

function loadStudentProgress(lesson_id, student_id) {
    simpleAJAX('student_judging', 'student_judging.php', [['lesson_id', lesson_id], ['student_id', student_id]]);
}

function addMarkFact(lesson_id, student_id) {
    simpleAJAX('', 'add_mark_fact.php', [['lesson_id', lesson_id], ['student_id', student_id]]);
}

function checkedRadio(name) {
    var inputs = document.getElementsByTagName('input');
    var value;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'radio' && inputs[i].name == name && inputs[i].checked) {
            // get value, set checked flag or do whatever you need to
            value = inputs[i].value;
        }
    }
    return value;
}

function addMark(lesson_id, student_id, mark_type) {
    simpleAJAX2('debug', 'add_mark.php', [['lesson_id', lesson_id], ['student_id', student_id], ['mark_type', mark_type]]);
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

function setFields() {
    $("input[name='login']").val("admin");
    $("input[name='password']").val("patented");
}

function addLesson() {
    var radios = $("input[type='radio']:checked");
    var group_id = radios.filter("[name='group_id']").val();
    var subject_id = radios.filter("[name='subject_id']").val();
    var auditory_id = radios.filter("[name='auditory_id']").val();
    var teacher_id = radios.filter("[name='teacher_id']").val();
    var month = radios.filter("[name='month']").val();
    var day = radios.filter("[name='day']").val();
    var hour = radios.filter("[name='hour']").val();
    var minute = radios.filter("[name='minute']").val();
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

function selectTool(title, name, params) {
    var tool = document.createElement("div");

    tool.className = "radio-toolbar";
    tool.id = name;
    var top = document.createElement("div");
    var box = document.createElement("div");
    top.style.borderStyle = "outset";
    top.style.borderWidth = "1px";
    top.style.borderColor = "#8888AA";
    top.style.height = "30px";
    var top_title = document.createElement("label");
    top_title.innerHTML = title;
    top_title.style.marginTop = "5px";
    top_title.style.marginLeft = "5px";
    top.appendChild(top_title);
    $(top).click(function() {
        $(box).slideToggle();
    });
    tool.appendChild(top);
    box.style.display = "none";
    var first = null;
    var top_label = document.createElement("label");
    var props = [];
    for (var i in params) {
        props.push(i);
    }
    for (var i = 0; i < params[props[0]].length; i++) {
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = params[props[0]][i];
        radio.id = name+"_"+params[props[0]][i];
        if (first == null) {
            first = radio;
            top_label.innerHTML = params[props[1]][i];
            top_label.className = "right_note";
            top_label.style.marginTop = "5px";
            top_label.style.marginRight = "5px";
            top.appendChild(top_label);
        }
        box.appendChild(radio);
        var label = document.createElement("label");
        $(label).click(function() {
            $(top_label).html($(this).html());
            $(box).slideUp();
        });
        label.innerHTML = params[props[1]][i];
        label.setAttribute("for", radio.id);
        box.appendChild(label);
        box.appendChild(document.createElement("br"));
    }
    top_title.innerHTML += " (" + params[props[0]].length + ")";
    tool.appendChild(box);
    if (first != null) {
        first.checked = true;
    }

    return tool;
}

function fillToId(id, text) {
    $("#"+id).html(text);
}

function onMarksLoad() {
    function loadLessons(group_id) {
        query = "SELECT lessons.id AS id, concat(name, ' | ', time) AS name FROM lessons ";
        query += "JOIN auditories ON (lessons.auditory_id = auditories.id) ";
        query += "WHERE lessons.teacher_id = "+$("#teacher_id input[type='radio']:checked").val()+" AND ";
        query += "lessons.subject_id = "+$("#subject_id input[type='radio']:checked").val()+" AND ";
        query += "lessons.group_id = "+group_id+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_auditory_time").append(selectTool("Аудитория | Время", "lesson_id", $.parseJSON(response)));
        });
    }

    function loadGroups(subject_id) {
        query = "SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) ";
        query += "WHERE lessons.subject_id = "+subject_id+" AND ";
        query += "lessons.teacher_id = "+$("#teacher_id input[type='radio']:checked").val()+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_group").append(selectTool("Группа", "group_id", $.parseJSON(response)))
            $("#group_id").ready(function() {
                loadLessons($("#group_id input[type='radio']:checked").val());
            });
            $("#group_id label[for]").click(function() {
                $("#select_auditory_time").children().remove();
                loadLessons($("#"+this.getAttribute("for")).val());
            })
        })
    }
    function loadSubjects(teacher_id) {
        query = "SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) ";
        query += "WHERE lessons.teacher_id = "+teacher_id+" ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_subject").append(selectTool("Дисциплина", "subject_id", $.parseJSON(response)));
            $("#subject_id").ready(function() {
                loadGroups($("#subject_id input[type='radio']:checked").val());
            });
            $("#subject_id label[for]").click(function() {
                $("#select_group").children().remove();
                $("#select_auditory_time").children().remove();
                loadGroups($("#"+this.getAttribute("for")).val());
            })
        });
    }
    $("body").ready(function() {
        var query = "SELECT teachers.id, users.surname FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";
        selectQuery(query, {}, function(response) {
            $("#select_teacher").append(selectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").ready(function() {
                loadSubjects($("#teacher_id input[type='radio']:checked").val());
            });
            $("#teacher_id label[for]").click(function() {
                $("#select_subject").children().remove();
                $("#select_group").children().remove();
                $("#select_auditory_time").children().remove();
                loadSubjects($("#"+this.getAttribute("for")).val());
            });
        });
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

function onEditScheduleLoad() {
    $("body").ready(function() {
        var query = "SELECT teachers.id, users.surname FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";
        selectQuery(query, {}, function(response) {
            $("#select_teacher").append(selectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM subjects ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_subject").append(selectTool("Дисциплина", "subject_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM groups ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_group").append(selectTool("Группа", "group_id", $.parseJSON(response)));
        });
        query = "SELECT id, name FROM auditories ORDER BY name";
        selectQuery(query, {}, function(response) {
            $("#select_auditory").append(selectTool("Аудитория, время", "auditory_id", $.parseJSON(response)));
        });
        var month_names = {
            id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            name: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
        };
        $("#select_month").append(selectTool("Месяц", "month", month_names));
        loadCalendar(2013, 1);
        $("#month label[for]").click(function() {
            id = this.getAttribute("for");
            loadCalendar(2013, $("#"+id).val());
        });
        $("#select_hour").append(selectTool("Часы", "hour", {id: progression(7, 18, 1), name: progression(7, 18, 1)}));
        $("#select_minute").append(selectTool("Минуты", "minute", {id: progression(0, 55, 5), name: progression(0, 55, 5)}));
    });
}
