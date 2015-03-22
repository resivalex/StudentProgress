<?php
$header_text = $vars["header_text"];
$role = $vars["role"];
?>
<div class="<?php echo $role?>"><p class="section_header"><?php echo $header_text?></p>
    <div id="<?php echo $role?>" class="ajax_div"></div>
    <div style="width: 300px;margin:0 auto;">
        <div style="text-align:center">
            <table class="custom_table">
                <?php
                $input_values = [["Фамилия", "surname"], ["Имя", "name"], ["Отчество", "patronymic"],
                    ["Логин", "login"], ["Пароль", "password"], ["Эл. почта", "email"], ["Телефон", "phone"]];
                foreach ($input_values as $row) {
                    echo <<<HTML
                <tr>
                    <td><label>$row[0]</label></td>
                    <td><input type="text" name="$row[1]"</td>
                </tr>
HTML;
                }
                ?>
            </table>
            <?php
            if ($role == "student") echo <<<HTML
            <div id="select_group"></div>
HTML;
            ?>
            <button type="button" id="button_for_<?php echo $role?>" class="add_button">Добавить пользователя</button>
        </div>
    </div>
</div>