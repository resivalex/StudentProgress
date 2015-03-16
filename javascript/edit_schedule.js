
$(document).ready(function() {
    function simpleProgressionSelect(from, to, step) {
        var $select = $("<select/>");
        for (from; from <= to; from += step) {
            $("<option/>").text(from).val(from).appendTo($select);
        }
        return $select.css("width", "100px");
    }

    function loadSchedule() {
        query =
            "SELECT groups.name AS group_name, subjects.name AS subject_name, " +
            "auditories.name AS auditory_name, users.surname AS user_name, time, lessons.id AS id " +
            "FROM lessons " +
            "JOIN groups ON (group_id = groups.id) " +
            "JOIN subjects ON (subject_id = subjects.id) " +
            "JOIN auditories ON (auditory_id = auditories.id) " +
            "JOIN users ON (teacher_id = users.id) " +
            "ORDER BY time";
        function getTipTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap) {
            var info = content[row_key][date];
            if (info === undefined) return undefined;
            info = objectsToArrays(info);
            for (var i in info) {
                info[i].unshift(infoHeaderNamesMap[i]? infoHeaderNamesMap[i] : i);
            }
            info = rotable2DArray(toIndexArray(info));
            var result = devidedTable(info);
            for (i = 0; i < result.td[0].length; i++) {
                result.td[0][i].css({fontWeight: "bold"});
            }
            for (i = 0; i < result.td.length; i++) {
                result.td[i][4].remove();
            }
            result.table.addClass("tip_table");

            return result.table;
        }
        function getNextTable($cell, $for_text, content, row_key, date, infoHeaderNamesMap) {
            var info = content[row_key][date];
            if (info === undefined) return undefined;
            info = objectsToArrays(info);
            for (var i in info) {
                info[i].unshift(infoHeaderNamesMap[i]? infoHeaderNamesMap[i] : i);
            }
            info = rotable2DArray(toIndexArray(info));
            var result = devidedTable(info);
            for (i = 0; i < result.td[0].length; i++) {
                result.td[0][i].css({fontWeight: "bold"});
            }
            result.td[0][4].text("");
            for (i = 1; i < result.td.length; i++) {
                var $td = result.td[i][4];
                var lessonId = $td.text();
                $td.text("");
                var $button = $("<button/>").text("Удалить").appendTo($td);
                $button.click(function() {
                    var text =
                        "DELETE FROM lessons WHERE lessons.id = ?";
                    sqlQuery([text, lessonId], function(response) {
                        if ($.parseJSON(response) === true) {
                            showMessage("Удалено");
                            $("#schedule").children().remove();
                            loadSchedule();
                        } else {
                            showMessage("Неудача");
                        }
                    });
                });
            }
            result.table.addClass("custom_table");
            var $tr = $("<tr/>").prependTo(result.table);
            var $info_title = $("<td/>").text(row_key + " " + date).appendTo($tr);
            $info_title.attr("colspan", allProperties(info[0]).length);
            $info_title.css({textAlign: "center", fontWeight: "bold"});

            return result.table;
        }
        gridDateTable({
            targetId: "schedule",
            query: query,
            groupProperty: "group_name",
            dateProperty: "time",
            infoHeaderNamesMap: {
                "subject_name": "Дисциплина",
                "auditory_name": "Аудитория",
                "user_name": "Преподаватель",
                "time": "Время",
                "id": "ID"
            },
            getTipTable: getTipTable,
            getNextTable: getNextTable
        });
    }

    var query =
        "SELECT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) " +
        "FROM teachers JOIN users ON (teachers.id = users.id) ORDER BY surname";
    sqlQuery(query, function(response) {
        $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
        $("#teacher_id").selectmenu();
    });
    query = "SELECT id, name FROM subjects ORDER BY name";
    sqlQuery(query, function(response) {
        $("#select_subject").append(slidedSelectTool("Дисциплина", "subject_id", $.parseJSON(response)));
        $("#subject_id").selectmenu();
    });
    query = "SELECT id, name FROM groups ORDER BY name";
    sqlQuery(query, function(response) {
        $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
        $("#group_id").selectmenu();
    });
    query = "SELECT id, name FROM auditories ORDER BY name";
    sqlQuery(query, function(response) {
        $("#select_auditory").append(slidedSelectTool("Аудитория", "auditory_id", $.parseJSON(response)));
        $("#auditory_id").selectmenu();
    });
    $("#day_select_tool").datepicker({
        dateFormat: "d MM yy",
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        firstDay: 1
    }).datepicker("setDate", new Date());
    var $select_hour = simpleProgressionSelect(7, 18, 1);
    $("#select_hour").append($select_hour);
    $select_hour.selectmenu().selectmenu("menuWidget").css("height", "150px");
    var $select_minute = simpleProgressionSelect(0, 55, 5);
    $("#select_minute").append($select_minute);
    $select_minute.selectmenu().selectmenu("menuWidget").css("height", "150px");

    loadSchedule();
    //loadRemovableTable('lessons', 'schedule', query);

    $("#add_lesson").button().click(function() {
        var group_id = $("#group_id").val();
        var subject_id = $("#subject_id").val();
        var auditory_id = $("#auditory_id").val();
        var teacher_id = $("#teacher_id").val();
        var month = $("#month").val();
        var hour = $("#select_hour select").val();
        var minute = $("#select_minute select").val();
        var date = $("#day_select_tool").datepicker("getDate");
        var datetime = "".concat(date.getFullYear(), "-", date.getMonth() + 1, "-", date.getDate(), " ", hour, ":", minute, ":00");
        var text =
            "INSERT INTO lessons " +
            "(group_id, subject_id, auditory_id, teacher_id, time) " +
            "VALUES (?, ?, ?, ?, ?)";
        sqlQuery([text, group_id, subject_id, auditory_id, teacher_id, datetime], function(response) {
            if ($.parseJSON(response) === false) {
                showJSON(query, "Неудача");
            } else {
                showMessage("Добавлено");
                loadSchedule();
            }
        });
    });
});
