import { VStack } from '@chakra-ui/react';
import EmployeeTable from './components/ui/EmployeeTable';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../constants/global-variable.js';

const App = () => {
  async function fetchEmployeeDetails() {
    const res = await fetch(baseUrl);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  }

  const [isPending, isError, data, error] = useQuery({
    queryKey: ['employee_details'],
    queryFn: fetchEmployeeDetails,
  });
  if (isPending) return 'Loading';
  if (isError) return error.message;
  console.log('data from SQLite', data);

  return (
    <VStack gap='6' align='flex-start'>
      <EmployeeTable />
    </VStack>
  );
};

export default App;
