<?php
$table_data = $vars["table_data"];
$time = $table_data["time"];
$action = $table_data["action"];
?>
<table class="log_table">
    <tr>
        <th>
            Время
        </th>
        <th>
            Событие
        </th>
    </tr>
    <?php
    for ($i = 0; $i < count($time); $i++) {
        echo <<<HTML
    <tr>
        <td>
            $time[$i]
        </td>
        <td>
            <div>
                $action[$i]
            </div>
        </td>
    </tr>
HTML;

    }
    ?>
</table>