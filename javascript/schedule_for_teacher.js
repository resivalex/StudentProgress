
$(document).ready(onScheduleForTeacherLoad);

function onScheduleForTeacherLoad() {
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
        gridDateTable({
            targetId: "schedule_table",
            query: query,
            groupProperty: "subject_name",
            dateProperty: "lesson_time",
            infoHeaderNames: ["Группа", "Аудитория", "Время"]
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
