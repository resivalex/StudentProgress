-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Фев 26 2015 г., 09:52
-- Версия сервера: 5.5.27
-- Версия PHP: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `student_progress`
--

DELIMITER $$
--
-- Процедуры
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_mark`(IN par_student_id INT, IN par_lesson_id INT,
	IN par_mark_type_id INT, IN par_comment VARCHAR(200))
BEGIN  
	DECLARE loc_mark_id INT DEFAULT -1;
        
        IF
        	(SELECT count(*) FROM marks
                WHERE student_id = par_student_id
                AND lesson_id = par_lesson_id) = 0
        THEN
        	INSERT INTO marks (student_id, lesson_id)
                VALUES (par_student_id, par_lesson_id);
        END IF;
        
        SET loc_mark_id = (SELECT marks.id FROM marks
        		WHERE student_id = par_student_id
                        AND lesson_id = par_lesson_id);
                        
        INSERT INTO mark_history (mark_type_id, mark_id,
        			time, comment)
        VALUES (par_mark_type_id, loc_mark_id,
        CURRENT_TIMESTAMP, par_comment);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_OUT`(OUT var1 VARCHAR(100))
BEGIN  
    SET var1 = 'This is a test';  
END$$

--
-- Функции
--
CREATE DEFINER=`root`@`localhost` FUNCTION `full_name`(par_user_id INT) RETURNS varchar(155) CHARSET utf8
BEGIN
  RETURN (SELECT concat(surname, ' ', name, ' ', patronymic) FROM users WHERE id = par_user_id);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `auditories`
--

CREATE TABLE IF NOT EXISTS `auditories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=68 ;

--
-- Дамп данных таблицы `auditories`
--

INSERT INTO `auditories` (`id`, `name`, `description`) VALUES
(1, '100a', 'большая аудитория на первом этаже второго корпуса'),
(2, '215', 'огромная аудитория на втором этаже'),
(3, 'ыва', 'выаыв'),
(4, 'в', 'ыва'),
(6, '6', 'small'),
(9, 'г 314', 'Компьютерный класс'),
(10, 'слж', 'Подсобка'),
(67, 'ауйуц45', 'цуйкцуаыв');

-- --------------------------------------------------------

--
-- Структура таблицы `chiefs`
--

CREATE TABLE IF NOT EXISTS `chiefs` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `course` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `groups`
--

INSERT INTO `groups` (`id`, `name`, `course`) VALUES
(1, 'Школота', 1),
(2, 'Деды', 5),
(3, 'Е34-0ТУЦ-95', 1),
(4, 'Гр-202', 2),
(5, 'TwoYear', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `auditory_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `auditory_id` (`auditory_id`),
  KEY `subject_id` (`subject_id`),
  KEY `group_id_2` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`id`, `group_id`, `subject_id`, `auditory_id`, `teacher_id`, `time`) VALUES
