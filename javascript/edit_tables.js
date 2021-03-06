
$(document).ready(function() {
    $(".ajax_div").each(function() {
        var tableName = $(this).attr("id");
        var nameMap = {
            auditories: "auditory",
            subjects: "subject",
            groups: "group"
        };
        var query = {
            name: tableName+" for edition"
        };
        var option = {
            columnNameMap: {
                "name": "Название",
                "description": "Описание",
                "course": "Курс",
                "id": " "
            }
        };
        loadRemovableTable(tableName, query, "delete "+nameMap[tableName], option);
    });
    $(".add_button").click(function () {
        var table_name = $(this).attr("id").substr("add_to_".length);
        addToTable(table_name);
    })
});

function addToTable(tableName) {
    var $inputs = $("input[name^="+tableName+"]");
    var params = {};
    $inputs.each(function() {
        params[$(this).attr("name").substr(tableName.length + 1)] = $(this).val();
    });
    var nameMap = {
        auditories: "auditory",
        subjects: "subject",
        groups: "group"
    };
    serverQuery("add "+nameMap[tableName], params, function(response) {
        if (response === false) {
            showJSON(response, "Неудача");
        } else {
            showMessage("Добавлено");
            var nameMap = {
                auditories: "auditory",
                subjects: "subject",
                groups: "group"
            };
            var option = {
                columnNameMap: {
                    "name": "Название",
                    "description": "Описание",
                    "course": "Курс",
                    "id": " "
                }
            };
            loadRemovableTable(tableName, {name: tableName+" for edition"}, "delete "+nameMap[tableName], option);
        }
    });
}
