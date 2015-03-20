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
    $("#course").on("change", "input[type=checkbox]:gt(0)", function() {
        $("#group input[type=checkbox]:first").prop("checked", true);
        $("#group input[type=checkbox]:gt(0)").attr("checked", false);
        $("#group").buttonset("refresh");
    });
    $("#group").on("change", "input[type=checkbox]:gt(0)", function() {
        $("#course input[type=checkbox]:first").prop("checked", true);
        $("#course input[type=checkbox]:gt(0)").attr("checked", false);
        $("#course").buttonset("refresh");
    });
    var sets = ["course", "group", "subject", "teacher", "auditory"];
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

    $("#is,#was").selectmenu();
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
        // construct SQL condition
        var query = ["Will be replaced below"];
        var conditions = " TRUE";
        // course
        ids = filterIds["course"];
        if (ids[0] !== 0) {
            var localConditions = " AND (";
            for (i = 0; i < ids.length; i++) {
                if (i != 0) localConditions += " OR";
                localConditions += " groups.course = ?";
                query.push(ids[i]);
            }
            localConditions += ")";
            conditions += localConditions;
        }
        // other checkboxes
        for (i = 0; i < sets.length; i++) {
            if (idMap[sets[i]] === undefined) continue;
            ids = filterIds[sets[i]];
            var tableName = idMap[sets[i]];
            if (ids[0] !== 0) {
                localConditions = " AND (";
                for (j = 0; j < ids.length; j++) {
                    if (j != 0) localConditions += " OR";
                    localConditions += " " + tableName + ".id = ?";
                    query.push(ids[j]);
                }
                localConditions += ")";
                conditions += localConditions;
            }
        }
        // mark conditions
        var studentMustHaveMark = false;
        var mark_type_id;
        mark_type_id = parseInt($("#was").val());
        if (mark_type_id !== 0) {
            studentMustHaveMark = true;
            conditions += " AND mark_types.id = ?";
            query.push(mark_type_id);
        }
        mark_type_id = parseInt($("#is").val());
        if (mark_type_id !== 0) {
            studentMustHaveMark = true;
            conditions += " AND students.id IN " +
                "(SELECT students.id FROM students " +
                "JOIN marks ON students.id = marks.student_id " +
                "JOIN (SELECT * FROM (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_ids " +
                "       JOIN mark_history USING(id)) AS last_marks " +
                "   ON marks.id = last_marks.mark_id " +
                "WHERE last_marks.mark_type_id = ?)";
            query.push(mark_type_id);
        }
        // date interval conditions
        function dateToMySQLFormat(date) {
            return ""+date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDay();
        }
        var from = $("#from").datepicker("getDate");
        var to = $("#to").datepicker("getDate");
        if (from !== null) {
            conditions += " AND lessons.time >= ?";
            query.push(dateToMySQLFormat(from));
        }
        if (to !== null) {
            to.setDate(to.getDate() + 1);
            conditions += " AND lessons.time < ?";
            query.push(dateToMySQLFormat(to));
        }

        query[0] =
            "SELECT concat(users.surname, ' ', users.name, ' ', users.patronymic) AS student_name, " +
            "   groups.name AS group_name, groups.course AS course " +
            "FROM " +
            "(SELECT DISTINCT students.id AS id " +
            "FROM students " +
            "JOIN groups ON students.group_id = groups.id " +
            "JOIN lessons ON groups.id = lessons.group_id " +
            "JOIN teachers ON lessons.teacher_id = teachers.id " +
            "JOIN subjects ON lessons.subject_id = subjects.id " +
            "JOIN auditories ON lessons.auditory_id = auditories.id " +
            (studentMustHaveMark?
                "JOIN marks ON students.id = marks.student_id " +
                "JOIN mark_history ON marks.id = mark_history.mark_id " +
                "JOIN mark_types ON mark_history.mark_type_id = mark_types.id " : "") +
            "WHERE" + conditions +
            ") AS student_ids " +
            "JOIN users ON student_ids.id = users.id " +
            "JOIN students ON student_ids.id = students.id " +
            "JOIN groups ON students.group_id = groups.id " +
            "ORDER BY course, group_name, student_name";
        sqlQuery(query, function(response) {
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
            response = $.parseJSON(response);
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

