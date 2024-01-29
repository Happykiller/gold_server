-- Livret Cap Region
SELECT SUM(balance_reconcilied) as total_reconcilied, SUM(balance_not_reconcilied) as total_not_reconcilied
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
WHERE 1=1