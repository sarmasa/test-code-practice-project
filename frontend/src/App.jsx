import { Button, Dialog, VStack } from '@chakra-ui/react';
import EmployeeTable from './components/ui/EmployeeTable';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../constants/global-variable.js';
import InputEmployee from './components/ui/inputEmployee.jsx';

const App = () => {
  async function fetchEmployeeDetails() {
    const res = await fetch(baseUrl);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['employee_details'],
    queryFn: fetchEmployeeDetails,
  });

  if (isPending) return 'Loading';
  if (isError) return error.message;

  return (
    <VStack gap='6' align='flex-start'>
      <InputEmployee>
        <Dialog.Trigger asChild>
          <Button variant='outline'>Add Employee</Button>
        </Dialog.Trigger>
      </InputEmployee>
      <EmployeeTable data={data} />
    </VStack>
  );
};

export default App;
