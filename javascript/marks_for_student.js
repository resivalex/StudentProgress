
$(document).ready(onMarksForStudentLoad);

function onMarksForStudentLoad() {
    function loadMarks() {
        $("#marks_table").children().remove();
        var query = [
            "SELECT subjects.name AS subject_name, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS teacher_name, mark_history.time, " +
            "mark_types.short_name, mark_history.comment FROM mark_history " +
            "JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) " +
            "AS last_marks ON mark_history.id = last_marks.id " +
            "JOIN mark_types ON mark_history.mark_type_id = mark_types.id " +
            "JOIN marks ON mark_history.mark_id = marks.id " +
            "JOIN students ON marks.student_id = students.id " +
            "JOIN lessons ON marks.lesson_id = lessons.id " +
            "JOIN subjects ON lessons.subject_id = subjects.id " +
            "JOIN teachers ON lessons.teacher_id = teachers.id " +
            "JOIN users ON teachers.id = users.id " +
            "WHERE students.id = ? " +
            "ORDER BY mark_history.time",
            $("#student_id").val()
        ];
        gridDateTable({
            targetId: "marks_table",
            query: query,
            groupProperty: "subject_name",
            dateProperty: "time",
            infoHeaderNames: ["Преподаватель", "Время", "Отметка", "Комментарий"]
        });
        //sqlQuery(query, function(response) {
        //    var $marks_talbe = $("#marks_table");
        //    $marks_talbe.children().remove();
        //    var data = arraysToObjects($.parseJSON(response));
        //    data.sort(function(a, b) {a = a.time; b = b.time; return (a < b? -1 : (a > b? +1 : 0));});
        //    var tab = Object();
        //    var subject_names = Object(), times = Object();
        //    for (i = 0; i < data.length; i++) {
        //        data[i].time = data[i].time.substring(0, 10);
        //        subject_names[data[i].subject_name] = true;
        //        times[data[i].time] = true;
        //        if (tab[data[i].subject_name] == undefined) tab[data[i].subject_name] = Object();
        //        if (tab[data[i].subject_name][data[i].time] != undefined) {
        //            tab[data[i].subject_name][data[i].time] += ", "+data[i].short_name;
        //        } else {
        //            tab[data[i].subject_name][data[i].time] = data[i].short_name;
        //        }
        //    }
        //    var beauty = document.createElement("table");
        //    var subject_array = [];
        //    for (i in subject_names) {
        //        subject_array.push(i);
        //    }
        //    var time_array = [];
        //    for (i in times) {
        //        time_array.push(i);
        //    }
        //    subject_array.sort();
        //    time_array.sort();
        //    var tr = document.createElement("tr");
        //    var td = document.createElement("td");
        //    tr.appendChild(td);
        //    for (i = 0; i < time_array.length; i++) {
        //        td = document.createElement("td");
        //        td.appendChild(dateToDiv(time_array[i]).get(0));
        //        tr.appendChild(td);
        //    }
        //    beauty.appendChild(tr);
        //    for (i = 0; i < subject_array.length; i++) {
        //        tr = document.createElement("tr");
        //        td = document.createElement("td");
        //        td.innerHTML = subject_array[i];
        //        tr.appendChild(td);
        //        for (j = 0; j < time_array.length; j++) {
        //            td = document.createElement("td");
        //            td.innerHTML = (tab[subject_array[i]][time_array[j]] == undefined? "-" : tab[subject_array[i]][time_array[j]]);
        //            tr.appendChild(td);
        //        }
        //        beauty.appendChild(tr);
        //    }
        //    var table = sortableTable($.parseJSON(response));
        //    table = beauty;  //debug
        //    table.className = "custom_table";
        //    //var ths = $("input[type='button']", table).get();
        //    //var titles = ["Предмет", "Преподаватель", "Дата", "Отметка", "Комментарий"];
        //    //for (var i = 0; i < titles.length; i++) {
        //    //    ths[i].value = titles[i];
        //    //}
        //    $marks_talbe.append(table);
        //});
    }

    function loadStudents(group_id) {
        $("#select_student").children().remove();
        $("#marks_table").children().remove();
        var query = [
            "SELECT students.id AS id, concat(users.surname, ' ', users.name, ' ', users.patronymic) AS name FROM students " +
            "JOIN users ON students.id = users.id " +
            "JOIN groups ON students.group_id = groups.id " +
            "WHERE groups.id = ? ORDER BY name",
            $("#group_id").val()
        ];
        sqlQuery(query, function(response) {
            var $select_student = $("#select_student");
            $select_student.children().remove();
            var select_student = slidedSelectTool("Студенты", "student_id", $.parseJSON(response));
            $select_student.append(select_student);
            $("#student_id").selectmenu({change: loadMarks}).ready(loadMarks);
        });
    }

    $(document).ready(function () {
        var query =
            "SELECT DISTINCT groups.id, groups.name FROM groups " +
            "JOIN students ON (groups.id = students.group_id) " +
            "ORDER BY groups.name";
        sqlQuery(query, function (response) {
            $("#select_group").append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
            $("#group_id").selectmenu({change: loadStudents}).ready(loadStudents);
        });
    });
}
