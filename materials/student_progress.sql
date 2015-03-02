-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Мар 02 2015 г., 21:11
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=70 ;

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
(67, 'ауйуц45', 'цуйкцуаыв'),
(68, '', '');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`id`, `group_id`, `subject_id`, `auditory_id`, `teacher_id`, `time`) VALUES
(5, 3, 2, 9, 5, '2013-02-28 08:00:00'),
(7, 2, 6, 3, 5, '2013-09-25 10:30:00'),
(12, 2, 2, 3, 17, '2013-03-15 07:15:00'),
(14, 2, 6, 67, 5, '2013-01-01 04:00:00'),
(15, 3, 2, 1, 5, '2013-01-23 06:00:00'),
(28, 4, 1, 2, 17, '2013-05-01 15:00:00'),
(29, 3, 5, 2, 12, '2013-02-01 07:20:00'),
(30, 2, 1, 10, 12, '2013-04-01 08:20:00'),
(31, 2, 1, 1, 5, '2013-01-01 04:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `log`
--

CREATE TABLE IF NOT EXISTS `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action` varchar(4096) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=282 ;

--
-- Дамп данных таблицы `log`
--

INSERT INTO `log` (`id`, `time`, `action`) VALUES
(146, '2015-03-02 18:24:04', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(147, '2015-03-02 18:24:04', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(148, '2015-03-02 18:24:04', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(149, '2015-03-02 18:24:05', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(150, '2015-03-02 18:24:05', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 28 ORDER BY name")'),
(151, '2015-03-02 18:24:05', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(152, '2015-03-02 18:24:07', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(153, '2015-03-02 18:24:07', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(154, '2015-03-02 18:24:07', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(155, '2015-03-02 18:24:07', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(156, '2015-03-02 18:24:07', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 28 ORDER BY name")'),
(157, '2015-03-02 18:24:07', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(158, '2015-03-02 18:24:10', 'select_query("SELECT time, action FROM log ORDER BY id")'),
(159, '2015-03-02 18:25:36', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(160, '2015-03-02 18:25:36', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(161, '2015-03-02 18:25:36', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(162, '2015-03-02 18:25:36', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(163, '2015-03-02 18:25:36', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 28 ORDER BY name")'),
(164, '2015-03-02 18:25:36', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(165, '2015-03-02 18:25:39', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 2 AND lessons.teacher_id = 17 ORDER BY name")'),
(166, '2015-03-02 18:25:39', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 2 AND lessons.group_id = 2 ORDER BY name")'),
(167, '2015-03-02 18:25:39', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 12 ORDER BY name")'),
(168, '2015-03-02 18:25:39', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = 3 AND lessons.id = 12 ORDER by mark_history.id DESC")'),
(169, '2015-03-02 18:25:39', 'select_query("SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name")'),
(170, '2015-03-02 18:25:47', 'select_query("SELECT time, action FROM log ORDER BY id")'),
(171, '2015-03-02 18:28:36', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 5 ORDER BY name")'),
(172, '2015-03-02 18:28:36', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 5 ORDER BY name")'),
(173, '2015-03-02 18:28:36', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 5 AND lessons.subject_id = 1 AND lessons.group_id = 2 ORDER BY name")'),
(174, '2015-03-02 18:28:36', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 31 ORDER BY name")'),
(175, '2015-03-02 18:28:36', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = 3 AND lessons.id = 31 ORDER by mark_history.id DESC")'),
(176, '2015-03-02 18:28:36', 'select_query("SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name")'),
(177, '2015-03-02 18:33:42', 'select_query("SELECT name, description, id FROM auditories")'),
(178, '2015-03-02 18:33:42', 'select_query("SELECT name, description, id FROM subjects")'),
(179, '2015-03-02 18:33:42', 'select_query("SELECT name, course, id FROM groups")'),
(180, '2015-03-02 18:33:46', 'modify_query("INSERT INTO subjects (name, description) VALUES (?, ?)")'),
(181, '2015-03-02 18:33:46', 'select_query("SELECT name, description, id FROM subjects")'),
(182, '2015-03-02 18:33:53', 'modify_query("INSERT INTO subjects (name, description) VALUES (?, ?)")'),
(183, '2015-03-02 18:33:56', 'modify_query("DELETE FROM subjects WHERE id = 7")'),
(184, '2015-03-02 18:33:56', 'select_query("SELECT name, description, id FROM subjects")'),
(185, '2015-03-02 18:33:59', 'modify_query("INSERT INTO subjects (name, description) VALUES (?, ?)")'),
(186, '2015-03-02 18:33:59', 'select_query("SELECT name, description, id FROM subjects")'),
(187, '2015-03-02 18:34:04', 'modify_query("INSERT INTO subjects (name, description) VALUES (?, ?)")'),
(188, '2015-03-02 18:34:04', 'select_query("SELECT name, description, id FROM subjects")'),
(189, '2015-03-02 18:34:35', 'modify_query("DELETE FROM subjects WHERE id = 10")'),
(190, '2015-03-02 18:34:35', 'select_query("SELECT name, description, id FROM subjects")'),
(191, '2015-03-02 18:34:35', 'modify_query("DELETE FROM subjects WHERE id = 9")'),
(192, '2015-03-02 18:34:35', 'select_query("SELECT name, description, id FROM subjects")'),
(193, '2015-03-02 18:42:13', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN lessons ON (groups.id = lessons.group_id) ORDER BY groups.name")'),
(194, '2015-03-02 18:42:13', 'select_query("SELECT subjects.name AS subject_name, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name, auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) JOIN teachers ON (lessons.teacher_id = teachers.id) JOIN users ON (teachers.id = users.id) JOIN groups ON (lessons.group_id = groups.id) JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE groups.id = 4 ORDER BY subjects.name, teacher_name, auditories.name, lessons.time")'),
(195, '2015-03-02 18:42:19', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN students ON (groups.id = students.group_id) ORDER BY groups.name")'),
(196, '2015-03-02 18:42:19', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM students JOIN groups ON students.group_id = groups.id WHERE groups.id = 2 ORDER BY name")'),
(197, '2015-03-02 18:42:19', 'select_query("SELECT subjects.name AS subject_name, full_name(teachers.id) AS teacher_name, mark_history.time, mark_types.short_name, mark_history.comment FROM mark_history JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_marks ON mark_history.id = last_marks.id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN marks ON mark_history.mark_id = marks.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id JOIN subjects ON lessons.subject_id = subjects.id JOIN teachers ON lessons.teacher_id = teachers.id WHERE students.id = 3 ORDER BY mark_history.time")'),
(198, '2015-03-02 18:54:27', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN students ON (groups.id = students.group_id) ORDER BY groups.name")'),
(199, '2015-03-02 18:54:27', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM students JOIN groups ON students.group_id = groups.id WHERE groups.id = 2 ORDER BY name")'),
(200, '2015-03-02 18:54:27', 'select_query("SELECT full_names.name AS teacher_name, mark_history.time, mark_types.short_name, mark_history.comment FROM mark_history JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_marks ON mark_history.id = last_marks.id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN marks ON mark_history.mark_id = marks.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id JOIN subjects ON lessons.subject_id = subjects.id JOIN teachers ON lessons.teacher_id = teachers.id JOIN full_names ON teachers.id = full_names.id WHERE students.id = 3 ORDER BY mark_history.time")'),
(201, '2015-03-02 18:54:37', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN lessons ON (groups.id = lessons.group_id) ORDER BY groups.name")'),
(202, '2015-03-02 18:54:37', 'select_query("SELECT subjects.name AS subject_name, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name, auditories.name AS auditory_name, lessons.time AS lesson_time FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) JOIN teachers ON (lessons.teacher_id = teachers.id) JOIN users ON (teachers.id = users.id) JOIN groups ON (lessons.group_id = groups.id) JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE groups.id = 4 ORDER BY subjects.name, teacher_name, auditories.name, lessons.time")'),
(203, '2015-03-02 18:54:38', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN students ON (groups.id = students.group_id) ORDER BY groups.name")'),
(204, '2015-03-02 18:54:39', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM students JOIN groups ON students.group_id = groups.id WHERE groups.id = 2 ORDER BY name")'),
(205, '2015-03-02 18:54:39', 'select_query("SELECT full_names.name AS teacher_name, mark_history.time, mark_types.short_name, mark_history.comment FROM mark_history JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_marks ON mark_history.id = last_marks.id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN marks ON mark_history.mark_id = marks.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id JOIN subjects ON lessons.subject_id = subjects.id JOIN teachers ON lessons.teacher_id = teachers.id JOIN full_names ON teachers.id = full_names.id WHERE students.id = 3 ORDER BY mark_history.time")'),
(206, '2015-03-02 18:55:42', 'select_query("SELECT DISTINCT groups.id, groups.name FROM groups JOIN students ON (groups.id = students.group_id) ORDER BY groups.name")'),
(207, '2015-03-02 18:55:42', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM students JOIN groups ON students.group_id = groups.id WHERE groups.id = 2 ORDER BY name")'),
(208, '2015-03-02 18:55:42', 'select_query("SELECT subjects.name AS subject_name, full_names.name AS teacher_name, mark_history.time, mark_types.short_name, mark_history.comment FROM mark_history JOIN (SELECT max(id) AS id FROM mark_history GROUP BY mark_id) AS last_marks ON mark_history.id = last_marks.id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN marks ON mark_history.mark_id = marks.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id JOIN subjects ON lessons.subject_id = subjects.id JOIN teachers ON lessons.teacher_id = teachers.id JOIN full_names ON teachers.id = full_names.id WHERE students.id = 3 ORDER BY mark_history.time")'),
(209, '2015-03-02 18:59:02', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(210, '2015-03-02 18:59:02', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(211, '2015-03-02 18:59:02', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(212, '2015-03-02 18:59:02', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(213, '2015-03-02 18:59:02', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 28 ORDER BY name")'),
(214, '2015-03-02 18:59:02', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(215, '2015-03-02 18:59:04', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 2 AND lessons.teacher_id = 17 ORDER BY name")'),
(216, '2015-03-02 18:59:04', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 2 AND lessons.group_id = 2 ORDER BY name")'),
(217, '2015-03-02 18:59:04', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 12 ORDER BY name")'),
(218, '2015-03-02 18:59:04', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = 3 AND lessons.id = 12 ORDER by mark_history.id DESC")'),
(219, '2015-03-02 18:59:04', 'select_query("SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name")'),
(220, '2015-03-02 19:00:16', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(221, '2015-03-02 19:00:16', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(222, '2015-03-02 19:00:16', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(223, '2015-03-02 19:00:16', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(224, '2015-03-02 19:00:16', 'select_query("SELECT students.id AS id, full_names.name AS name FROM lessons JOIN students ON lessons.group_id = students.group_id JOIN full_names ON students.id = full_names.id WHERE lessons.id = 28 ORDER BY name")'),
(225, '2015-03-02 19:00:16', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(226, '2015-03-02 19:00:19', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 2 AND lessons.teacher_id = 17 ORDER BY name")'),
(227, '2015-03-02 19:00:19', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 2 AND lessons.group_id = 2 ORDER BY name")'),
(228, '2015-03-02 19:00:19', 'select_query("SELECT students.id AS id, full_names.name AS name FROM lessons JOIN students ON lessons.group_id = students.group_id JOIN full_names ON students.id = full_names.id WHERE lessons.id = 12 ORDER BY name")'),
(229, '2015-03-02 19:00:19', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = 3 AND lessons.id = 12 ORDER by mark_history.id DESC")'),
(230, '2015-03-02 19:00:19', 'select_query("SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name")'),
(231, '2015-03-02 19:04:35', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(232, '2015-03-02 19:04:35', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(233, '2015-03-02 19:04:35', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(234, '2015-03-02 19:04:35', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(235, '2015-03-02 19:04:35', 'select_query("SELECT students.id AS id, full_names.name AS name FROM lessons JOIN students ON lessons.group_id = students.group_id JOIN full_names ON students.id = full_names.id WHERE lessons.id = 28 ORDER BY name")'),
(236, '2015-03-02 19:04:35', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(237, '2015-03-02 19:25:05', 'select_query("SELECT DISTINCT teachers.id, concat(users.surname, '' '', users.name, '' '', users.patronymic) AS teacher_name FROM teachers JOIN users ON teachers.id = users.id JOIN lessons ON teachers.id = lessons.teacher_id ORDER BY teacher_name")'),
(238, '2015-03-02 19:25:05', 'select_query("SELECT DISTINCT subjects.id, subjects.name FROM lessons JOIN subjects ON (lessons.subject_id = subjects.id) WHERE lessons.teacher_id = 17 ORDER BY name")'),
(239, '2015-03-02 19:25:05', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 1 AND lessons.teacher_id = 17 ORDER BY name")'),
(240, '2015-03-02 19:25:05', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 1 AND lessons.group_id = 4 ORDER BY name")'),
(241, '2015-03-02 19:25:05', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 28 ORDER BY name")'),
(242, '2015-03-02 19:25:05', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = undefined AND lessons.id = 28 ORDER by mark_history.id DESC")'),
(243, '2015-03-02 19:25:07', 'select_query("SELECT DISTINCT groups.id, groups.name FROM lessons JOIN groups ON (lessons.group_id = groups.id) WHERE lessons.subject_id = 2 AND lessons.teacher_id = 17 ORDER BY name")'),
(244, '2015-03-02 19:25:07', 'select_query("SELECT lessons.id AS id, concat(name, '' | '', time) AS name FROM lessons JOIN auditories ON (lessons.auditory_id = auditories.id) WHERE lessons.teacher_id = 17 AND lessons.subject_id = 2 AND lessons.group_id = 2 ORDER BY name")'),
(245, '2015-03-02 19:25:07', 'select_query("SELECT students.id AS id, full_name(students.id) AS name FROM lessons JOIN students ON lessons.group_id = students.group_id WHERE lessons.id = 12 ORDER BY name")'),
(246, '2015-03-02 19:25:07', 'select_query("SELECT mark_history.id, mark_history.time, mark_types.name, mark_history.comment FROM marks JOIN mark_history ON marks.id = mark_history.mark_id JOIN mark_types ON mark_history.mark_type_id = mark_types.id JOIN students ON marks.student_id = students.id JOIN lessons ON marks.lesson_id = lessons.id WHERE students.id = 3 AND lessons.id = 12 ORDER by mark_history.id DESC")'),
(247, '2015-03-02 19:25:07', 'select_query("SELECT mark_types.id, mark_types.short_name FROM mark_types ORDER BY mark_types.short_name")'),
(248, '2015-03-02 19:34:06', 'select_query("SELECT * FROM auditories")'),
(249, '2015-03-02 19:34:06', 'select_query("SELECT * FROM chiefs")'),
(250, '2015-03-02 19:34:06', 'select_query("SELECT * FROM full_names")'),
(251, '2015-03-02 19:34:06', 'select_query("SELECT * FROM groups")'),
(252, '2015-03-02 19:34:06', 'select_query("SELECT * FROM lessons")'),
(253, '2015-03-02 19:34:06', 'select_query("SELECT * FROM log")'),
(254, '2015-03-02 19:34:06', 'select_query("SELECT * FROM mark_history")'),
(255, '2015-03-02 19:34:06', 'select_query("SELECT * FROM mark_types")'),
(256, '2015-03-02 19:34:06', 'select_query("SELECT * FROM marks")'),
(257, '2015-03-02 19:34:06', 'select_query("SELECT * FROM roles")'),
(258, '2015-03-02 19:34:06', 'select_query("SELECT * FROM students")'),
(259, '2015-03-02 19:34:06', 'select_query("SELECT * FROM subjects")'),
(260, '2015-03-02 19:34:06', 'select_query("SELECT * FROM teachers")'),
(261, '2015-03-02 19:34:06', 'select_query("SELECT * FROM users")'),
(262, '2015-03-02 19:35:26', 'select_query("SELECT * FROM auditories")'),
(263, '2015-03-02 19:35:26', 'select_query("SELECT * FROM chiefs")'),
(264, '2015-03-02 19:35:26', 'select_query("SELECT * FROM full_names")'),
(265, '2015-03-02 19:35:26', 'select_query("SELECT * FROM groups")'),
(266, '2015-03-02 19:35:26', 'select_query("SELECT * FROM lessons")'),
(267, '2015-03-02 19:35:26', 'select_query("SELECT * FROM log")'),
(268, '2015-03-02 19:35:26', 'select_query("SELECT * FROM mark_history")'),
(269, '2015-03-02 19:35:26', 'select_query("SELECT * FROM mark_types")'),
(270, '2015-03-02 19:35:26', 'select_query("SELECT * FROM marks")'),
(271, '2015-03-02 19:35:26', 'select_query("SELECT * FROM roles")'),
(272, '2015-03-02 19:35:26', 'select_query("SELECT * FROM students")'),
(273, '2015-03-02 19:35:26', 'select_query("SELECT * FROM subjects")'),
(274, '2015-03-02 19:35:26', 'select_query("SELECT * FROM teachers")'),
(275, '2015-03-02 19:35:26', 'select_query("SELECT * FROM users")'),
(276, '2015-03-02 19:42:55', 'select_query("SELECT name, description, id FROM auditories")'),
(277, '2015-03-02 19:42:55', 'select_query("SELECT name, description, id FROM subjects")'),
(278, '2015-03-02 19:42:55', 'select_query("SELECT name, course, id FROM groups")'),
(279, '2015-03-02 19:42:57', 'modify_query("INSERT INTO auditories (name, description) VALUES (?, ?)")'),
(280, '2015-03-02 19:42:57', 'select_query("SELECT name, description, id FROM auditories")'),
(281, '2015-03-02 19:42:58', 'modify_query("INSERT INTO auditories (name, description) VALUES (?, ?)")');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

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
(36, 16, 15),
(37, 16, 29),
(38, 3, 30),
(39, 4, 30),
(40, 1, 30),
(41, 3, 31);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=31 ;

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
(21, 3, 36, '2015-02-24 20:03:59', 'без комментариев'),
(22, 1, 37, '2015-02-28 09:15:12', 'не подготовила доклад!'),
(23, 5, 37, '2015-02-28 09:15:25', 'без комментариев'),
(24, 3, 37, '2015-02-28 09:16:00', 'отличный доклад! надо было вовремя сдавать.'),
(25, 4, 38, '2015-02-28 18:19:40', 'отлично'),
(26, 4, 39, '2015-02-28 18:19:58', 'абсолютно'),
(27, 2, 40, '2015-02-28 18:20:08', 'без комментариев'),
(28, 3, 40, '2015-02-28 18:20:15', 'без комментариев'),
(29, 3, 41, '2015-02-28 20:01:58', 'без комментариев'),
(30, 5, 38, '2015-02-28 20:02:20', 'без комментариев');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

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
