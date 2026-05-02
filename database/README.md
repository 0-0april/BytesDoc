# BytesDoc Database

MySQL 8.0 schema for the BytesDoc Document Management System, derived from the approved ERD (`../erd.png`).

## Files

| File | Purpose |
|------|---------|
| `01_schema.sql` | Creates the `bytesdoc` database and all 7 tables. |
| `02_seed.sql`   | Inserts the dev fixtures that match `frontend/lib/mockData.ts`. |
| `99_reset.sql`  | DEV ONLY — drops the `bytesdoc` database. |

## Tables (7)

```
role               -- chief_minister / secretary / finance_minister / member
category           -- Proposals / Permits / Budgets / Reports / Financial Records
event              -- e.g. Freshmen Orientation, Election 2025
administration     -- term, e.g. 2024-2025
user               -- FK -> role
document           -- FK -> administration, category, event, user (uploaded_by)
activity_log       -- FK -> user, document (nullable for login events)
```

`document_id` is referenced by `activity_log.document_id` with `ON DELETE SET NULL` so logs survive document deletion. All other FKs use `ON DELETE RESTRICT` to protect the audit trail and lookup integrity.

## How to run (Windows / MySQL 8.0)

From a regular PowerShell prompt:

```powershell
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
& $mysql -u root -p < .\database\01_schema.sql
& $mysql -u root -p < .\database\02_seed.sql
```

Or interactively:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
mysql> SOURCE C:/kelma/BytesDoc-main/BytesDoc-main/database/01_schema.sql;
mysql> SOURCE C:/kelma/BytesDoc-main/BytesDoc-main/database/02_seed.sql;
```

To reset (drops the database):

```powershell
& $mysql -u root -p < .\database\99_reset.sql
```

## Verifying the install

```sql
USE bytesdoc;
SHOW TABLES;
SELECT COUNT(*) AS users     FROM user;          -- expect 5
SELECT COUNT(*) AS documents FROM document;      -- expect 10
SELECT COUNT(*) AS logs      FROM activity_log;  -- expect 15
```

## Notes for backend devs

- **Passwords**: seed uses a placeholder bcrypt hash of `"password"`. Replace before any non-dev use.
- **IDs**: seed inserts explicit IDs so they line up with the frontend's mock IDs. After seeding, AUTO_INCREMENT continues from the next free value.
- **Charset**: `utf8mb4 / utf8mb4_unicode_ci` — full Unicode including emoji.
- **Timestamps**: all stored as `DATETIME` in UTC by convention; format dates from the app layer.
