ALTER TABLE operations ALTER COLUMN amount_cents TYPE bigint;
ALTER TABLE operations ADD CONSTRAINT operation_amount_limit CHECK(amount_cents <= 9000000000);
