import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../utils/classNames';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search users',
  initialValue = '',
  onSearch,
  onChange,
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex h-10 w-full items-center', className)}
    >
      <div className="pointer-events-none absolute left-3 flex items-center justify-center text-brand-text-secondary">
        <Search className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
      <input
        type="search"
        aria-label="Search Connectify"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="h-full w-full rounded-[8px] border border-brand-border bg-brand-bg pl-10 pr-4 text-sm leading-[22px] text-brand-text-primary placeholder-brand-text-muted transition-colors focus:border-brand-text-primary focus:outline-none"
      />
    </form>
  );
};