(5, 3, 2, 9, 5, '2013-02-28 08:00:00'),
(7, 2, 6, 3, 5, '2013-09-25 10:30:00'),
(12, 2, 2, 3, 17, '2013-03-15 07:15:00'),
(14, 2, 6, 67, 5, '2013-01-01 04:00:00'),
(15, 3, 2, 1, 5, '2013-01-23 06:00:00'),
(28, 4, 1, 2, 17, '2013-05-01 15:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `log`
--

CREATE TABLE IF NOT EXISTS `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `marks`
--

CREATE TABLE IF NOT EXISTS `marks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

--
-- Дамп данных таблицы `marks`
--

INSERT INTO `marks` (`id`, `student_id`, `lesson_id`) VALUES
(1, 3, 7),
(2, 16, 5),
(3, 4, 7),
(33, 1, 7),
(34, 3, 12),
(35, 4, 12),
(36, 16, 15);

-- --------------------------------------------------------

--
-- Структура таблицы `mark_history`
--

CREATE TABLE IF NOT EXISTS `mark_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mark_type_id` int(11) NOT NULL,
  `mark_id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mark_type_id` (`mark_type_id`),
  KEY `mark_id` (`mark_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Дамп данных таблицы `mark_history`
--

INSERT INTO `mark_history` (`id`, `mark_type_id`, `mark_id`, `time`, `comment`) VALUES
(1, 4, 3, '2013-09-29 18:03:54', 'за старательную работу'),
(2, 3, 1, '2013-09-29 18:12:12', 'не всем же отлично ставить!'),
(3, 2, 3, '2015-02-24 10:50:30', 'без комментариев'),
(4, 3, 3, '2015-02-24 10:50:30', 'без комментариев'),
(5, 4, 3, '2015-02-24 10:50:30', 'без комментариев'),
(6, 3, 33, '2015-02-24 10:50:30', 'без комментариев'),
(7, 4, 33, '2015-02-24 10:50:30', 'без комментариев'),
(8, 2, 33, '2015-02-24 10:50:30', 'без комментариев'),
(9, 2, 2, '2015-02-24 10:50:30', 'без комментариев'),
(10, 4, 2, '2015-02-24 10:50:30', 'без комментариев'),
(11, 3, 2, '2015-02-24 10:50:30', 'без комментариев'),
(12, 4, 34, '2015-02-24 10:50:30', 'без комментариев'),
(13, 2, 34, '2015-02-24 10:50:30', 'без комментариев'),
(14, 1, 1, '2015-02-24 10:50:30', 'без комментариев'),
(15, 4, 1, '2015-02-24 10:50:30', 'без комментариев'),
(16, 5, 34, '2015-02-24 19:47:21', 'теперь можно ставить прогулы'),
(17, 3, 34, '2015-02-24 19:48:30', 'без комментариев'),
(18, 2, 34, '2015-02-24 19:58:10', 'длиииииииииииииииииииииииииииииииииииииииииииииииииииииииинный коментарий......................'),
(19, 4, 35, '2015-02-24 19:58:43', 'подготовился!'),
(20, 2, 36, '2015-02-24 20:03:44', 'Имеет представление. Не более.'),
(21, 3, 36, '2015-02-24 20:03:59', 'без комментариев');

-- --------------------------------------------------------

--
-- Структура таблицы `mark_types`
--

CREATE TABLE IF NOT EXISTS `mark_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `short_name` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `mark_types`
--

INSERT INTO `mark_types` (`id`, `name`, `short_name`, `description`) VALUES
(1, 'неудовлетворительно', '2', 'студент не владеет материалов'),
(2, 'удовлетворительно', '3', 'студент имеет представление о материале'),
(3, 'хорошо', '4', 'студент владеет материалом'),
(4, 'отлично', '5', 'студент владеет материалом в совершенстве'),
(5, 'отсутствовал', 'н', 'студент отсутствовал на занятии');

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `id_2` (`id`),
  UNIQUE KEY `id_3` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(4, 'chief'),
(2, 'student'),
(3, 'teacher');

-- --------------------------------------------------------

--
-- Структура таблицы `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `students`
--

INSERT INTO `students` (`id`, `group_id`) VALUES
(1, 2),
(3, 2),
(4, 2),
(16, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `description`) VALUES
(1, 'Математика', 'служанка всех наук'),
(2, 'Физика', 'наука'),
(3, '43', 'ываыв'),
(5, 'Психология', 'наука о поведении человека'),
(6, 'Шахматная подготовка', 'Знакомство с великой стратегической игрой');

-- --------------------------------------------------------

--
-- Структура таблицы `teachers`
--

CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `teachers`
--

INSERT INTO `teachers` (`id`) VALUES
(5),
(12),
(17);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `patronymic` varchar(50) NOT NULL,
  `login` varchar(20) NOT NULL,
  `password` varchar(32) NOT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_4` (`login`),
  KEY `role_id` (`role_id`),
  KEY `login` (`login`),
  KEY `login_2` (`login`),
  KEY `login_3` (`login`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `surname`, `name`, `patronymic`, `login`, `password`, `role_id`, `email`, `phone`) VALUES
(1, 'Решетников', 'Иван', 'Александрович', 'resh', 'easy', 2, 'resivalex@gmail.com', '8-911-399-98-63'),
(3, 'Барсук', 'Алексей', 'Юрьевич', 'balexey', 'hard', 2, '?', '?'),
(4, 'Нургалиев', 'Алексей', 'Темержанович', 'nurgalievat', 'uniq', 2, '?', '?'),
(5, 'Губарев', 'Валентин', 'Юрьевич', 'gvalentiny', 'gvalentiny', 3, '?', '?'),
(6, 'Николаев', 'Виктор', 'Васильевич', 'nv', 'nv', 4, '?', '???'),
(12, 'Мотина', 'Надежда', 'Владимировна', 'nmotina', 'nmotina', 3, '?', '?'),
(16, 'Решетникова', 'Елена', 'Александровна', 'lenf0', 'abc', 2, 'lenf0@mail.ru', '8-911-***-**-**'),
(17, 'Аристов', 'Михаил', 'Викторович', 'linux', 'linux', 3, 'linux', '01'),
(18, 'Решетникова', 'Наталья', 'Александровна', 'nata', 'nata', 4, 'nata@mail.ru', '8-953-243-57-91');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `chiefs`
--
ALTER TABLE `chiefs`
  ADD CONSTRAINT `chiefs_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `lessons_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `lessons_ibfk_3` FOREIGN KEY (`auditory_id`) REFERENCES `auditories` (`id`),
  ADD CONSTRAINT `lessons_ibfk_4` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Ограничения внешнего ключа таблицы `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `marks_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

--
-- Ограничения внешнего ключа таблицы `mark_history`
--
ALTER TABLE `mark_history`
  ADD CONSTRAINT `mark_history_ibfk_1` FOREIGN KEY (`mark_type_id`) REFERENCES `mark_types` (`id`),
  ADD CONSTRAINT `mark_history_ibfk_2` FOREIGN KEY (`mark_id`) REFERENCES `marks` (`id`);

--
-- Ограничения внешнего ключа таблицы `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
