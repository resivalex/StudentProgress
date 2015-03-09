
$(document).ready(function() {
    $(".ajax_div").each(function() {
        var table_name = $(this).attr("id");
        var hidden_id = table_name+"_fields";
        var fields = $.parseJSON($("#"+hidden_id).val());
        loadRemovableTable(table_name, table_name, splitSelectQueryFromParams(table_name, fields));
    });
    $(".add_button").click(function () {
        var table_name = $(this).attr("id").substr("add_to_".length);
        var hidden_id = table_name+"_fields";
        var fields = $.parseJSON($("#"+hidden_id).val());
        addToTable(table_name, fields);
    })
});

function addToTable(table_name, params) {
    var text = "INSERT INTO " + table_name + " (" + params[0];
    for (i = 1; i < params.length; i++) {
        text += ", " + params[i];
    }
    text += ") VALUES (?";
    for (i = 1; i < params.length; i++) {
        text += ", ?";
    }
    text += ")";
    var query = [text];
    for (i = 0; i < params.length; i++) {
        query.push(document.getElementById(table_name + "_" + params[i]).value);
    }
    sqlQuery(query, function(response) {
        if ($.parseJSON(response) === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            loadRemovableTable(table_name, table_name, splitSelectQueryFromParams(table_name, params));
        }
    });
}
