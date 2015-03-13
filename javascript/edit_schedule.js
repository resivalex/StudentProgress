
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
            "ORDER BY lessons.id";
        gridDateTable({
            targetId: "schedule",
            query: query,
            groupProperty: "group_name",
            dateProperty: "time",
            infoHeaderNames: ["Дисциплина", "Аудитория", "Преподаватель", "Время", "ID"]
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

$(document).ready(function() {
    var kasha = [];
    for (i = 0; i < 25; i++) {
        kasha[i] = [];
        for (j = 0; j < 25; j++) {
            kasha[i][j] = "+";
        }
    }
    var h = [];
    for (i = 10; i <= 25; i++) {
        h.push(dateToDiv("2015-02-"+i));
    }
    scrollableTable({
        target: $("#test"),
        content: kasha,
        columnHeaders: h
    });
    $("#test").children().addClass("auto_margin");
});
