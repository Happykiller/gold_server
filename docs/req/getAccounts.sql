-- Détails Livret Cap Region
CREATE OR REPLACE VIEW livret_cap AS
SELECT a.id, 
	a.label, 
  b.label as type,
	getBalance(a.id, true) as balance_reconcilied,
	getBalance(a.id, false) as balance_not_reconcilied
FROM 
  account_type_list b,
  account a
WHERE 1=1
AND a.type_id = b.id
AND a.active = 1
AND a.type_id = 1
AND a.id not in (1,2,3,31,36)
ORDER BY a.label ASC;

-- Balance des comptes
CREATE OR REPLACE VIEW accounts_balance AS
SELECT a.id, 
	a.label, 
  b.label as type,
	getBalance(a.id, true) as balance_reconcilied,
	getBalance(a.id, false) as balance_not_reconcilied
FROM 
  account_type_list b,
  account a
WHERE 1=1
AND a.type_id = b.id
AND a.active = 1
AND a.id in (2,31,36)
UNION
SELECT 3, 'Livret Cap Region', 'real', SUM(balance_reconcilied) as total_reconcilied, SUM(balance_not_reconcilied) as total_not_reconcilied
FROM (
	SELECT a.id, 
		a.label, 
		getBalance(a.id, true) as balance_reconcilied,
		getBalance(a.id, false) as balance_not_reconcilied
	FROM account a
	WHERE 1=1
	AND a.active = 1
	AND a.type_id = 1
	AND a.id not in (1,2,3,31,36)
) c

-- Templates
CREATE OR REPLACE VIEW templates_balance AS
SELECT a.id, 
	a.label, 
    b.label as type,
	getBalance(a.id, true) as balance_reconcilied,
	getBalance(a.id, false) as balance_not_reconcilied
FROM 
  account_type_list b,
  account a
WHERE 1=1
AND a.type_id = b.id
AND a.type_id = 2
AND a.active = 1
AND a.id not in (25)
ORDER BY a.label ASC;