import { useState, useMemo } from 'react';

/**
 * Custom hook for sorting employee data
 * @param {Array} employees - Array of employee objects
 * @returns {Object} - Sorted data and sort controls
 */
export const useEmployeeSort = (employees) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    if (!sortConfig.key) return employees;

    const sorted = [...employees].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [employees, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle direction if same key
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New key, default to ascending
      return { key, direction: 'asc' };
    });
  };

  const resetSort = () => {
    setSortConfig({ key: null, direction: 'asc' });
  };

  return {
    sortedEmployees,
    sortConfig,
    handleSort,
    resetSort,
  };
};