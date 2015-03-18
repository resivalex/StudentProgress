$(document).ready(makeTestReport);
$(document).ready(makeBeauty);

function makeBeauty() {
    $("#courses").buttonset();
    $("#groups").buttonset();
    $("#subjects").buttonset();
    $("#auditories").buttonset();
}

function makeTestReport() {
    var text =
        "SELECT groups.name, concat(COUNT(*), ' студентов') " +
        "FROM groups " +
        "JOIN students ON (groups.id = students.group_id) " +
        "GROUP BY groups.id";
    sqlQuery(text, function(response) {
        var $table = $(getTableFromJSON(response));
        $table.addClass("custom_table");
        $table.appendTo($("#content"));
    })
}