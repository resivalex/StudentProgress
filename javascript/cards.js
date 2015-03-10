
$(document).ready(function() {
    function onClick(el) {
        el = el.currentTarget;
        if ($("label", el).html() != "") return;
        var $unclose = $(".game .unclose");
        var $labels = $("label", $unclose);
        if ($unclose.size() == 2) {
            if ($labels.first().html() != $labels.last().html()) {
                $labels.html("");
            }
            $unclose.removeClass("unclose").addClass("simple");
        }
        $(el).removeClass("simple").addClass("unclose");
        $("label", el).text(el.id);
        if ($(".game label").filter(function () {
                return $(this).html() == "";
            }).size() == 0) {
            location = "../good.php";
        }
    }

    function autoPlay() {
        if ($("#bot_mode:checked").size() == 0) return;
        var $empty = $(".game .simple").filter(function () {
            return $("label", this).html() == "";
        });
        if ($empty.size() == 0) return;
        onClick({currentTarget: $empty.get(Math.floor(Math.random() * $empty.size()))});
    }

    $(".game").on("click", ".simple", onClick);

    setInterval(autoPlay, 200);
});
