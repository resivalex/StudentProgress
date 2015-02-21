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

function fillAnswerToId(id) {
    return function(response, status, xhr) {
        document.getElementById(id).innerHTML = getTableFromJSON(response);
        document.getElementById(id).children[0].className = "custom_table";
    }
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

function selectToolClick(sender) {
    $(sender).parent().children().last().slideToggle();
}

function addLesson() {
    var radios = $("input").filter("[type='radio']:checked");
    var group_id = radios.filter("[name='group_id']:checked").val();
    var subject_id = radios.filter("[name='subject_id']:checked").val();
    var auditory_id = radios.filter("[name='auditory_id']:checked").val();
    var teacher_id = radios.filter("[name='teacher_id']:checked").val();
    var month = radios.filter("[name='month']:checked").val();
    var day = radios.filter("[name='day']:checked").val();
    var hour = radios.filter("[name='hour']:checked").val();
    var minute = radios.filter("[name='minute']:checked").val();
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