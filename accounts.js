
$(document).ready(function () {
    var query = "SELECT id, name FROM groups ORDER BY name";
    sqlQuery(query, function(response) {
        var $table = $("#student + div table");
        $table.append("<tr><td colspan='2'/></tr>");
        response = $.parseJSON(response);
        var $select = $("<select/>").attr("id", "group_id").css("width", "100%");
        for (i = 0; i < response.id.length; i++) {
            $("<option/>").text(response.name[i]).val(response.id[i]).appendTo($select);
        }
        $select.appendTo($("td:last", $table)).selectmenu().selectmenu("menuWidget").css("height", "150px");
        //$("td:last", $table).append(slidedSelectTool("Группа", "group_id", $.parseJSON(response)));
    });
    $(".ajax_div").each(function () {
        var role = $(this).attr("id");
        var query = [
            "SELECT surname, users.name AS name, patronymic, login, password, email, phone, users.id AS id " +
            "FROM users " +
            "JOIN roles ON users.role_id = roles.id " +
            "WHERE roles.name = ?",
            role
        ];
        loadRemovableTable("users", role, query, getDeleteQueryForUser);
    });
    $(".add_button").click(function () {
        addToUsers($(this).attr("id").substr("button_for_".length));
    });
});

function addToUsers(role_name) {
    var block = $("." + role_name);
    var tab = {student: "students", teacher: "teachers", chief: "chiefs"};
    var query = [
        "INSERT INTO users " +
        "(name, surname, patronymic, login, password, role_id, email, phone) " +
        "VALUES (?, ?, ?, ?, ?, (SELECT id FROM roles WHERE name = ?), ?, ?)",

        $("input[name='name']", block).val(),
        $("input[name='surname']", block).val(),
        $("input[name='patronymic']", block).val(),
        $("input[name='login']", block).val(),
        $("input[name='password']", block).val(),
        role_name,
        $("input[name='email']", block).val(),
        $("input[name='phone']", block).val()
    ];
    if (role_name == "student") {
        query.push(
            "INSERT INTO students (id, group_id) VALUES ((SELECT max(id) FROM users), ?)",
            $("#group_id").val()
        );
    } else {
        query.push("INSERT INTO " + tab[role_name] + " (id) VALUES ((SELECT max(id) FROM users))");
    }

    sqlQuery(query, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            var query = [
                "SELECT surname, users.name AS name, patronymic, login, password, email, phone, users.id AS id " +
                "FROM users " +
                "JOIN roles ON users.role_id = roles.id " +
                "WHERE roles.name = ?",
                role_name
            ];
            loadRemovableTable('users', role_name, query, getDeleteQueryForUser);
        }
    });
}
