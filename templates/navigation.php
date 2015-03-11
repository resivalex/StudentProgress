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
                "title": "Редактировать таблицы",
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
                "title": "Количество отметок",
                "url": "reports.php"
            }
        ]
    },
    {
        "title": "Пользователь",
        "content": [
            {
                "title": "Выйти",
                "url": "logout.php"
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
    <?php
    if (!isset($vars["hide_menu"])) {
        echo <<<HTML
    <div id="csv_div"></div>
HTML;
    }
    ?>
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
</div>
