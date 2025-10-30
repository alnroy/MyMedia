import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: SearchFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <span>Search & Filter</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or director..."
            className="pl-10 glass border-primary/20 focus:border-primary"
          />
        </div>

        {/* Type filter */}
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="glass border-primary/20 focus:border-primary">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="glass">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Movie">Movies</SelectItem>
            <SelectItem value="TV Show">TV Shows</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
