
$(document).ready(function() {
    $("#csv_div").append(csvDownloadForm());
    $(document).on("click", ".log_table td", function() {
        var text = $(this).html();
        //text = text.replace(/, /g, ",<br>");
        text = text.replace(/ FROM/g, "<br>FROM");
        text = text.replace(/ JOIN/g, "<br>JOIN");
        text = text.replace(/ WHERE/g, "<br>WHERE");
        text = text.replace(/SELECT /g, "SELECT<br>");
        text = text.replace(/ SELECT/g, "<br>SELECT");
        text = text.replace(/ VALUES/g, "<br>VALUES");
        $(this).html(text);
    });
    navigationPrepare();
});

function navigationPrepare() {
    $("#navigation_menu").on("click", ".category", onNavigationCategoryClick);
    $(document).click(function(event) {
        $("#navigation_menu .active", document).removeClass("active");
    });

    function onNavigationCategoryClick(event) {
        function recalcItemPadding() {
            var $nav_menu = $("#navigation_menu");
            var menu_width = $nav_menu.width() + 20;
            var items_sum_width = 0;
            var $items = $(".active .item", $nav_menu);
            $items.each(function() {
                items_sum_width += $(this).width();
            });
            var delta = menu_width - items_sum_width;

            delta /= ($items.size() * 2);
            delta = Math.max(delta, 20);
            delta = "" + delta + "px";
            $items.css({paddingLeft: delta, paddingRight: delta});
        }
        if (!$(this).hasClass("active")) {
            $("#navigation_menu .active", document).removeClass("active");
            $(this).addClass("active");
            recalcItemPadding();
            $(".submenu", this).position({
                of: $("#navigation_menu"),
                my: "center top",
                at: "center bottom",
                collision: "fit none"
            });
            $(".submenu", this).position({
                of: $("#navigation_menu"),
                my: "center top",
                at: "center bottom",
                collision: "fit none"
            });
            event.stopPropagation();
        }
    }
}


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
    if (with_header !== undefined) {
        var $tr = $("<tr/>");
        for (i in text) {
            var val = with_header[i];
            if (val === undefined) val = i;
            $("<th/>").text(val).appendTo($tr);
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
        $(table).appendTo($(el));
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

function toIndexArray(val) {
    var ind = 0;
    for (var i in val) {
        val[ind++] = val[i];
        delete val[i];
    }
    return val;
}

// return div 40x57 year, month, day from top to bottom
function dateToDiv(date) {
    var year = parseInt(date.substr(0, 4));
    var month = parseInt(date.substr(5, 2));
    var day = parseInt(date.substr(8, 2));
    month--;
    var $year_div = $("<div/>").css({
        width: 40,
        height: 15,
        backgroundImage: "url('images/years.png')",
        backgroundPosition: "0px "+(-(year - 2013) * 15)+"px"
    });
    var $month_div = $("<div/>").css({
        width: 40,
        height: 20,
        backgroundImage: "url('images/months.png')",
        backgroundPosition: "0px "+(-month * 20)+"px"
    });
    var $day_div = $("<div/>").css({
        width: 40,
        height: 22,
        backgroundImage: "url('images/days.png')",
        backgroundPosition: ""+(-Math.floor(day / 10) * 40)+"px "+(-(day % 10) * 22)+"px"
    });

    return $("<div/>").append($year_div).append($month_div).append($day_div)
        .append($("<label/>").text(date).css("display", "none"));
}

// table, which divide set to subsets by date and one of properties
// targetId - parent ID
// query - to get set
// groupProperty - field name to group
// dateProperty - where is date
// infoHeaderNamesMap - header names for subsets
function gridDateTable(option) {
    function getWithCheck(param) {
        if (option[param] == undefined) showMessage("gridDateTable need in '"+param+"' param");
        return option[param];
    }
    var targetId = getWithCheck("targetId");
    var query = getWithCheck("query");
    var groupProperty = getWithCheck("groupProperty");
    var dateProperty = getWithCheck("dateProperty");
    var infoHeaderNamesMap = getWithCheck("infoHeaderNamesMap");
    var $target = $("#"+targetId);
    function setCell($cell, $for_text, content, row_key, date) {
        var info = content[row_key][date];
        if (info === undefined) return;
        $cell.css({cursor: "pointer", textAlign: "center"});
        $for_text.text(info.length);
        $cell.hover(function () {
            $("#info").remove();
            var $info = $(getTable(objectsToArrays(info), infoHeaderNamesMap)).appendTo($target);
            $info.addClass("tip_table");
            $info.css({position: "absolute"});
            $info.attr("id", "info");
            var $tr = $("<tr/>").prependTo($info);
            var $info_title = $("<td/>").text(row_key + " " + date).appendTo($tr);
            $info_title.attr("colspan", allProperties(info[0]).length);
            $info_title.css("text-align", "center");

            $info.css({
                position: "absolute",
                left: $(this).offset().left + $(this).width() + "px",
                top: $(this).offset().top - $info.height() + "px"
            });
        }, function () {
            $("#info").remove();
        }).click(function() {
            var $info = $("#info");
            var $res = $info.clone().appendTo($target);

            $("*", document).removeClass("selected_cell");
            $(this).addClass("selected_cell");
            $("#res").remove();
            $res.attr("id", "res");
            $res.css({position: "static"});
            $res.position({
                of: $info,
                my: "left top",
                at: "left top"
            });
            $info.remove();
            $res.animate({left: 0, top: 0}, function () {
                $res.addClass("custom_table");
                $res.removeClass("tip_table");
            });
        });
    }

    sqlQuery(query, function(response) {
        var content = $.parseJSON(response);
        content["date"] = [];
        for (i = 0; i < content[dateProperty].length; i++) {
            var time = content[dateProperty][i];
            content["date"].push(time.substr(0, 10));
            content[dateProperty][i] = time.substr(11);
        }
        content = arraysToObjects(content);
        var dates = Object();
        for (i = 0; i < content.length; i++) {
            dates[content[i]["date"]] = true;
        }
        dates = allProperties(dates).sort();
        content = groupObjectsByProperty(content, groupProperty);
        var row_keys = allProperties(content).sort();
        for (var i in content) {
            content[i] = groupObjectsByProperty(content[i], "date");
        }
        $target.children().remove();
        var tableData = scrollableTable({
            target: $target,
            classes: ["auto_margin", "progress_table"],
            contentHeight: 300,
            contentWidth: 500,
            columnHeaders: dates.map(function(date) {return dateToDiv(date);}),
            rowHeaders: row_keys,
            content: row_keys.map(function(row_key) {
                return dates.map(function(date) {
                    if (content[row_key][date] == undefined) return "";
                    return content[row_key][date].length;
                });
            })
        });
        for (i = 0; i < tableData.cellOutDivs.length; i++) {
            for (j = 0; j < tableData.cellOutDivs[i].length; j++) {
                setCell(tableData.cellOutDivs[i][j], tableData.cellDivs[i][j], content, row_keys[i], dates[j]);
            }
        }
    });
}

// All numeric values in pixels
// target jQuery - parent. default: body
//
// classes string or string array. default: []
//
// content[][] - content: strings or elements. default: [["no content"]]
// contentWidth. default: 400
// contentHeight. default: 200
//
// rowHeaders[] - row names: strings or elements. default: "row#N"
// columnHeaders[] - column names: strings or elements. default: "col#N"
//
// cornerElement jQuery - any. default: nothing
function scrollableTable(option) {
    function getOption(name, init) {
        var val = option[name];
        if (val == undefined) val = init;
        return val;
    }

    var result = {
        table: null,
        rowOutDivs: [],
        colOutDivs: [],
        cellOutDivs: [],
        rowDivs: [],
        colDivs: [],
        cellDivs: []
    };

    if (option == undefined) option = [];
    var $target = getOption("target", $("body"));
    var classes = getOption("classes", []);
    var rowHeaders = getOption("rowHeaders", []);
    var columnHeaders = getOption("columnHeaders", []);
    var content = getOption("content", [["no content"]]);
    var contentWidth = getOption("contentWidth", 400);
    var contentHeight = getOption("contentHeight", 200);
    var $cornerElement = getOption("cornerElement", undefined);

    // local variables
    var $tr, $td, $div, $inDiv;
    var i, j;

    var $table = $("<table/>").appendTo($target);
    result.table = $table;
    $table.addClass("clear_table");
    if (typeof classes == "string") classes = [classes];
    classes.forEach(function(el) {$table.addClass(el)});

    // skeleton
    var $skel = [];
    for (i = 0; i < 3; i++) {
        $skel[i] = [];
        $tr = $("<tr/>").appendTo($table);
        for (j = 0; j < 3; j++) {
            $skel[i][j] = $("<td/>").appendTo($tr);
        }
    }

    // binding to skeleton
    var $verticalSlider = $("<div/>").appendTo($skel[1][0]);
    var $horizontalSlider = $("<div/>").appendTo($skel[2][2]);
    var $leftHeaders = $("<div/>").appendTo($skel[1][1]);
    var $topHeaders = $("<div/>").appendTo($skel[0][2]);
    var $content = $("<div/>").appendTo($skel[1][2]);
    var $corner = $("<div/>").appendTo($skel[0][1]);
    if ($cornerElement != undefined) $cornerElement.appendTo($corner);

    // colors
    farColor = "#ddf";
    nearColor = "#eef";
    belowColor = "#fff";
    // styles
    $corner.addClass("corner");
    $corner.css({backgroundColor: farColor});
    $topHeaders.addClass("top_header");
    $leftHeaders.addClass("left_header");
    $content.addClass("content");

    // jQuery arrays for events
    var $rowHeader = [];
    var $colHeader = [];
    var $cell = [];
    $table.data("rowHeader", $rowHeader);
    $table.data("colHeader", $colHeader);
    $table.data("cell", $cell);

    // data table
    var $contentTable = $("<table/>").appendTo($content);
    for (i = 0; i < content.length; i++) {
        $cell[i] = [];
        $tr = $("<tr/>").appendTo($contentTable);
        for (j = 0; j < content[i].length; j++) {
            $td = $("<td/>").appendTo($tr);
            $div = $("<div/>").appendTo($td);
            $inDiv = $("<div/>").appendTo($div);
            $inDiv.addClass("cell");
            if (typeof content[i][j] == "string") {
                $inDiv.text(content[i][j]);
            } else {
                $inDiv.append(content[i][j]);
            }
            if (j == 0) {
                result.cellDivs.push([]);
                result.cellOutDivs.push([]);
            }
            result.cellOutDivs[i].push($div);
            result.cellDivs[i].push($inDiv);
            $cell[i][j] = $td;
        }
    }

    // left headers
    var $leftTable = $("<table/>").appendTo($leftHeaders);
    for (i = 0; i < content.length; i++) {
        $tr = $("<tr/>").appendTo($leftTable);
        $td = $("<td/>").appendTo($tr);
        $div = $("<div/>").appendTo($td);
        $inDiv = $("<div/>").appendTo($div);
        $inDiv.addClass("row_header");
        if (i < rowHeaders.length) {
            if (typeof rowHeaders[i] == "string") {
                $inDiv.text(rowHeaders[i]);
            } else {
                $inDiv.append(rowHeaders[i]);
            }
        } else {
            $inDiv.text("row#"+i);
        }
        result.rowOutDivs.push($div);
        result.rowDivs.push($inDiv);
        $rowHeader[i] = $td;
    }

    // top headers
    var $topTable = $("<table/>").appendTo($topHeaders);
    $tr = $("<tr/>").appendTo($topTable);
    for (i = 0; i < content[0].length; i++) {
        $td = $("<td/>").appendTo($tr);
        $div = $("<div/>").appendTo($td);
        $inDiv = $("<div/>").appendTo($div);
        $inDiv.addClass("col_header");
        if (i < columnHeaders.length) {
            if (typeof columnHeaders[i] == "string") {
                $inDiv.text(columnHeaders[i]);
            } else {
                $inDiv.append(columnHeaders[i]);
            }
        } else {
            $inDiv.text("row#"+i);
        }
        result.colOutDivs.push($div);
        result.colDivs.push($inDiv);
        $colHeader[i] = $td;
    }

    var silverTables = [$contentTable, $leftTable, $topTable];
    for (i = 0; i < silverTables.length; i++) {
        $("td", silverTables[i]).addClass("silver_border");
    }
    var grayCells = [$skel[1][1], $skel[0][2], $skel[1][2]];
    for (i = 0; i < grayCells.length; i++) {
        grayCells[i].addClass("gray_border");
    }

    for (i = 0; i < $rowHeader.length; i++) {
        $rowHeader[i].data("row_index", i);
        for (j = 0; j < $colHeader.length; j++) {
            if (i == 0) {
                $colHeader[j].data("col_index", j);
            }
            $cell[i][j].data("row_index", i).data("col_index", j);
        }
    }

    function lightRow(num, color) {
        $rowHeader[num].css({backgroundColor: color});
        for (j = 0; j < $colHeader.length; j++) {
            $cell[num][j].css({backgroundColor: color});
        }
    }

    function lightCol(num, color) {
        $colHeader[num].css({backgroundColor: color});
        for (j = 0; j < $rowHeader.length; j++) {
            $cell[j][num].css({backgroundColor: color});
        }
    }

    for (i = 0; i < $rowHeader.length; i++) {
        lightRow(i, farColor);
        $rowHeader[i].hover(function() {
            lightRow($(this).data("row_index"), nearColor);
        }, function() {
            lightRow($(this).data("row_index"), farColor);
        });
    }
    for (i = 0; i < $colHeader.length; i++) {
        lightCol(i, farColor);
        $colHeader[i].hover(function() {
            lightCol($(this).data("col_index"), nearColor);
        }, function() {
            lightCol($(this).data("col_index"), farColor);
        });
    }
    for (i = 0; i < $rowHeader.length; i++) {
        for (j = 0; j < $colHeader.length; j++) {
            $cell[i][j].hover(function() {
                var $table = $(this).closest(".clear_table");
                var $row_header = $table.data("row_header");
                var $col_header = $table.data("col_header");
                var $cell = $table.data("cell");

                lightRow($(this).data("row_index"), nearColor);
                lightCol($(this).data("col_index"), nearColor);
                $(this).css({backgroundColor: belowColor});
            }, function() {
                var $table = $(this).closest(".clear_table");
                var $row_header = $table.data("row_header");
                var $col_header = $table.data("col_header");
                var $cell = $table.data("cell");

                lightRow($(this).data("row_index"), farColor);
                lightCol($(this).data("col_index"), farColor);
            });
        }
    }

    // correct row heights
    for (i = 0; i < $rowHeader.length; i++) {
        var maxHeight = $rowHeader[i].children().height();
        for (j = 0; j < $colHeader.length; j++) {
            maxHeight = Math.max(maxHeight, $cell[i][j].children().height());
        }
        $rowHeader[i].children().height(maxHeight);
        for (j = 0; j < $colHeader.length; j++) {
            $cell[i][j].children().height(maxHeight);
        }
    }

    // correct column width
    for (i = 0; i < $colHeader.length; i++) {
        var maxWidth = $colHeader[i].children().width();
        for (j = 0; j < $rowHeader.length; j++) {
            maxWidth = Math.max(maxWidth, $cell[j][i].children().width());
        }
        $colHeader[i].children().width(maxWidth);
        for (j = 0; j < $rowHeader.length; j++) {
            $cell[j][i].children().width(maxWidth);
        }
    }

    // correct left header
    maxWidth = $corner.width();
    for (i = 0; i < $rowHeader.length; i++) {
        maxWidth = Math.max(maxWidth, $rowHeader[i].children().width());
    }
    $corner.width(maxWidth);
    for (i = 0; i < $rowHeader.length; i++) {
        $rowHeader[i].children().width(maxWidth);
    }
    
    // correct top header
    maxHeight = $corner.height();
    for (i = 0; i < $colHeader.length; i++) {
        maxHeight = Math.max(maxHeight, $colHeader[i].children().height());
    }
    $corner.height(maxHeight);
    for (i = 0; i < $colHeader.length; i++) {
        $colHeader[i].children().height(maxHeight);
    }

    // correct content sizes
    maxHeight = $contentTable.height();
    maxHeight = Math.min(maxHeight, contentHeight);
    $verticalSlider.height(maxHeight);
    $leftHeaders.height(maxHeight);
    $content.height(maxHeight);

    maxWidth = $contentTable.width();
    maxWidth = Math.min(maxWidth, contentWidth);
    $horizontalSlider.width(maxWidth);
    $topHeaders.width(maxWidth);
    $content.width(maxWidth);

    // set sliders
    var left_interval = $content.get(0).scrollHeight - $content.get(0).clientHeight;
    if (left_interval < 1) left_interval = 1;
    $table.data("content", $content);
    $table.data("leftHeader", $leftHeaders);
    $table.data("topHeader", $topHeaders);
    $verticalSlider.slider({
        //range: "max",
        animate: "fast",
        orientation: "vertical",
        min: 0,
        max: left_interval,
        value: left_interval,
        disabled: left_interval == 1,
        slide: function() {
            var val = $verticalSlider.slider("option", "max") - $verticalSlider.slider("option", "value");
            $table = $(this).closest(".clear_table");
            $table.data("content").scrollTop(val);
            $table.data("leftHeader").scrollTop(val);
        }
    });
    $verticalSlider.addClass("slider_div");
    $skel[1][0].addClass("dont_cut");
    $verticalSlider.addClass("dont_cut");

    var top_interval = $content.get(0).scrollWidth - $content.get(0).clientWidth;
    if (top_interval < 1) top_interval = 1;
    $horizontalSlider.slider({
        //range: "min",
        animate: "fast",
        orientation: "horizontal",
        min: 0,
        max: top_interval,
        value: 0,
        disabled: top_interval == 1,
        slide: function() {
            var val = $horizontalSlider.slider("option", "value");
            $table = $(this).closest(".clear_table");
            $table.data("content").scrollLeft(val);
            $table.data("topHeader").scrollLeft(val);
        }
    });
    $skel[2][2].addClass("dont_cut");
    $horizontalSlider.addClass("dont_cut");

    return result;
}