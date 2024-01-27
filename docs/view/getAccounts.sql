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
ORDER BY b.id, a.label ASC