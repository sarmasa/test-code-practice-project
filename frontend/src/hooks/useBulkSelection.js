import { useState, useMemo } from 'react';

/**
 * Custom hook for bulk selection operations
 * @param {Array} items - Array of items with id property
 * @returns {Object} - Selection state and control functions
 */
export const useBulkSelection = (items) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const itemIds = useMemo(() => {
    return items?.map((item) => item.id) || [];
  }, [items]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === itemIds.length && itemIds.length > 0) {
      // Deselect all
      setSelectedIds(new Set());
    } else {
      // Select all
      setSelectedIds(new Set(itemIds));
    }
  };

  const selectAll = () => {
    setSelectedIds(new Set(itemIds));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (id) => {
    return selectedIds.has(id);
  };

  const isAllSelected = useMemo(() => {
    return itemIds.length > 0 && selectedIds.size === itemIds.length;
  }, [itemIds.length, selectedIds.size]);

  const isSomeSelected = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < itemIds.length;
  }, [itemIds.length, selectedIds.size]);

  const selectedCount = selectedIds.size;

  const selectedItems = useMemo(() => {
    return items?.filter((item) => selectedIds.has(item.id)) || [];
  }, [items, selectedIds]);

  return {
    selectedIds,
    selectedItems,
    selectedCount,
    toggleSelection,
    toggleSelectAll,
    selectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
  };
};