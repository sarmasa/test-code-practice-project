import { For, HStack, Stack, Table } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';

const EmployeeTable = () => {
  return (
    <Stack gap='10'>
      <Table.Root size='md' variant='outline'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Age</Table.ColumnHeader>
            <Table.ColumnHeader>Role</Table.ColumnHeader>
            <Table.ColumnHeader>Salary</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.age}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.salary}</Table.Cell>
              <Table.Cell>
                <HStack gap='3'>
                  <MdDelete size={20} className='icon' />
                  <FaRegEdit size={20} className='icon' />
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

export default EmployeeTable;

const items = [
  { id: 1, name: 'Honda', email: 'honda@email.com', age: 23, role: 'Developer', salary: 50000.0 },
  { id: 2, name: 'Toyota', email: 'toyota@email.com', age: 49, role: 'Developer', salary: 50000.0 },
  { id: 3, name: 'Suzuki', email: 'suzuki@email.com', age: 19, role: 'Developer', salary: 50000.0 },
  { id: 4, name: 'Yamaha', email: 'yamaha@email.com', age: 29, role: 'Developer', salary: 50000.0 },
  {
    id: 5,
    name: 'kawasaki',
    email: 'kawasaki@email.com',
    age: 33,
    role: 'Developer',
    salary: 50000.0,
  },
];
