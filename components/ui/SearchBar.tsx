import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full max-w-lg">
      <Search className="w-5 h-5 text-indigo-500 mr-2" />
      <input
        type="text"
        placeholder="Search here..."
        className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-500 w-full"
      />
    </div>
  )
}
