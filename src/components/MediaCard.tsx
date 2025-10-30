import { Film, Tv, Edit, Trash2, MapPin, DollarSign, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MediaCardProps {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget?: string | null;
  location?: string | null;
  duration?: string | null;
  year?: string | null;
  imageUrl?: string | null;
  poster?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MediaCard({
  title,
  type,
  director,
  budget,
  location,
  duration,
  year,
  imageUrl,
  poster,
  onEdit,
  onDelete,
}: MediaCardProps) {
  // ✅ Decide which image to show: poster > imageUrl
  const displayImage = poster || imageUrl
    ? (poster?.startsWith('http') || imageUrl?.startsWith('http')
        ? poster || imageUrl
        : `${import.meta.env.VITE_API_URL}${poster || imageUrl}`)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="glass-card neon-border group transition-smooth overflow-hidden rounded-2xl p-4"
    >
      {/* Poster */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden rounded-xl mb-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {type === 'Movie' ? (
              <Film className="w-20 h-20 text-primary/40" />
            ) : (
              <Tv className="w-20 h-20 text-secondary/40" />
            )}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1">
            {type === 'Movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground">Directed by {director}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {year && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3 text-primary" />
              <span>{year}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 text-secondary" />
              <span>{duration}</span>
            </div>
          )}
          {budget && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3 text-primary" />
              <span>{budget}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3 text-secondary" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-primary hover:text-white hover:border-primary transition-smooth"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-destructive hover:text-white hover:border-destructive transition-smooth"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
