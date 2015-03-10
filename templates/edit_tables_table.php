<?php
$header = $vars["header"];
$table_name = $vars["table_name"];
$params = $vars["params"];
$fields_value = [];
foreach ($params as $param) {
    $fields_value[] = $param[1];
}
$fields_value = json_encode($fields_value);
?>
<div>
    <p class="section_header"><?php echo $header; ?></p>
    <input type="hidden" id="<?php echo $table_name."_fields"?>" value='<?php echo $fields_value?>'>
    <div id="<?php echo $table_name?>" class="ajax_div"></div>
    <div style="text-align: center;">
        <table class="custom_table">
            <?php
            foreach ($params as $param) {
                $input_name = $table_name."_".$param[1];
                echo <<<HTML
            <tr>
                <td><label>$param[0]</label></td>
                <td><input type="text" name="$input_name" id="$input_name"></td>
            </tr>
HTML;
            }
            ?>
        </table>
        <button id="add_to_<?php echo $table_name?>" class="add_button" type="button" style="display:inline">Добавить</button>
    </div>
</div>