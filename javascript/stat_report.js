$(document).ready(makeBeauty);

function makeBeauty() {
    function makeButtonset(id) {
        var $el = $("#"+id);
        var $first = $("input[type=checkbox]:first", $el);
        $first.attr("checked", true);
        $first.on("change", function(event) {
            if (!this.checked) {
                this.checked = true;
                return;
            }
            $("input[type=checkbox]:gt(0)", $el).attr("checked", false);
            $el.buttonset("refresh");
        });
        $el.on("change", "input[type=checkbox]:gt(0)", function() {
            if (!this.checked) return;
            $first.attr("checked", false);
            $el.buttonset("refresh");
        });
        $el.buttonset();
    }
    var sets = ["group", "report_type", "subject", "teacher", "auditory"];
    for (var i = 0; i < sets.length; i++) {
        makeButtonset(sets[i]);
    }
    // mutual date excluding
    $( "#from" ).datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 3,
        onClose: function( selectedDate ) {
            $( "#to" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#to" ).datepicker({
        changeMonth: true,
        numberOfMonths: 3,
        onClose: function( selectedDate ) {
            $( "#from" ).datepicker( "option", "maxDate", selectedDate );
        }
    });
    // calendar format
    $("#from,#to").attr("readonly", true)
        .datepicker("option", "dateFormat", "d MM yy")
        .datepicker("option", "dayNamesMin", ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"])
        .datepicker("option", "monthNames", ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"])
        .datepicker("option", "firstDay", 1);
    $("#clear_dates").click(function() {
        $("#from,#to").datepicker("setDate", null)
            .datepicker("option", "minDate", null)
            .datepicker("option", "maxDate", null);
    });

    // report creation
    $("#make_report").click(function() {
        var i, j;
        // id to tablename
        var idMap = {
            "group": "groups",
            "subject": "subjects",
            "teacher": "teachers",
            "auditory": "auditories"
        };
        // get checked buttons
        var filterIds = {};
        for (i = 0; i < sets.length; i++) {
            filterIds[sets[i]] = [];
            var ids = filterIds[sets[i]];
            $("#"+sets[i]+" input[type=checkbox]:checked").each(function() {
                ids.push($(this).attr("id"));
            });
            for (j = 0; j < ids.length; j++) {
                ids[j] = parseInt(/.+_(.+)/.exec(ids[j])[1]);
            }
        }
        // date interval conditions
        function dateToMySQLFormat(date) {
            return ""+date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDay();
        }
        var from = $("#from").datepicker("getDate");
        var to = $("#to").datepicker("getDate");
        if (from !== null) {
            filterIds["from"] = dateToMySQLFormat(from);
        }
        if (to !== null) {
            to.setDate(to.getDate() + 1);
            filterIds["to"] = dateToMySQLFormat(to);
        }
        var queries = ["average statistics", "absent statistics"];
        serverQuery(queries[filterIds["report_type"][0]], filterIds, function(response) {
            function getStudentsString(num) {
                var res = num + " ";
                if (res % 100 > 10 && res % 100 < 20) {
                    res += "студентов";
                } else if (res % 10 == 1) {
                    res += "студент";
                } else if (res % 10 >= 2 && res % 10 <= 4) {
                    res += "студента";
                } else {
                    res += "студентов";
                }
                return res;
            }
            response = toIndexArray(response);
            var rowHeaders = $.extend(true, [], response[0]);
            var cornerElement = $("<div/>").text(getStudentsString(rowHeaders.length));
            var columnHeaders = ["Группа", "Курс"];
            response.shift();
            var content = rotable2DArray(response);
            $("#content").children().remove();
            if (content.length !== 0) {
                scrollableTable({
                    target: $("#content"),
                    content: content,
                    rowHeaders: rowHeaders,
                    columnHeaders: columnHeaders,
                    classes: ["auto_margin", "progress_table", "top_padding"],
                    cornerElement: cornerElement
                });
            } else {
                $("<p style=\"text-align: center\">Ни одного студента</p>").appendTo("#content");
            }
        });
    });
}
