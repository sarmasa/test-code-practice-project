/**
 * Calculate employee statistics
 * @param {Array} employees - Array of employee objects
 * @returns {Object} - Statistics object
 */
export const calculateStatistics = (employees) => {
  if (!employees || employees.length === 0) {
    return {
      totalEmployees: 0,
      averageSalary: 0,
      averageAge: 0,
      roleDistribution: {},
      salaryRange: { min: 0, max: 0 },
      ageRange: { min: 0, max: 0 },
    };
  }

  const totalEmployees = employees.length;

  // Calculate average salary
  const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
  const averageSalary = Math.round(totalSalary / totalEmployees);

  // Calculate average age
  const totalAge = employees.reduce((sum, emp) => sum + (emp.age || 0), 0);
  const averageAge = Math.round(totalAge / totalEmployees);

  // Role distribution
  const roleDistribution = employees.reduce((acc, emp) => {
    const role = emp.role || 'No Role';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Salary range
  const salaries = employees.map((emp) => emp.salary || 0);
  const salaryRange = {
    min: Math.min(...salaries),
    max: Math.max(...salaries),
  };

  // Age range
  const ages = employees.map((emp) => emp.age || 0);
  const ageRange = {
    min: Math.min(...ages),
    max: Math.max(...ages),
  };

  return {
    totalEmployees,
    averageSalary,
    averageAge,
    roleDistribution,
    salaryRange,
    ageRange,
  };
};

/**
 * Calculate role distribution percentages
 * @param {Object} roleDistribution - Role distribution object
 * @param {number} total - Total number of employees
 * @returns {Object} - Role distribution with percentages
 */
export const calculateRolePercentages = (roleDistribution, total) => {
  if (!roleDistribution || total === 0) return {};

  return Object.entries(roleDistribution).reduce((acc, [role, count]) => {
    acc[role] = {
      count,
      percentage: Math.round((count / total) * 100),
    };
    return acc;
  }, {});
};