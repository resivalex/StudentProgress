-- phpMyAdmin SQL Dump
-- version 3.5.7
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Май 07 2013 г., 00:24
-- Версия сервера: 5.1.50-community
-- Версия PHP: 5.3.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `student_progress`
--

-- --------------------------------------------------------

--
-- Структура таблицы `chiefs`
--

CREATE TABLE IF NOT EXISTS `chiefs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `patronymic` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `chiefs`
--

INSERT INTO `chiefs` (`id`, `surname`, `name`, `patronymic`) VALUES
(1, 'Бывалый', 'Пал', 'Палыч');

-- --------------------------------------------------------

--
-- Структура таблицы `courses`
--

CREATE TABLE IF NOT EXISTS `courses` (
  `number` int(11) NOT NULL AUTO_INCREMENT,
  `course_chief_id` int(11) NOT NULL,
  PRIMARY KEY (`number`),
  KEY `course_chief_id` (`course_chief_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `courses`
--

INSERT INTO `courses` (`number`, `course_chief_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `course_chiefs`
--

CREATE TABLE IF NOT EXISTS `course_chiefs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `patronymic` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `course_chiefs`
--

INSERT INTO `course_chiefs` (`id`, `surname`, `name`, `patronymic`) VALUES
(1, 'Чёткий', 'Колян', 'Алексеевич');

-- --------------------------------------------------------

--
-- Структура таблицы `formation_notes`
--

CREATE TABLE IF NOT EXISTS `formation_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `formation_notes`
--

INSERT INTO `formation_notes` (`id`, `student_id`, `date`) VALUES
(1, 1, '2012-07-04');

-- --------------------------------------------------------

--
-- Структура таблицы `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `course_number` int(11) NOT NULL,
  `subcom_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_number` (`course_number`),
  KEY `subcom_id` (`subcom_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `groups`
--

INSERT INTO `groups` (`id`, `name`, `course_number`, `subcom_id`) VALUES
(1, '101', 1, 1),
(2, '102', 1, 3),
(3, '103', 1, 4),
(4, '104', 1, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE IF NOT EXISTS `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`id`, `subject_id`, `group_id`, `teacher_id`) VALUES
(1, 2, 1, 1),
(2, 3, 2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `marks`
--

CREATE TABLE IF NOT EXISTS `marks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `teaching_id` int(11) NOT NULL,
  `mark_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `teaching_id` (`teaching_id`),
  KEY `mark_type_id` (`mark_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `marks`
--

INSERT INTO `marks` (`id`, `student_id`, `teaching_id`, `mark_type_id`) VALUES
(1, 1, 2, 5),
(2, 1, 1, 2),
(3, 3, 1, 4),
(4, 4, 1, 10);

-- --------------------------------------------------------

--
-- Структура таблицы `mark_types`
--

CREATE TABLE IF NOT EXISTS `mark_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=11 ;

--
-- Дамп данных таблицы `mark_types`
--

INSERT INTO `mark_types` (`id`, `name`) VALUES
(1, '2'),
(2, '3'),
(3, '4'),
(4, '5'),
(5, 'бол'),
(6, 'отп'),
(7, 'нр'),
(8, 'к'),
(9, 'х/р'),
(10, 'н/б');

-- --------------------------------------------------------

--
-- Структура таблицы `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `patronymic` varchar(100) CHARACTER SET utf8 NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `students`
--

INSERT INTO `students` (`id`, `surname`, `name`, `patronymic`, `group_id`) VALUES
(1, 'Беспечный', 'Максим', 'Семёнович', 1),
(2, 'Барсук', 'Алексей', 'Юрьевич', 1),
(3, 'Нургалиев', 'Алексей', 'Темержанович', 1),
(4, 'Макаров', 'Сергей', 'Николаевич', 1),
(6, 'Ласин', 'Григорий', 'Игнатьевич', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1251 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `subjects`
--

INSERT INTO `subjects` (`id`, `name`) VALUES
(3, 'Базы данных'),
(2, 'Информатика'),
(1, 'Математика');

-- --------------------------------------------------------

--
-- Структура таблицы `teachers`
--

CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `patronymic` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=cp1250 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `teachers`
--

INSERT INTO `teachers` (`id`, `surname`, `name`, `patronymic`) VALUES
(1, 'Губарев', 'Валентин', 'Юрьевич'),
(2, 'Мотина', 'Надежда', 'Владимировна');

-- --------------------------------------------------------

--
-- Структура таблицы `teachings`
--

CREATE TABLE IF NOT EXISTS `teachings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lesson_id` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `teachings`
--

INSERT INTO `teachings` (`id`, `lesson_id`, `date`) VALUES
(1, 1, '2012-07-09'),
(2, 2, '2012-07-09');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`course_chief_id`) REFERENCES `course_chiefs` (`id`) ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `formation_notes`
--
ALTER TABLE `formation_notes`
  ADD CONSTRAINT `formation_notes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`course_number`) REFERENCES `courses` (`number`) ON UPDATE CASCADE,
  ADD CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`subcom_id`) REFERENCES `students` (`id`) ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `lessons_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `lessons_ibfk_5` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

--
-- Ограничения внешнего ключа таблицы `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `marks_ibfk_2` FOREIGN KEY (`teaching_id`) REFERENCES `teachings` (`id`),
  ADD CONSTRAINT `marks_ibfk_3` FOREIGN KEY (`mark_type_id`) REFERENCES `mark_types` (`id`);

--
-- Ограничения внешнего ключа таблицы `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
