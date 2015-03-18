<fieldset class="filter_group">
    <legend>Группы</legend>
    <div id="courses" class="filter_row">
        <input id="course_all" type="checkbox">
        <label for="course_all">Любой</label>
        <input id="course_1" type="checkbox">
        <label for="course_1">1</label>
        <input id="course_2" type="checkbox">
        <label for="course_2">2</label>
        <input id="course_3" type="checkbox">
        <label for="course_3">3</label>
        <input id="course_4" type="checkbox">
        <label for="course_4">4</label>
        <input id="course_5" type="checkbox">
        <label for="course_5">5</label>
    </div>
    <div id="groups" class="filter_row">
        <?php
        $res = sql_query("SELECT id, name FROM groups");
        for ($i = 0; $i < count($res["id"]); $i++) {
            $id = $res["id"][$i];
            $name = $res["name"][$i];
            echo <<<HTML
        <input id="group_$id" type="checkbox">
        <label for="group_$id">$name</label>
HTML;
        }
        ?>
    </div>
</fieldset>
<fieldset class="filter_group">
    <legend>Отметки</legend>
    <div id="last_mark" class="filter_row">
        <label>Last mark<select></select></label>
    </div>
    <div id="had_mark" class="filter_row">
        <label>Had mark<select></select></label>
    </div>
</fieldset>
<fieldset class="filter_group">
    <legend>Детали занятия</legend>
    <div id="subjects" class="filter_row">
        <?php
        $res = sql_query("SELECT id, name FROM subjects");
        for ($i = 0; $i < count($res["id"]); $i++) {
            $id = $res["id"][$i];
            $name = $res["name"][$i];
            echo <<<HTML
        <input id="subject_$id" type="checkbox">
        <label for="subject_$id">$name</label>
HTML;
        }
        ?>
    </div>
    <div id="teachers" class="filter_row">
        <label><input type="checkbox">Teacher1</label>
    </div>
    <div id="auditories" class="filter_row">
        <?php
        $res = sql_query("SELECT id, name FROM auditories");
        for ($i = 0; $i < count($res["id"]); $i++) {
            $id = $res["id"][$i];
            $name = $res["name"][$i];
            echo <<<HTML
        <input id="auditory_$id" type="checkbox">
        <label for="auditory_$id">$name</label>
HTML;
        }
        ?>
    </div>
</fieldset>
<fieldset class="filter_group">
    <legend>Интервал</legend>
    <div id="interval" class="filter_row">
        <label>from<input type="text"></label>
        <label>to<input type="text"></label>
    </div>
</fieldset>
<div style="text-align: center">
    <button id="commit_button">Создать отчёт</button>
</div>
<div id="content">
    <table class="auto_margin"><tr><td>Отчёт ещё не создан</td></tr></table>
</div>