/**
 * Email format validation
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Age range validation
 * @param {number|string} age - Age to validate
 * @param {number} min - Minimum age (default: 18)
 * @param {number} max - Maximum age (default: 70)
 * @returns {boolean} - True if age is within valid range
 */
export const isValidAge = (age, min = 18, max = 70) => {
  const ageNum = Number(age);
  if (isNaN(ageNum)) return false;
  return ageNum >= min && ageNum <= max && Number.isInteger(ageNum);
};

/**
 * Salary validation
 * @param {number|string} salary - Salary to validate
 * @param {number} min - Minimum salary (default: 0)
 * @returns {boolean} - True if salary is valid positive number
 */
export const isValidSalary = (salary, min = 0) => {
  const salaryNum = Number(salary);
  if (isNaN(salaryNum)) return false;
  return salaryNum > min;
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length (default: 2)
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {boolean} - True if name is valid
 */
export const isValidName = (name, minLength = 2, maxLength = 50) => {
  if (!name || typeof name !== 'string') return false;
  const trimmedName = name.trim();
  return trimmedName.length >= minLength && trimmedName.length <= maxLength;
};

/**
 * Validate employee data
 * @param {Object} employee - Employee data object
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateEmployee = (employee) => {
  const errors = [];

  if (!isValidName(employee.name)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  if (!isValidEmail(employee.email)) {
    errors.push('Invalid email format');
  }

  if (!isValidAge(employee.age)) {
    errors.push('Age must be between 18 and 70');
  }

  if (!isValidSalary(employee.salary)) {
    errors.push('Salary must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};