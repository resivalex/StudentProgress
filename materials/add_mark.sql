DELIMITER //  
  
CREATE PROCEDURE add_mark (IN par_student_id INT, IN par_lesson_id INT,
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

END //  
