$(document).ready(function() {
    $("#restore").click(function() {
        $("#file").get(0).click();
    });
    $("#file").on("change", function() {
        if ($("#file").val() != "") {
            $("#restore_form").submit();
        }
    })
});