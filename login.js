
$(document).ready(function() {
    $("#fast_submit").click(function () {
        $("input[name='login']").val("admin");
        $("input[name='password']").val("patented").closest("form").get(0).submit();
    });
});