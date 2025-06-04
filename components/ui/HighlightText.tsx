import React from "react";

interface HighlightTextProps {
  text: string;
  searchQuery: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ 
  text, 
  searchQuery, 
  className = "" 
}) => {
  if (!searchQuery || !text) {
    return <span className={className}>{text}</span>;
  }

  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part matches the search query (case insensitive)
        if (part.toLowerCase() === searchQuery.toLowerCase()) {
          return (
            <mark 
              key={index} 
              className="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white px-0.5 rounded"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
}; 