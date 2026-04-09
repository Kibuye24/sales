-- Ensure notes column exists (it should from previous migration)
-- and add a trigger to update the updated_at timestamp if needed.

-- If you need to manually add the column (already in migration 001):
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON leads;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
