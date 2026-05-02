-- BytesDoc - DEV reset script
-- WARNING: drops the entire bytesdoc database. Run only in development.
-- Use this if you want to wipe everything and re-run 01_schema.sql + 02_seed.sql.

DROP DATABASE IF EXISTS `bytesdoc`;
