import { Button, HStack, Input, Stack, Box, Text, Slider } from '@chakra-ui/react';
import { Field } from './field';

const EmployeeFilters = ({
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
  roles = [],
}) => {
  return (
    <Stack gap='4' p='4' borderWidth='1px' borderRadius='lg'>
      <HStack gap='4'>
        <Field label='Search (Name/Email)' style={{ flex: '1' }}>
          <Input
            placeholder='Search by name or email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Field>

        <Field label='Role' style={{ flex: '1' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          >
            <option value=''>All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>
      </HStack>

      <HStack gap='6'>
        <Box flex='1' minW='300px'>
          <Field label='Salary Range'>
            <Stack gap='2'>
              <HStack justify='space-between'>
                <Text fontSize='sm'>${salaryRange.min || 0}</Text>
                <Text fontSize='sm'>${salaryRange.max || 200000}</Text>
              </HStack>
              <Slider.Root
                width='300px'
                min={0}
                max={200000}
                step={1000}
                defaultValue={[0, 200000]}
                value={[Number(salaryRange.min) || 0, Number(salaryRange.max) || 200000]}
                onValueChange={(details) => {
                  setSalaryRange({
                    min: details.value[0].toString(),
                    max: details.value[1].toString(),
                  });
                }}
                minStepsBetweenThumbs={1}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Stack>
          </Field>
        </Box>

        <Box flex='1' minW='300px'>
          <Field label='Age Range'>
            <Stack gap='2'>
              <HStack justify='space-between'>
                <Text fontSize='sm'>{ageRange.min || 18}</Text>
                <Text fontSize='sm'>{ageRange.max || 70}</Text>
              </HStack>
              <Slider.Root
                width='300px'
                min={18}
                max={70}
                step={1}
                defaultValue={[18, 70]}
                value={[Number(ageRange.min) || 18, Number(ageRange.max) || 70]}
                onValueChange={(details) => {
                  setAgeRange({
                    min: details.value[0].toString(),
                    max: details.value[1].toString(),
                  });
                }}
                minStepsBetweenThumbs={1}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Stack>
          </Field>
        </Box>
      </HStack>

      {hasActiveFilters && (
        <Button variant='outline' onClick={resetFilters} size='sm' alignSelf='flex-start'>
          Reset Filters
        </Button>
      )}
    </Stack>
  );
};

export default EmployeeFilters;
