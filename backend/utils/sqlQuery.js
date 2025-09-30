// SQLite3用のクエリ（ENUMの代わりにCHECK制約を使用）
export const createRoleQuery = `
    -- SQLite3にはENUMがないため、テーブル作成時にCHECK制約で代用
`;

export const createEmployeeTableQuery = `
    CREATE TABLE employee_details(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        age INTEGER NOT NULL CHECK (age > 17),
        role TEXT NOT NULL DEFAULT 'Intern' CHECK (role IN ('Manager', 'Developer', 'HR', 'Sales', 'Intern')),
        salary REAL NOT NULL
    )
`;

export const getAllEmployeeQuery = `SELECT * FROM employee_details`;

export const createEmployeeQuery = `
    INSERT INTO employee_details(name,email,age,role,salary)
    VALUES(?,?,?,COALESCE(?,'Intern'),?)
`;

export const getEmployeeQuery = `SELECT * FROM employee_details WHERE id = ?`;

export const deleteEmployeeQuery = `DELETE FROM employee_details WHERE id = ?`;

export const updateEmployeeQuery = `
    UPDATE employee_details
    SET
    name = COALESCE(?,name),
    email = COALESCE(?,email),
    age = COALESCE(?,age),
    role = COALESCE(?,role),
    salary = COALESCE(?,salary)
    WHERE id = ?
`;
