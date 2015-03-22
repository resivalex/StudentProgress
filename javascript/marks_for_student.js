
$(document).ready(onMarksForStudentLoad);

function onMarksForStudentLoad() {
    function loadMarks() {
        $("#marks_table").children().remove();
        var query = {
            name: "student marks",
            params: {
                student_id: $("#student_id").val()
            }
        };
        gridDateTable({
            targetId: "marks_table",
            query: query,
            groupProperty: "subject_name",
            dateProperty: "time",
            infoHeaderNamesMap: {
                "teacher_name": "Преподаватель",
                "time": "Время",
                "short_name": "Отметка",
                "comment": "Комментарий"
            }
        });
    }

    function loadStudents(group_id) {
        $("#select_student").children().remove();
        $("#marks_table").children().remove();
        var params = {
            group_id: $("#group_id").val()
        };
        serverQuery("students from group", params, function(response) {
            var $select_student = $("#select_student");
            $select_student.children().remove();
            var select_student = slidedSelectTool("Студенты", "student_id", $.parseJSON(response));
            $select_student.append(select_student);
            $("#student_id").selectmenu({change: loadMarks}).ready(loadMarks);
        });
    }

    $(document).ready(function () {
        serverQuery("non-empty groups", function (response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
            $("#group_id").selectmenu({change: loadStudents}).ready(loadStudents);
        });
    });
}
