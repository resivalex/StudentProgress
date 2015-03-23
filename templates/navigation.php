<?php
$json = <<<JS
[
    {
        "title": "Администрирование",
        "content": [
            {
                "title": "Учётные записи",
                "url": "accounts.php"
            },
            {
                "title": "Редактирование таблиц",
                "url": "edit_tables.php"
            },
            {
                "title": "Резервирование",
                "url": "reservation.php"
            },
            {
                "title": "Все таблицы",
                "url": "all_tables.php"
            },
            {
                "title": "Лог",
                "url": "log.php"
            }
        ]
    },
    {
        "title": "Расписание",
        "content": [
            {
                "title": "Для преподавателя",
                "url": "schedule_for_teacher.php"
            },
            {
                "title": "Для студента",
                "url": "schedule_for_student.php"
            },
            {
                "title": "Редактировать расписание",
                "url": "edit_schedule.php"
            }
        ]
    },
    {
        "title": "Отметки",
        "content": [
            {
                "title": "Для преподавателя",
                "url": "marks_for_teacher.php"
            },
            {
                "title": "Для студента",
                "url": "marks_for_student.php"
            }
        ]
    },
    {
        "title": "Отчёты",
        "content": [
            {
                "title": "Списки студентов",
                "url": "reports.php"
            }
        ]
    }
]
JS;
$categories = json_decode($json, true);
if (isset($vars["hide_menu"])) $categories = [];
?>
<div style="height: 5px; background-color: #aaf;"></div>
<div class="navigation_div">
    <ul id="navigation_menu" class="navigation_menu">
    <?php
    foreach ($categories as $category) {
        $title = $category["title"];
        $content = $category["content"];
        echo <<<HTML
            <li class="category">
                <label class="category_label">
                        $title
                </label>
                <ul class="submenu">
HTML;
        foreach ($content as $link) {
            echo <<<HTML
                    <a class="item_link" href="{$link["url"]}">
                        <li class="item">
                            {$link["title"]}
                        </li>
                    </a>
HTML;
        }
        echo <<<HTML
                </ul>
            </li>
HTML;
    }
    ?>
    </ul>
    <?php
    if (!isset($vars["hide_menu"])) {
        echo <<<HTML
    <div class="user" >
        <div class="user-title">{$_SESSION["username"]}[{$_SESSION["role"]}]</div>
        <div class="user-actions">
            <a href="logout.php">
                <div class="user-action"><div class="user-action-name">Выйти</div></div>
            </a>
            <div class="user-action"><div title="student" class="user-action-name">в роли "student"</div></div>
            <div class="user-action"><div title="teacher" class="user-action-name">в роли "teacher"</div></div>
            <div class="user-action"><div title="chief" class="user-action-name">в роли "chief"</div></div>
            <div class="user-action"><div title="admin" class="user-action-name">в роли "admin"</div></div>
        </div>
    </div >
HTML;
    }
    ?>
</div>
