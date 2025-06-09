import { Search } from  '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder } : SearchBarProps) {
  return (
    <div className="relative group">
      <div className="flex items-center bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-indigo-300 transition-all duration-300 ease-in-out">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200 mr-3" />
        <input
          type="text"
          value={value}
          placeholder={placeholder || "Tìm kiếm..."}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full font-medium focus:placeholder:text-gray-300 transition-colors duration-200"
        />
      </div>
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
    </div>
  )
}
