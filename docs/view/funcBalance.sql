USE gold2;
DROP FUNCTION IF EXISTS getBalance;
DELIMITER $$
CREATE FUNCTION getBalance($account_id INT, $reconcilied BOOLEAN)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE balance DECIMAL(10,2);
  SET balance = 0;
  SELECT 
    IFNULL(SUM(h.move),0) into balance
	FROM
		(SELECT 
			g.amount,
			CASE g.type_id_cal
				WHEN 1 THEN g.amount
				WHEN 2 THEN (g.amount * - 1)
			END AS move
		FROM
			(SELECT 
			a.id,
			a.amount,
			CASE a.type_id
				WHEN 1 THEN 1
				WHEN 2 THEN 2
				WHEN 3 THEN 2
			END AS type_id_cal
		FROM
			operation a
		WHERE 1 = 1
				AND a.account_id = $account_id
                AND ( 
                  CASE 
                  WHEN $reconcilied THEN
                    a.type_id = 2
				  ELSE 
					a.type_id in (1,2)
                  END
                ) 
				AND a.active = 1 
		UNION SELECT 
			a.id,
			a.amount,
			1 AS type_id_cal
		FROM
			operation a
		WHERE 1 = 1
				AND a.account_id_dest = $account_id
                AND ( 
                  CASE 
                  WHEN $reconcilied THEN
                    a.type_id = 2
				  ELSE 
					a.type_id in (1,2)
                  END
                ) 
				AND a.active = 1) g) h;
  RETURN balance;
END