
$(document).ready(function() {
    var form = csvDownloadForm();
    $("#download_button", form).css("position", "absolute");
    $("#download_button", form).css("right", "20px");
    $("#download_button", form).css("top", "20px");

    $("#navigation").prepend(navigationMenu()).append(form);
});

// показать временное сообщение
function showMessage(message_text, title_text) {
    message_text = message_text.toString();
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
    var $table = $("<table/>");
    if (with_header) {
        var $tr = $("<tr/>");
        for (i in text) {
            $("<th/>").text(i).appendTo($tr);
        }
        $tr.appendTo($table);
    }
    var trs = [];
    for (i in text) {
        for (j = 0; j < text[i].length; j++) {
            trs[j] = $("<tr/>").appendTo($table);
        }
        if (text[i].length) break;
    }
    for (i = 0; i < trs.length; i++) {
        for (j in text) {
            $("<td/>").text(text[j][i]).appendTo(trs[i]);
        }
    }

    return $table.get(0);
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
        query.push("DELETE FROM "+tables[i]+" WHERE id = ?", id);
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
        $("tr", table).each(function(index, element) {
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
        $(el).children().remove();
        $(el).append(table);
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
    var props = allProperties(params);
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

function progression(from, to, step) {
    var res = [];
    while (from <= to) {
        res.push(from);
        from += step;
    }
    return res;
}

function slidedSelectTool(title, id, params) {
    var $select = $("<select/>").attr("id", id).css("width", "100%");
    var props = allProperties(params);
    params = arraysToObjects(params);
    for (i = 0; i < params.length; i++) {
        $("<option/>").text(params[i][props[1]]).val(params[i][props[0]]).appendTo($select);
    }
    return $select;
    //var tool = selectTool(title, id, params);
    //$(".box", tool).css("display", "none").css("position", "absolute").css("background-color", "#CCCCFF");
    //$(".item", tool).click(function() {
    //    $(this).parent().slideUp();
    //    $(".note", tool).fadeIn();
    //});
    //$(".note", tool).css("display", "block");
    //$(".top", tool).click(function() {
    //    $(".box", tool).css("width", $(tool).width());
    //    $(".box", tool).slideToggle();
    //    $(".note", tool).fadeToggle();
    //});
    //$(tool).mouseleave(function() {
    //    $(".box", tool).slideUp();
    //    $(".note", tool).fadeIn();
    //});
    //return tool;
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

function allProperties(val) {
    var res = [];
    for (i in val) {
        res.push(i);
    }
    return res;
}

function groupObjectsByProperty(objects, prop) {
    var res = Object();
    for (i = 0; i < objects.length; i++) {
        var object = objects[i];
        var key, val = {};
        for (var j in object) {
            if (j == prop) {
                key = object[j];
            } else {
                val[j] = object[j];
            }
        }
        if (!res[key]) res[key] = [];
        res[key].push(val);
    }
    return res;
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

function arraysToObjects(val) {
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

function objectsToArrays(val) {
    var res = [];
    for (i = 0; i < val.length; i++) {
        for (var j in val[i]) {
            if (res[j] == undefined) res[j] = [];
            res[j].push(val[i][j]);
        }
    }
    return res;
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

    return div;
}

function dateToDiv(date) {
    var year = parseInt(date.substr(0, 4));
    var month = parseInt(date.substr(5, 2));
    var day = parseInt(date.substr(8, 2));
    month--;
    var $year_div = $("<div/>").css({
        width: 40,
        height: 15,
        backgroundImage: "url('years.png')",
        backgroundPosition: "0px "+(-(year - 2013) * 15)+"px"
    });
    var $month_div = $("<div/>").css({
        width: 40,
        height: 20,
        backgroundImage: "url('months.png')",
        backgroundPosition: "0px "+(-month * 20)+"px"
    });
    var $day_div = $("<div/>").css({
        width: 40,
        height: 22,
        backgroundImage: "url('days.png')",
        backgroundPosition: ""+(-Math.floor(day / 10) * 40)+"px "+(-(day % 10) * 22)+"px"
    });

    return $("<div/>").append($year_div).append($month_div).append($day_div)
        .append($("<label/>").text(date).css("display", "none"));
}