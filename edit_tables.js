// добавляет строку в базу данных на странице edit_tables
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
