--- Details accounts
SET @p1 := 2;
SELECT * FROM accounts_histo;

create function p1() returns INTEGER DETERMINISTIC NO SQL return @p1;

CREATE OR REPLACE VIEW accounts_histo AS
SELECT 
    h.id,
    h.move as amount,
    h.description,
	h.date,
    h.status,
    h.category,
    h.thrid,
    h.type,
    h.account_id,
    h.account_label,
    h.account_id_dest,
    h.account_dest_label
FROM
    (SELECT 
        g.id,
		g.amount,
		g.account_id,
        g.account_label,
		g.account_id_dest,
		g.account_dest_label,
		g.description,
        g.category_id,
        g.status_id,
        g.third_id,
        g.type_id,
		g.category,
		g.status,
		g.thrid,
		g.type,
		g.type_id_cal,
		CASE g.type_id_cal
			WHEN 1 THEN g.amount
			WHEN 2 THEN (g.amount * - 1)
		END AS move,
        g.date
    FROM
        (SELECT 
        a.id,
		a.amount,
		a.account_id,
        i.label as account_label,
		a.account_id_dest,
        j.label as account_dest_label,
		a.description,
        a.category_id,
		b.label AS category,
        a.status_id,
		c.label AS status,
        a.third_id,
		d.label AS thrid,
        a.type_id,
		e.label AS type,
		CASE a.type_id
			WHEN 1 THEN 1
			WHEN 2 THEN 2
			WHEN 3 THEN 2
		END AS type_id_cal,
        a.date
    FROM
        operation_category_list b, 
        operation_status_list c, 
        operation_third_list d, 
        operation_type_list e, 
        account i,
        operation a
	LEFT OUTER JOIN account j
		ON a.account_id_dest = j.id
    WHERE 1 = 1 
			AND a.category_id = b.id
            AND a.status_id = c.id
            AND a.third_id = d.id
            AND a.type_id = e.id
            AND a.account_id = i.id
            AND a.account_id = p1()
            AND a.active = 1 
	UNION SELECT 
        a.id,
		a.amount,
		a.account_id,
        i.label as account_label,
		a.account_id_dest,
        j.label as account_dest_label,
		a.description,
        a.category_id,
		b.label AS category,
        a.status_id,
		c.label AS status,
        a.third_id,
		d.label AS thrid,
        a.type_id,
		e.label AS type,
		1 AS type_id_cal,
        a.date
    FROM
        operation_category_list b, 
        operation_status_list c, 
        operation_third_list d, 
        operation_type_list e, 
        account i,
        account j,
        operation a
    WHERE 1 = 1 
			AND a.category_id = b.id
            AND a.status_id = c.id
            AND a.third_id = d.id
            AND a.type_id = e.id
            AND a.account_id = i.id
            AND a.account_id_dest = j.id
            AND a.account_id_dest = p1()
            AND a.active = 1) g) h
WHERE 1=1
ORDER BY h.date DESC, h.id DESC
LIMIT 100
;