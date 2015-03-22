
$(document).ready(function () {
    serverQuery("groups", function(response) {
        var $table = $("#student + div table");
        $table.append("<tr><td colspan='2'/></tr>");
        response = $.parseJSON(response);
        var $select = $("<select/>").attr("id", "group_id").css("width", "100%");
        for (i = 0; i < response.id.length; i++) {
            $("<option/>").text(response.name[i]).val(response.id[i]).appendTo($select);
        }
        $select.appendTo($("td:last", $table)).selectmenu().selectmenu("menuWidget").css("height", "150px");
    });
    $(".ajax_div").each(function () {
        var role = $(this).attr("id");
        var query = {
            name: "users in role",
            params: {
                role_name: role
            }
        };
        loadRemovableTable(role, query, "delete "+role);
    });
    $(".add_button").click(function () {
        addToUsers($(this).attr("id").substr("button_for_".length));
    });
});

function addToUsers(role_name) {
    var block = $("." + role_name);
    var params = {
        name: $("input[name=name]", block).val(),
        surname: $("input[name=surname]", block).val(),
        patronymic: $("input[name=patronymic]", block).val(),
        login: $("input[name=login]", block).val(),
        password: $("input[name=password]", block).val(),
        role_name: role_name,
        email: $("input[name=email]", block).val(),
        phone: $("input[name=phone]", block).val(),
        group_id: $("#group_id").val()
    };
    serverQuery("add user", params, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            var query = {
                name: "users in role",
                params: {
                    role_name: role_name
                }
            };
            loadRemovableTable(role_name, query, "delete "+role_name);
        }
    });
}
