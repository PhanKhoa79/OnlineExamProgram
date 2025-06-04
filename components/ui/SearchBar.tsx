import { Search } from  '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder } : SearchBarProps) {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg max-h-full">
      <Search className="w-5 h-5 text-indigo-500 mr-2" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-500 w-72"
      />
    </div>
  )
}
