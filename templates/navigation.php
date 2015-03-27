<?php
$json = <<<JS
[
    {
        "title": "Администрирование",
        "content": [
            {
                "title": "Учётные записи",
                "access": ["admin"],
                "url": "accounts.php"
            },
            {
                "title": "Редактирование таблиц",
                "access": ["admin"],
                "url": "edit_tables.php"
            },
            {
                "title": "Резервирование",
                "access": ["admin"],
                "url": "reservation.php"
            },
            {
                "title": "Все таблицы",
                "access": ["admin"],
                "url": "all_tables.php"
            },
            {
                "title": "Лог",
                "access": ["admin"],
                "url": "log.php"
            }
        ]
    },
    {
        "title": "Расписание",
        "content": [
            {
                "title": "Для преподавателя",
                "access": ["admin", "chief", "teacher"],
                "url": "schedule_for_teacher.php"
            },
            {
                "title": "Для студента",
                "access": ["admin", "chief", "student"],
                "url": "schedule_for_student.php"
            },
            {
                "title": "Редактировать расписание",
                "access": ["admin"],
                "url": "edit_schedule.php"
            }
        ]
    },
    {
        "title": "Отметки",
        "content": [
            {
                "title": "Для преподавателя",
                "access": ["teacher"],
                "url": "marks_for_teacher.php"
            },
            {
                "title": "Для студента",
                "access": ["admin", "chief", "student"],
                "url": "marks_for_student.php"
            }
        ]
    },
    {
        "title": "Отчёты",
        "content": [
            {
                "title": "Списки студентов",
                "access": ["admin", "chief"],
                "url": "reports.php"
            },
            {
                "title": "Статистика",
                "access": ["admin", "chief"],
                "url": "stat_report.php"
            }
        ]
    }
]
JS;
if (isset($vars["hide_menu"])) $categories = [];
if (isset($_SESSION["username"])) {
    $role = $_SESSION["role"];
    $categories = json_decode($json, true);
    $categories_count = count($categories);
    for ($i = 0; $i < $categories_count; $i++) {
        $content = $categories[$i]["content"];
        $content_count = count($content);
        for ($j = 0; $j < $content_count; $j++) {
            $link = $content[$j];
            if (array_search($role, $link["access"]) === false) {
                unset($content[$j]);
            }
        }
        $content = array_values($content);
        $categories[$i]["content"] = $content;
        if (count($content) == 0) {
            unset($categories[$i]);
        }
    }
    $categories = array_values($categories);
} else {
    $categories = [];
}
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
    if (isset($_SESSION["username"]) && !isset($vars["hide_menu"])) {
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
