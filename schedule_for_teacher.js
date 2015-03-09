
$(document).ready(onScheduleForTeacherLoad);

function onScheduleForTeacherLoad() {
    function newView() {
        var content = $("#schedule_table").data("content");
        content["date"] = [];
        for (i = 0; i < content["lesson_time"].length; i++) {
            var time = content["lesson_time"][i];
            content["date"].push(time.substr(0, 10));
            content["lesson_time"][i] = time.substr(11);
        }
        content = arraysToObjects(content);
        var dates = Object();
        for (i = 0; i < content.length; i++) {
            dates[content[i]["date"]] = true;
        }
        dates = allProperties(dates).sort();
        content = groupObjectsByProperty(content, "subject_name");
        var subjects = allProperties(content).sort();
        for (var i in content) {
            content[i] = groupObjectsByProperty(content[i], "date");
        }
        var $table = $("<table/>").addClass("custom_table");
        var $tr = $("<tr><td/></tr>").appendTo($table);
        for (i = 0; i < dates.length; i++) {
            $td = $("<td/>").append($("<label/>").text(dates[i]))
                .css("width", "10px").appendTo($tr);
        }
        for (i = 0; i < subjects.length; i++) {
            var subject = subjects[i];
            $tr = $("<tr/>").appendTo($table);
            $("<td/>").text(subject).appendTo($tr);
            for (j = 0; j < dates.length; j++) {
                var date = dates[j];
                var $td = $("<td/>").appendTo($tr);
                if (content[subject][date] != undefined) {
                    var info = content[subject][date];
                    $td.text(info.length).data("content", info).hover(function () {
                        $("#info").remove();
                        var $info = $(getTable(objectsToArrays($(this).data("content")), true)).addClass("custom_table")
                            .css("position", "absolute").attr("id", "info").appendTo($("#schedule_table"));
                        $info.css({left: $(this).offset().left + $(this).width(), top: $(this).offset().top + $(this).height()});
                    }, function () {
                        $("#info").remove();
                    });
                }
            }
        }
        return $table;
    }

    function loadSchedule() {
        $("#schedule_table").children().remove();
        var query = [
            "SELECT subjects.name AS subject_name, groups.name AS group_name, " +
            "auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons " +
            "JOIN subjects ON (lessons.subject_id = subjects.id) " +
            "JOIN groups ON (lessons.group_id = groups.id) " +
            "JOIN auditories ON (lessons.auditory_id = auditories.id) " +
            "WHERE teacher_id = ? ",
            $("#teacher_id").val()
        ];
        sqlQuery(query, function(response) {
            var $shedule_table = $("#schedule_table");
            $shedule_table.children().remove();
            $shedule_table.data("content", $.parseJSON(response));
            var table = sortableTable($.parseJSON(response));
            table.className = "custom_table";
            var ths = $("input[type='button']", table).get();
            var titles = ["Дисциплина", "Группа", "Аудитория", "Время"];
            for (var i = 0; i < 4; i++) {
                ths[i].value = titles[i];
            }
            $shedule_table.append(table);
            $shedule_table.append(newView());
        });
    }

    $(document).ready(function () {
        var query =
            "SELECT DISTINCT teachers.id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name " +
            "FROM teachers " +
            "JOIN users ON teachers.id = users.id " +
            "JOIN lessons ON teachers.id = lessons.teacher_id " +
            "ORDER BY name";
        sqlQuery(query, function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", $.parseJSON(response)));
            $("#teacher_id").selectmenu({change: loadSchedule}).ready(loadSchedule);
        });
    });
}
