import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search" }: SearchBarProps) {
  return (
    <>
      <label className="input">
        <MagnifyingGlassIcon className="size-5 opacity-50" />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </>
  )
}
