import { query } from '../utils/connectToDB.js';
import {
  createRoleQuery,
  createEmployeeTableQuery,
  getAllEmployeeQuery,
  createEmployeeQuery,
  getEmployeeQuery,
  deleteEmployeeQuery,
  updateEmployeeQuery,
} from '../utils/sqlQuery.js';

import { createError } from '../utils/error.js';
// contller
export async function getAllEmployee(req, res, next) {
  try {
    const response = await query(`
            SELECT to_regclass('employee_details');
        `);
    if (!response.row[0].to_regclass) {
      await query(createRoleQuery);
      await query(createEmployeeTableQuery);
    }
    const { rows } = await query(getAllEmployeeQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    return next(createError(400, 'Could not get employee details'));
  }
}

export async function getEmployee(req, res, next) {
  const id = req.params.id;
  const data = await query(getEmployeeQuery, [id]);
  if (!data.rows.length) {
    return next(createError(400, 'Employee not found'));
  }
  res.status(200).json(data.rows[0]);
}

export async function deleteEmployee(req, res, next) {
  const id = req.params.id;
  const data = await query(deleteEmployeeQuery, [id]);
  if (!data.rowCount) {
    return next(createError(400, 'Employee not found'));
  }
  res.status(200).json({ message: 'Delete Successfully' });
}

export async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, age, salary, role } = req.body;
    const result = query(updateEmployeeQuery, [name, email, age, role, salary, id]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Employee not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function createEmployee(req, res, next) {
  try {
    const { name, role, salary, age, email } = req.body;
    if (!name || !salary || !age || !email) {
      return res.status(400).json({ error: 'Missing Fields' });
    }
    const data = await query(createEmployeeQuery, [name, email, age, role, salary]);
    res.status(201).json(data.rows[0]);
  } catch (error) {
    console.log(error.message);
    return next(createError(400, error.message));
  }
}
