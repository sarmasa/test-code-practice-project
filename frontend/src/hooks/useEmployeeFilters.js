import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering employee data
 * @param {Array} employees - Array of employee objects
 * @returns {Object} - Filtered data and filter controls
 */
export const useEmployeeFilters = (employees) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });

  const filteredEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];

    return employees.filter((employee) => {
      // Search filter (name or email)
      const matchesSearch =
        !searchTerm ||
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = !roleFilter || employee.role === roleFilter;

      // Salary range filter
      const minSalary = salaryRange.min ? Number(salaryRange.min) : -Infinity;
      const maxSalary = salaryRange.max ? Number(salaryRange.max) : Infinity;
      const matchesSalary =
        employee.salary >= minSalary && employee.salary <= maxSalary;

      // Age range filter
      const minAge = ageRange.min ? Number(ageRange.min) : -Infinity;
      const maxAge = ageRange.max ? Number(ageRange.max) : Infinity;
      const matchesAge = employee.age >= minAge && employee.age <= maxAge;

      return matchesSearch && matchesRole && matchesSalary && matchesAge;
    });
  }, [employees, searchTerm, roleFilter, salaryRange, ageRange]);

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setSalaryRange({ min: '', max: '' });
    setAgeRange({ min: '', max: '' });
  };

  const hasActiveFilters =
    searchTerm || roleFilter || salaryRange.min || salaryRange.max || ageRange.min || ageRange.max;

  return {
    filteredEmployees,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    salaryRange,
    setSalaryRange,
    ageRange,
    setAgeRange,
    resetFilters,
    hasActiveFilters,
  };
};