DELIMITER $$
CREATE FUNCTION full_name(par_user_id INT) RETURNS varchar(155)
BEGIN
  RETURN (SELECT concat(surname, ' ', name, ' ', patronymic) FROM users WHERE id = par_user_id);
END$$

DELIMITER ;