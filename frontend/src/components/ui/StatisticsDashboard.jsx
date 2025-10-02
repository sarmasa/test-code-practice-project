import { useMemo } from 'react';
import { Box, Grid, HStack, Stack, Text } from '@chakra-ui/react';
import { calculateStatistics, calculateRolePercentages } from '../../utils/statistics';

const StatCard = ({ label, value, subtext }) => (
  <Box
    borderWidth='1px'
    borderRadius='lg'
    p='4'
    bg='bg.panel'
    _hover={{ borderColor: 'border.emphasized' }}
  >
    <Stack gap='1'>
      <Text fontSize='sm' color='fg.muted'>
        {label}
      </Text>
      <Text fontSize='2xl' fontWeight='bold'>
        {value}
      </Text>
      {subtext && (
        <Text fontSize='xs' color='fg.muted'>
          {subtext}
        </Text>
      )}
    </Stack>
  </Box>
);

const StatisticsDashboard = ({ data }) => {
  const stats = useMemo(() => calculateStatistics(data), [data]);
  const rolePercentages = useMemo(
    () => calculateRolePercentages(stats.roleDistribution, stats.totalEmployees),
    [stats.roleDistribution, stats.totalEmployees]
  );

  if (!data || data.length === 0) {
    return (
      <Box p='4' borderWidth='1px' borderRadius='lg'>
        <Text color='fg.muted'>No employee data available for statistics</Text>
      </Box>
    );
  }

  return (
    <Stack gap='6'>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap='4'>
        <StatCard label='Total Employees' value={stats.totalEmployees} />
        <StatCard
          label='Average Salary'
          value={`$${stats.averageSalary.toLocaleString()}`}
          subtext={`Range: $${stats.salaryRange.min.toLocaleString()} - $${stats.salaryRange.max.toLocaleString()}`}
        />
        <StatCard
          label='Average Age'
          value={stats.averageAge}
          subtext={`Range: ${stats.ageRange.min} - ${stats.ageRange.max}`}
        />
        <StatCard label='Unique Roles' value={Object.keys(stats.roleDistribution).length} />
      </Grid>

      <Box borderWidth='1px' borderRadius='lg' p='4'>
        <Text fontSize='lg' fontWeight='semibold' mb='3'>
          Role Distribution
        </Text>
        <Stack gap='2'>
          {Object.entries(rolePercentages).map(([role, data]) => (
            <HStack key={role} justify='space-between'>
              <Text fontSize='sm'>{role}</Text>
              <HStack gap='2'>
                <Text fontSize='sm' color='fg.muted'>
                  {data.count} ({data.percentage}%)
                </Text>
                <Box
                  bg='blue.500'
                  h='2'
                  w={`${data.percentage}px`}
                  borderRadius='full'
                  minW='20px'
                />
              </HStack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default StatisticsDashboard;
