import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, Dialog, HStack, Stack, Table, Text } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { baseUrl } from '../../../constants/global-variable';
import { queryClient } from '../../../utils/queryClient';
import InputEmployee from './inputEmployee';
import EmployeeFilters from './EmployeeFilters';
import Pagination from './Pagination';
import { useEmployeeFilters } from '../../hooks/useEmployeeFilters';
import { useEmployeeSort } from '../../hooks/useEmployeeSort';
import { usePagination } from '../../hooks/usePagination';
import { useBulkSelection } from '../../hooks/useBulkSelection';

const EmployeeTable = ({ data }) => {
  // Filter hook
  const {
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
  } = useEmployeeFilters(data);

  // Sort hook
  const { sortedEmployees, sortConfig, handleSort } = useEmployeeSort(filteredEmployees);

  // Pagination hook
  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(sortedEmployees, 10);

  // Bulk selection hook (works on paginated data)
  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
  } = useBulkSelection(paginatedData);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = new Set(data?.map((emp) => emp.role).filter(Boolean));
    return Array.from(roles);
  }, [data]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(baseUrl + '/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Employee deleted!');
      queryClient.invalidateQueries({ queryKey: ['employee_details'] });
      clearSelection();
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      const deletePromises = ids.map((id) =>
        fetch(baseUrl + '/' + id, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter((res) => !res.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} employee(s)`);
      }

      return responses;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(`${selectedCount} employee(s) deleted!`);
      queryClient.invalidateQueries({ queryKey: ['employee_details'] });
      clearSelection();
    },
  });

  const handleBulkDelete = () => {
    if (selectedCount === 0) {
      toast.error('No employees selected');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCount} employee(s)?`
    );

    if (confirmDelete) {
      bulkDeleteMutation.mutate(Array.from(selectedIds));
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort size={12} style={{ opacity: 0.3 }} />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  if (!data || data.length === 0) {
    return <h1>You don't have any employee data!</h1>;
  }

  return (
    <Stack gap='4'>
      {/* Filters */}
      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        salaryRange={salaryRange}
        setSalaryRange={setSalaryRange}
        ageRange={ageRange}
        setAgeRange={setAgeRange}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
        roles={uniqueRoles}
      />

      {/* Result count and bulk actions */}
      <HStack justify='space-between' p='2'>
        <Text fontSize='sm' color='fg.muted'>
          {totalItems} employee(s) found
          {hasActiveFilters && ' (filtered)'}
        </Text>

        {selectedCount > 0 && (
          <HStack gap='2'>
            <Text fontSize='sm' fontWeight='semibold'>
              {selectedCount} selected
            </Text>
            <Button
              size='sm'
              colorScheme='red'
              variant='outline'
              onClick={handleBulkDelete}
              isLoading={bulkDeleteMutation.isPending}
            >
              Delete Selected
            </Button>
            <Button size='sm' variant='ghost' onClick={clearSelection}>
              Clear
            </Button>
          </HStack>
        )}
      </HStack>

      {/* Table */}
      <Table.Root size='md' variant='outline'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer' }}
              />
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('id')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>ID</span>
                {getSortIcon('id')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('name')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>Name</span>
                {getSortIcon('name')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('email')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>Email</span>
                {getSortIcon('email')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('age')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>Age</span>
                {getSortIcon('age')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('role')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>Role</span>
                {getSortIcon('role')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              onClick={() => handleSort('salary')}
              cursor='pointer'
              _hover={{ bg: 'bg.muted' }}
            >
              <HStack gap='1'>
                <span>Salary</span>
                {getSortIcon('salary')}
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((item) => (
            <Table.Row key={item.id} bg={isSelected(item.id) ? 'bg.muted' : undefined}>
              <Table.Cell>
                <input
                  type="checkbox"
                  checked={isSelected(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  style={{ cursor: 'pointer' }}
                />
              </Table.Cell>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.age}</Table.Cell>
              <Table.Cell>{item.role || '-'}</Table.Cell>
              <Table.Cell>${item.salary?.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <HStack gap='3'>
                  <MdDelete
                    size={20}
                    className='icon'
                    onClick={() => deleteMutation.mutate(item.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <InputEmployee data={item} type='update'>
                    <Dialog.Trigger asChild>
                      <FaRegEdit size={20} className='icon' style={{ cursor: 'pointer' }} />
                    </Dialog.Trigger>
                  </InputEmployee>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        goToPage={goToPage}
        nextPage={nextPage}
        previousPage={previousPage}
        changePageSize={changePageSize}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </Stack>
  );
};

export default EmployeeTable;
