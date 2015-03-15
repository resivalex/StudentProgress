<div class="auto_margin" style="display: table">
    <a href="json_backup.php">
        <img class="melting" src="images/backup.png">
    </a>
    <br>
    <a href="https://ru.wikipedia.org/wiki/JSON">
        <img class="melting" src="images/json.png">
    </a>
    <br>
        <form id="restore_form" action="json_restore.php" method="post" enctype="multipart/form-data">
            <input id="file" style="display: none;" type="file" name="backup">
            <input type="submit" style="display: none" value="Загрузить">
        </form>
        <img class="melting" id="restore" src="images/restore.png" style="cursor: pointer;" align="right">
</div>
