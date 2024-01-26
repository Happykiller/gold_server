SELECT a.id, a.label, b.label as type
FROM 
  account_type_list b,
  account a
WHERE 1=1
AND a.type_id = b.id
AND a.active = 1
ORDER BY b.id, a.label ASC

4,Alimentation,account.type-regular
5,Assurances,account.type-regular
15,Cadeaux,account.type-regular
17,Capital risque,account.type-regular
33,Chap42,account.type-regular
6,Charges,account.type-regular
38,Cluses,account.type-regular
2,Courant,account.type-regular
7,Distribution,account.type-regular
8,Fabrice ,account.type-regular
9,Geek,account.type-regular
11,Illidan,account.type-regular
34,Impôts,account.type-regular
14,Jeux,account.type-regular
36,Livret A,account.type-regular
3,Livret Cap Region,account.type-regular
31,Livret Jeune,account.type-regular
1,Mes comptes,account.type-regular
18,Mobilité,account.type-regular
10,Régie Eau,account.type-regular
20,Santé,account.type-regular
19,Sorties,account.type-regular
21,Taxe foncière,account.type-regular
22,Taxe habitation,account.type-regular
23,Vacances,account.type-regular
25,Mes templates,account.type-template
29,Prêts,account.type-template
26,Salaire-Courant,account.type-template
27,Salaire-Livret,account.type-template

Status
1,operation.status-follow,
2,operation.status-reconciled,

SELECT h.id, 
  h.amount,
  h.account_id_dest,
  h.description, 
  h.category,
  h.status,
  h.thrid,
  h.type,
  h.type_id_cal,
  h.move,
  SUM(h.move) as balance
FROM (
SELECT g.id, 
  g.amount,
  g.account_id_dest,
  g.description, 
  g.category,
  g.status,
  g.thrid,
  g.type,
  g.type_id_cal,
  CASE g.type_id_cal
    WHEN 1 THEN g.amount
    WHEN 2 THEN (g.amount*-1)
  END as move
FROM (
SELECT a.id, 
  a.amount,
  a.account_id_dest,
  a.description, 
  b.label as category,
  c.label as status,
  d.label as thrid,
  e.label as type,
  CASE e.id 
       WHEN 1 THEN 1
       WHEN 2 THEN 2
       WHEN 3 THEN 2
  END as type_id_cal
FROM 
  operation_category_list b,
  operation_status_list c,
  operation_third_list d,
  operation_type_list e,
  operation a
WHERE 1=1
AND a.category_id = b.id
AND a.status_id = c.id
AND a.third_id = d.id
AND a.type_id = e.id
AND a.account_id = 4
AND a.active = 1
UNION
SELECT a.id, 
  a.amount,
  a.account_id_dest,
  a.description, 
  b.label as category,
  c.label as status,
  d.label as thrid,
  e.label as type,
  1 as type_id_cal
FROM 
  operation_category_list b,
  operation_status_list c,
  operation_third_list d,
  operation_type_list e,
  operation a
WHERE 1=1
AND a.category_id = b.id
AND a.status_id = c.id
AND a.third_id = d.id
AND a.type_id = e.id
AND a.account_id_dest = 4
AND a.active = 1
) g
) h
ORDER BY h.id



SELECT d.credit + e.payment - f.debit
FROM (
  SELECT SUM(a.amount) as credit
  FROM
    operation a
  WHERE 1=1
  AND a.type_id = 1
  AND a.account_id = 4
  AND a.active = 1
) d,
(
  SELECT SUM(b.amount) as payment
  FROM
    operation b
  WHERE 1=1
  AND b.type_id = 3
  AND b.account_id_dest = 4
  AND b.active = 1
) e,
(
  SELECT SUM(c.amount) as debit
  FROM
    operation c
  WHERE 1=1
  AND c.type_id in (2,3)
  AND c.account_id = 4
  AND c.active = 1
) f

















CREATE FUNCTION get_balance ( account_id INT )
RETURNS FLOAT

BEGIN

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

   executable_section

END;