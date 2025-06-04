// src/hooks/useSearchFilter.ts
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

export function useSearchFilter<T>(
  data: T[],
  keys: (keyof T)[],
  delay: number = 300
) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStale, setIsStale] = useState(false);
  
  // Use ref to store previous data to prevent unnecessary recalculations
  const prevDataRef = useRef<T[]>([]);
  const prevKeysRef = useRef<(keyof T)[]>([]);

  // Memoize the stable version of data and keys
  const stableData = useMemo(() => {
    // Only update if data actually changed (deep comparison for small arrays)
    if (data.length !== prevDataRef.current.length || 
        data.some((item, index) => item !== prevDataRef.current[index])) {
      prevDataRef.current = data;
      return data;
    }
    return prevDataRef.current;
  }, [data]);

  const stableKeys = useMemo(() => {
    // Only update if keys actually changed
    if (keys.length !== prevKeysRef.current.length || 
        keys.some((key, index) => key !== prevKeysRef.current[index])) {
      prevKeysRef.current = keys;
      return keys;
    }
    return prevKeysRef.current;
  }, [keys]);

  // Optimize setInputValue to prevent recreating function
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  useEffect(() => {
    if (inputValue === '') {
      setSearchQuery('');
      setIsStale(false);
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
    // Early return for empty data
    if (!stableData || stableData.length === 0) return [];
    
    // Early return for empty search
    if (!searchQuery) return stableData;
    
    // Optimized filtering with early returns
    return stableData.filter((item) => {
      // Check if item is valid
      if (!item) return false;
      
      // Use some with early return for better performance
      return stableKeys.some((key) => {
        try {
          const value = item[key];
          // Safely handle null, undefined, and other falsy values
          const stringValue = value != null ? String(value) : '';
          return stringValue.toLowerCase().includes(searchQuery);
        } catch (error) {
          // Handle any potential errors gracefully
          console.warn('Error processing search key:', key, error);
          return false;
        }
      });
    });
  }, [stableData, stableKeys, searchQuery]);

  return {
    inputValue,
    setInputValue: handleInputChange,
    filteredData,
    searchQuery,
    isStale,
  };
}
