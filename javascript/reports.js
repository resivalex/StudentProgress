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
    $("#make_report").click(function() {
        var i, j;
        var idMap = {
            "group": "groups",
            "subject": "subjects",
            "teacher": "teachers",
            "auditory": "auditories"
        };
        //var sets = ["course", "group", "subject", "teacher", "auditory"];
        var conditions = " TRUE";
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
        ids = filterIds["course"];
        if (ids[0] !== 0) {
            var localConditions = " AND (FALSE";
            for (i = 0; i < ids.length; i++) {
                localConditions += " OR groups.course = " + ids[i];
            }
            localConditions += ")";
            conditions += localConditions;
        }
        for (i = 0; i < sets.length; i++) {
            if (idMap[sets[i]] === undefined) continue;
            ids = filterIds[sets[i]];
            var tableName = idMap[sets[i]];
            localConditions = " AND (FALSE";
            for (j = 0; j < ids.length; j++) {
                var val = ids[j]? ids[j] : tableName + ".id";
                localConditions += " OR " + tableName + ".id = " + val;
            }
            localConditions += ")";
            conditions += localConditions;
        }

        var text =
            "SELECT concat(users.surname, ' ', users.name, ' ', users.patronymic) AS student_name " +
            "FROM " +
            "(SELECT DISTINCT students.id AS id " +
            "FROM students " +
            "JOIN groups ON students.group_id = groups.id " +
            "JOIN lessons ON groups.id = lessons.group_id " +
            "JOIN teachers ON lessons.teacher_id = teachers.id " +
            "JOIN subjects ON lessons.subject_id = subjects.id " +
            "JOIN auditories ON lessons.auditory_id = auditories.id " +
            "WHERE" + conditions +
            ") AS student_ids " +
            "JOIN users ON student_ids.id = users.id ";
        sqlQuery(text, function(response) {
            response = $.parseJSON(response);
            response = toIndexArray(response);
            response = rotable2DArray(response);
            $("#content").children().remove();
            if (response.length !== 0) {
                scrollableTable({
                    target: $("#content"),
                    content: response,
                    classes: ["auto_margin", "progress_table", "top_padding"]
                });
            } else {
                $("<p style=\"text-align: center\">Ни одного студента</p>").appendTo("#content");
            }
        });
    });
}

