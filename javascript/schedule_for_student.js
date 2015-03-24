
$(document).ready(onScheduleForStudentLoad);

function onScheduleForStudentLoad() {
    function loadSchedule() {
        $("#schedule_table").children().remove();
        var query = {
            name: "lessons by group",
            params: {
                group_id: $("#group_id").val()
            }
        };
        gridDateTable({
            targetId: "schedule_subtable",
            query: query,
            groupProperty: "subject_name",
            dateProperty: "lesson_time",
            infoHeaderNamesMap: {
                "teacher_name": "Преподаватель",
                "auditory_name": "Аудитория",
                "lesson_time": "Время"
            }
        });
    }

    $(document).ready(function () {
        var query =

        serverQuery("involved groups", function (response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", response));
            $("#group_id").selectmenu({change: loadSchedule}).ready(loadSchedule);
        })
    });
}
