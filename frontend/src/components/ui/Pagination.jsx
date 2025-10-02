import { Button, HStack, Select, Text } from '@chakra-ui/react';

const Pagination = ({
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
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <HStack justify='space-between' p='4' borderWidth='1px' borderRadius='lg' flexWrap='wrap'>
      <HStack gap='2'>
        <Text fontSize='sm' color='fg.muted'>
          Showing {startItem}-{endItem} of {totalItems}
        </Text>
      </HStack>

      <HStack gap='2'>
        <Text fontSize='sm' color='fg.muted'>
          Items per page:
        </Text>
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </HStack>

      <HStack gap='2'>
        <Button
          size='sm'
          variant='outline'
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          Previous
        </Button>

        <HStack gap='1'>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                size='sm'
                variant={currentPage === pageNum ? 'solid' : 'outline'}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </HStack>

        <Button size='sm' variant='outline' onClick={nextPage} disabled={!hasNextPage}>
          Next
        </Button>
      </HStack>
    </HStack>
  );
};

export default Pagination;