import { query } from './utils/connectToDB.js';
import { createEmployeeTableQuery } from './utils/sqlQuery.js';

const seedData = [
  { name: 'Honda', email: 'honda@email.com', age: 23, role: 'Developer', salary: 50000.0 },
  { name: 'Toyota', email: 'toyota@email.com', age: 49, role: 'Manager', salary: 75000.0 },
  { name: 'Suzuki', email: 'suzuki@email.com', age: 19, role: 'Intern', salary: 30000.0 },
  { name: 'Yamaha', email: 'yamaha@email.com', age: 29, role: 'Developer', salary: 55000.0 },
  { name: 'Kawasaki', email: 'kawasaki@email.com', age: 33, role: 'HR', salary: 60000.0 },
];

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Check if table exists
    const tableCheck = await query(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='employee_details'
    `);

    if (tableCheck.rows.length === 0) {
      console.log('Creating employee_details table...');
      await query(createEmployeeTableQuery);
    }

    // Check if data already exists
    const existingData = await query('SELECT COUNT(*) as count FROM employee_details');
    if (existingData.rows[0].count > 0) {
      console.log('Database already has data. Skipping seed.');
      process.exit(0);
    }

    // Insert seed data
    console.log('Inserting seed data...');
    for (const employee of seedData) {
      await query(
        `INSERT INTO employee_details(name, email, age, role, salary) VALUES(?, ?, ?, ?, ?)`,
        [employee.name, employee.email, employee.age, employee.role, employee.salary]
      );
      console.log(`Added: ${employee.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seed();