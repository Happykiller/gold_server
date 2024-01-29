SET @template_account_id := 29;
SET @account_id := 2;
SET @user_id := 1;
INSERT INTO operation (account_id, account_id_dest, amount, date, status_id, type_id, third_id, category_id, description, creator_id)
SELECT @account_id, a.account_id_dest, a.amount, now(), a.status_id, a.type_id, a.third_id, a.category_id, a.description, @user_id
	FROM operation a, account b
WHERE 1=1
	AND a.active = 1
	AND a.account_id = b.id
	AND b.id = @template_account_id
;