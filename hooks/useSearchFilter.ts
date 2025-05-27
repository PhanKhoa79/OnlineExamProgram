// src/hooks/useSearchFilter.ts
import { useEffect, useState, useMemo } from "react";

export function useSearchFilter<T>(
  data: T[],
  keys: (keyof T)[],
  delay: number = 300
) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (inputValue === '') {
      setSearchQuery('');
      return;
    }

    setIsStale(true);
    const timeout = setTimeout(() => {
      setSearchQuery(inputValue.toLowerCase().trim());
      setIsStale(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputValue, delay]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      keys.some((key) =>
        String(item[key] || '').toLowerCase().includes(searchQuery)
      )
    );
  }, [data, keys, searchQuery]);

  return {
    inputValue,
    setInputValue,
    filteredData,
  };
}
