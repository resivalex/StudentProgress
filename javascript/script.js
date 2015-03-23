
$(document).ready(function() {
    $(document).on("click", ".log_table td", function() {
        var text = $(this).html();
        //text = text.replace(/, /g, ",<br>");
        //text = text.replace(/ FROM/g, "<br>FROM");
        //text = text.replace(/ JOIN/g, "<br>JOIN");
        //text = text.replace(/ WHERE/g, "<br>WHERE");
        //text = text.replace(/SELECT /g, "SELECT<br>");
        //text = text.replace(/ SELECT/g, "<br>SELECT");
        //text = text.replace(/ VALUES/g, "<br>VALUES");
        //text = text.replace(/ ORDER/g, "<br>ORDER");
        text = text.replace(/\\r\\n/g, "<br>");
        if (text != $(this).html()) {
            $(this).html(text);
        }
    });
    navigationPrepare();
});

function navigationPrepare() {
    $("#navigation_menu").on("click", ".category", onNavigationCategoryClick);
    $(".navigation_div .user-title").on("click", onUserTitleClick);
    $(document).click(function(event) {
        $(".navigation_div .active", document).removeClass("active");
    });
    $(".navigation_div .user-action-name").on("click", function() {
        serverQuery("change role", {role: $(this).attr("title")}, function() {
            document.location.reload();
        });
    });

    function onUserTitleClick(event) {
        var $userActionsDiv = $(".navigation_div .user");
        if ($userActionsDiv.hasClass("active")) {
            $userActionsDiv.removeClass("active");
        } else {
            $userActionsDiv.addClass("active");
        }
        event.stopPropagation();
    }

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
    if (message_text === null) message_text = "showMessage got 'null'";
    if (message_text === undefined) message_text = "showMessage got 'undefined'";
    message_text = message_text.toString();
    if (title_text == undefined) {
        var max_len = 30;
        title_text = message_text.substr(0, max_len) + (message_text.length > max_len? "..." : "");
    }
    if (document.getElementById("message_layer") == undefined) {
        $("<div/>").attr("id", "message_layer").appendTo($("body"));
    }
    var $layer = $("#message_layer");
    var $message = $("<div/>").prependTo($layer);
    $message.css({
        maxHeight: "200px",
        overflow: "auto"
    });
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

function devidedTable(arr) {
    var i, j;
    var result = {
        table: null,
        tr: [],
        td: []
    };

    result.table = $("<table/>");
    for (i = 0; i < arr.length; i++) {
        result.tr.push($("<tr/>").appendTo(result.table));
        result.td.push([]);
        for (j = 0; j < arr[i].length; j++) {
            result.td[i].push($("<td/>").appendTo(result.tr[i]));
            if (typeof arr[i][j] === "string") {
                result.td[i][j].text(arr[i][j]);
            } else {
                result.td[i][j].append(arr[i][j]);
            }
        }
    }

    return result;
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

function serverQuery(name, params, fun) {
    if (typeof params == "function") {
        fun = params;
        params = [];
    }
    if (name.name !== undefined) {
        params = name.params;
        name = name.name;
    }
    $.ajax({
        method: "POST",
        url: "server_query.php",
        data: {
            name: name,
            params: params
        }
    }).done(fun);
}

// таблица с возможностью удаления
function loadRemovableTable(targetId, getQuery, delQueryName) {
    var $target = $("#"+targetId);

    serverQuery(getQuery, function(response) {
        $target.children().remove();
        var $table = $(getTableFromJSON(response)).appendTo($target);
        $table.addClass("custom_table");
        $("tr", $table).each(function(index, element) {
            $(":last", element).each(function(index, element) {
                var id = element.innerHTML;
                element.innerHTML = "";
                var $del = $("<button/>").appendTo($(element));
                $del.text("Удалить");
                $del.attr({type: "button"});
                $del.click(function() {
                    $del.prop({disabled: true});
                    var $tr = $del;
                    while (($tr[0].tagName).toUpperCase() != "TR") {
                        $tr = $tr.parent();
                    }
                    $tr.fadeTo(500, 0.5);
                    serverQuery(delQueryName, {id: id}, function(response) {
                        $del.removeProp("disabled");
                        if ($.parseJSON(response) === false) {
                            $tr.fadeTo(500, 1.0);
                            showJSON(delQueryName, "Неудача");
                            $del.css({color: "#BBBBBB"});
                        } else {
                            showMessage("Удалено");
                            $tr.fadeTo(200, 0.0);
                            loadRemovableTable(targetId, getQuery, delQueryName);
                        }
                    });
                });
            });
        });
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
    var arr = [];
    for (var i in val) {
        arr.push(val[i])
    }
    return arr;
}

function rotable2DArray(arr) {
    var res = [];
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].length; j++) {
            if (i == 0) res.push([]);
            res[j][i] = arr[i][j];
        }
    }
    return res;
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
// cornerElement
function gridDateTable(option) {
    function getWithCheck(param) {
        if (option[param] == undefined) showMessage("gridDateTable need in '"+param+"' param");
        return option[param];
    }
    function defaultTipTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap) {
        var info = content[row_key][date];
        if (info === undefined) return undefined;
        var $table = $(getTable(objectsToArrays(info), infoHeaderNamesMap));
        $table.addClass("tip_table");
        var $tr = $("<tr/>").prependTo($table);

        return $table;
    }
    function defaultNextTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap) {
        var info = content[row_key][date];
        if (info === undefined) return undefined;
        var $table = $(getTable(objectsToArrays(info), infoHeaderNamesMap));
        $table.addClass("custom_table").addClass("auto_margin");
        var $tr = $("<tr/>").prependTo($table);
        var $info_title = $("<td/>").text(row_key + " " + date).appendTo($tr);
        $info_title.attr("colspan", allProperties(info[0]).length);
        $info_title.css({textAlign: "center", fontWeight: "bold"});

        return $table;
    }
    var targetId = getWithCheck("targetId");
    var query = getWithCheck("query");
    var groupProperty = getWithCheck("groupProperty");
    var dateProperty = getWithCheck("dateProperty");
    var infoHeaderNamesMap = getWithCheck("infoHeaderNamesMap");
    var $target = $("#"+targetId);
    var getTipTable = option["getTipTable"];
    if (getTipTable === undefined) getTipTable = defaultTipTable;
    var getNextTable = option["getNextTable"];
    if (getNextTable === undefined) getNextTable = defaultNextTable;
    function setCell($cell, $for_text, content, row_key, date) {
        var info = content[row_key][date];
        if (info === undefined) return;
        $cell.css({cursor: "pointer", textAlign: "center"});
        $for_text.text(info.length);
        $cell.hover(function () {
            var $table = getTipTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap);
            $table.appendTo($target);
            $table.css({
                position: "absolute",
                left: $cell.offset().left + $cell.width() + "px",
                top: $cell.offset().top - $table.height() + "px"
            });
            $table.attr("id", "info");
        }, function () {
            $("#info").remove();
        }).click(function() {
            var $info = $("#info");
            if ($info.size() == 0) return;
            var $info_clone = $info.clone();
            $info_clone.removeAttr("id");
            $info.remove();
            var $res = $("#res");
            if ($res.size()) {
                $res.before($info_clone);
            } else {
                $info_clone.appendTo($target);
            }

            $("*", document).removeClass("selected_cell");
            $(this).addClass("selected_cell");
            $info_clone.css({position: "static"});
            var offset = $info_clone.offset();
            $info_clone.css({position: "absolute"});
            $info_clone.animate({left: offset.left, top: offset.top}, function () {
                $info_clone.remove();
                var $next = getNextTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap).appendTo($target);
                $("#res").remove();
                $next.attr("id", "res");
            });
        });
    }

    serverQuery(query.name, query.params, function(response) {
        var content = $.parseJSON(response);
        content["date"] = [];
        for (i = 0; i < content[dateProperty].length; i++) {
            var time = content[dateProperty][i];
            content["date"].push(time.substr(0, 10));
            content[dateProperty][i] = time.substr(11);
        }
        content = arraysToObjects(content);
        var dates = Object();
        var i, j;
        for (i = 0; i < content.length; i++) {
            dates[content[i]["date"]] = true;
        }
        dates = allProperties(dates).sort();
        content = groupObjectsByProperty(content, groupProperty);
        var row_keys = allProperties(content).sort();
        for (i in content) {
            content[i] = groupObjectsByProperty(content[i], "date");
        }
        $target.children().remove();
        var tableContent = [];
        for (i = 0; i < row_keys.length; i++) {
            tableContent[i] = [];
            for (j = 0; j < dates.length; j++) {
                if (content[row_keys[i]][dates[j]] == undefined) {
                    tableContent[i][j] = "";
                } else {
                    tableContent[i][j] = content[row_keys[i]][dates[j]].length;
                }
            }
        }
        var dateDivs = [];
        for (i = 0; i < dates.length; i++) {
            dateDivs[i] = dateToDiv(dates[i]);
        }
        var tableData = scrollableTable({
            target: $target,
            classes: ["auto_margin", "progress_table"],
            contentHeight: 300,
            contentWidth: 500,
            columnHeaders: dateDivs,
            rowHeaders: row_keys,
            content: tableContent,
            cornerElement: option["cornerElement"]
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
//
// result.table - table
// result.rowOutDivs,
// result.colOutDivs,
// result.cellOutDivs - divs with strict sizes
// result.rowDivs,
// result.colDivs,
// result.cellDivs - divs in strict divs, can be smaller
function scrollableTable(option) {
    function getScrollLineWidth() {
        var $div = $("<div/>").css({
            overflow: "scroll",
            width: "50px",
            height: "50px",
            position: "absolute",
            visibility: "hidden"
        }).appendTo($("body"));
        var res = $div.get(0).offsetWidth - $div.get(0).clientWidth;
        $div.remove();
        return res;
    }
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
        cornerOut: null,
        rowDivs: [],
        colDivs: [],
        cellDivs: [],
        corner: null
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
    for (i = 0; i < classes.length; i++) {
        $table.addClass(classes[i]);
    }

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
    var $csvDiv = $("<div/>").appendTo($skel[2][1].css({verticalAlign: "top"}));
    var $cornerDiv = $("<div/>").appendTo($corner);
    $cornerDiv.addClass("corner_div");
    result.cornerOut = $corner;
    result.corner = $cornerDiv;
    if ($cornerElement != undefined) $cornerElement.appendTo($cornerDiv);

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
            $inDiv.text("col#"+i);
        }
        result.colOutDivs.push($div);
        result.colDivs.push($inDiv);
        $colHeader[i] = $td;
    }

    // csv save
    $csvDiv.addClass("csv-div");
    var $csvButtonDiv = $("<div/>").appendTo($csvDiv);
    $csvButtonDiv.attr({title: "Сохранить таблицу в формате .csv"});
    var $csvForm = $("<form/>").appendTo($csvDiv);
    $csvForm.attr({
        action: "download_csv.php",
        method: "post",
        acceptCharset: "utf-8"
    });
    var $hidden = $("<input/>").appendTo($csvForm);
    $hidden.attr({
        type: "hidden",
        name: "table"
    });
    $csvButtonDiv.click(function() {
        var data = [[$corner.text()]];
        var i, j;

        for (i = 0; i < $colHeader.length; i++) {
            data[0].push($colHeader[i].text());
        }
        for (i = 0; i < $rowHeader.length; i++) {
            data.push([$rowHeader[i].text()]);
            for (j = 0; j < $colHeader.length; j++) {
                data[i + 1].push($cell[i][j].text());
            }
        }
        $hidden.val(JSON.stringify({table: data}));
        $csvForm[0].submit();
    });

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

    // mouse over row
    for (i = 0; i < $rowHeader.length; i++) {
        lightRow(i, farColor);
        $rowHeader[i].hover(function() {
            lightRow($(this).data("row_index"), nearColor);
        }, function() {
            lightRow($(this).data("row_index"), farColor);
        });
    }
    // mouse over column
    for (i = 0; i < $colHeader.length; i++) {
        lightCol(i, farColor);
        $colHeader[i].hover(function() {
            lightCol($(this).data("col_index"), nearColor);
        }, function() {
            lightCol($(this).data("col_index"), farColor);
        });
    }
    // mouse over cell
    for (i = 0; i < $rowHeader.length; i++) {
        for (j = 0; j < $colHeader.length; j++) {
            $cell[i][j].hover(function() {
                lightRow($(this).data("row_index"), nearColor);
                lightCol($(this).data("col_index"), nearColor);
                $(this).css({backgroundColor: belowColor});
            }, function() {
                lightRow($(this).data("row_index"), farColor);
                lightCol($(this).data("col_index"), farColor);
            });
        }
    }

    // correct row heights
    for (i = 0; i < $rowHeader.length; i++) {
        var maxHeight = $rowHeader[i].children().outerHeight();
        for (j = 0; j < $colHeader.length; j++) {
            maxHeight = Math.max(maxHeight, $cell[i][j].children().outerHeight());
        }
        $rowHeader[i].children().outerHeight(maxHeight);
        for (j = 0; j < $colHeader.length; j++) {
            $cell[i][j].children().outerHeight(maxHeight);
        }
    }

    // correct column width
    for (i = 0; i < $colHeader.length; i++) {
        var maxWidth = $colHeader[i].children().outerWidth();
        for (j = 0; j < $rowHeader.length; j++) {
            maxWidth = Math.max(maxWidth, $cell[j][i].children().outerWidth());
        }
        $colHeader[i].children().outerWidth(maxWidth);
        for (j = 0; j < $rowHeader.length; j++) {
            $cell[j][i].children().outerWidth(maxWidth);
        }
    }

    // correct left header
    maxWidth = $corner.width();
    for (i = 0; i < $rowHeader.length; i++) {
        maxWidth = Math.max(maxWidth, $rowHeader[i].children().outerWidth());
    }
    $corner.width(maxWidth);
    for (i = 0; i < $rowHeader.length; i++) {
        $rowHeader[i].children().outerWidth(maxWidth);
    }

    // correct top header
    maxHeight = $corner.height();
    for (i = 0; i < $colHeader.length; i++) {
        maxHeight = Math.max(maxHeight, $colHeader[i].children().outerHeight());
    }
    $corner.height(maxHeight);
    for (i = 0; i < $colHeader.length; i++) {
        $colHeader[i].children().outerHeight(maxHeight);
    }

    // correct content sizes
    maxHeight = $contentTable.outerHeight();
    maxHeight = Math.min(maxHeight, contentHeight);
    $verticalSlider.outerHeight(maxHeight);
    $leftHeaders.outerHeight(maxHeight);
    $content.outerHeight(maxHeight);

    maxWidth = $contentTable.outerWidth();
    maxWidth = Math.min(maxWidth, contentWidth);
    $horizontalSlider.outerWidth(maxWidth);
    $topHeaders.outerWidth(maxWidth);
    $content.outerWidth(maxWidth);

    // set sliders
    $table.data("content", $content);
    $table.data("leftHeader", $leftHeaders);
    $table.data("topHeader", $topHeaders);

    var $forVerticalSlider =
        $("<div/>").width(1).height($content.get(0).scrollHeight).appendTo($verticalSlider);
    $verticalSlider.scroll(function() {
        $table.data("content").scrollTop($(this).scrollTop());
        $table.data("leftHeader").scrollTop($(this).scrollTop());
    });
    $verticalSlider.css({overflowY: "scroll"});

    $("<div/>").height(1).width($content.get(0).scrollWidth).appendTo($horizontalSlider);
    $horizontalSlider.scroll(function() {
        $table.data("content").scrollLeft($(this).scrollLeft());
        $table.data("topHeader").scrollLeft($(this).scrollLeft());
    });
    $horizontalSlider.css({overflowX: "scroll"});

    // for mobile browsers
    if (getScrollLineWidth() === 0) {
        var $info = $("<div/>").text("* не отпускайте палец при прокрутке")
            .css({color: "grey", textAlign: "center", fontSize: "0.7em"});
        $table.after($info);
        $forVerticalSlider.width(1);
        $([$content[0], $leftHeaders[0], $topHeaders[0]]).css({overflow: "scroll"});
        $([$leftHeaders[0], $content[0]]).scroll(function() {
            $([
                $table.data("leftHeader")[0],
                $table.data("content")[0]
            ]).scrollTop($(this).scrollTop());
        });
        $([$topHeaders[0], $content[0]]).scroll(function() {
            $([
                $table.data("topHeader")[0],
                $table.data("content")[0]
            ]).scrollLeft($(this).scrollLeft());
        });
    }

    return result;
}