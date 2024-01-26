SELECT SUM(h.move) AS balance
FROM 
    (SELECT g.amount,
         g.type_id_cal,
        
        CASE g.type_id_cal
        WHEN 1 THEN
        g.amount
        WHEN 2 THEN
        (g.amount*-1)
        END AS move
    FROM 
        (SELECT a.amount,
        
            CASE a.type_id
            WHEN 1 THEN
            1
            WHEN 2 THEN
            2
            WHEN 3 THEN
            2
            END AS type_id_cal
        FROM operation a
        WHERE 1=1
                AND a.account_id = 4
                AND a.active = 1
        UNION
        SELECT a.amount,
         1 AS type_id_cal
        FROM operation a
        WHERE 1=1
                AND a.account_id_dest = 4
                AND a.active = 1 ) g ) h