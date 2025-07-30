import { Button } from '@/components/ui/button';
import { SuggestionChip } from '../types/chatbot';

interface SuggestionChipsProps {
  suggestions: SuggestionChip[];
  onSuggestionClick: (suggestion: SuggestionChip) => void;
  disabled?: boolean;
}

export default function SuggestionChips({ 
  suggestions, 
  onSuggestionClick, 
  disabled = false 
}: SuggestionChipsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-blue-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={() => onSuggestionClick(suggestion)}
          disabled={disabled}
        >
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
} 