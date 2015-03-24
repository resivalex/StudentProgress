
$(document).ready(onScheduleForTeacherLoad);

function onScheduleForTeacherLoad() {
    function loadSchedule() {
        $("#schedule_table").children().remove();
        var query = {
            name: "lessons by teacher",
            params: {
                teacher_id: $("#teacher_id").val()
            }
        };
        gridDateTable({
            targetId: "schedule_subtable",
            query: query,
            groupProperty: "subject_name",
            dateProperty: "lesson_time",
            infoHeaderNamesMap: {
                "group_name": "Группа",
                "auditory_name": "Аудитория",
                "lesson_time": "Время"
            }
        });
    }

    $(document).ready(function () {
        serverQuery("involved teachers", function(response) {
            $("#select_teacher").append(slidedSelectTool("Преподаватель", "teacher_id", response));
            $("#teacher_id").selectmenu({change: loadSchedule}).ready(loadSchedule);
        });
    });
}
