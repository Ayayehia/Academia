import { useCallback, useState } from 'react';

// Favorites kept in local component state only (no persistence / external store).
// Encapsulating the logic here keeps screens presentational.
export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { ids, toggle, count: ids.size };
}
