import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import ThreeBackground from '@/components/ThreeBackground';
import SearchFilters from '@/components/SearchFilters';
import MediaCard from '@/components/MediaCard';
import MediaFormModal from '@/components/MediaFormModal';
import { Film, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { mediaService } from '@/services/mediaService';
import { Media } from '@/types';
import { toast } from 'sonner';

const BASE_URL = "https://my-media-backend.vercel.app"; // ✅ backend root

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]); // ✅ new
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load all media from backend
  const loadMedia = async (pageNum: number, reset = false) => {
    try {
      setIsLoading(true);
      const params: any = { page: pageNum, limit: 50 }; // Load more to allow local filtering
      const response = await mediaService.getMedia(params);

      const fetchedMedia = (response?.data || []).map((item: any) => ({
        ...item,
        imageUrl: item.imageUrl
          ? item.imageUrl.startsWith('http')
            ? item.imageUrl
            : `${BASE_URL}${item.imageUrl}`
          : null,
      }));

      console.log("Fetched Media:", fetchedMedia);

      if (reset) setMediaList(fetchedMedia);
      else setMediaList((prev) => [...prev, ...fetchedMedia]);

      const totalPages = response?.pagination?.totalPages || 1;
      setHasMore(pageNum < totalPages);
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Load once on mount
  useEffect(() => {
    loadMedia(1, true);
  }, []);

  // ✅ Local filtering logic
  useEffect(() => {
    let filtered = [...mediaList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.director && m.director.toLowerCase().includes(q))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((m) => m.type === typeFilter);
    }

    setFilteredMedia(filtered);
  }, [searchQuery, typeFilter, mediaList]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMedia(nextPage);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleAddNew = () => {
    setEditingMedia(null);
    setIsModalOpen(true);
  };

  const handleEdit = (media: Media) => {
    setEditingMedia(media);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return;
    try {
      await mediaService.deleteMedia(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      toast.success('Media deleted successfully!');
    } catch {
      toast.error('Failed to delete media');
    }
  };

  const handleFormSuccess = () => {
    loadMedia(1, true);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <ThreeBackground />

      <main className="container mx-auto px-4 pt-12 pb-12">
        {/* Top actions bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-sm text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{user?.name}</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleAddNew}
              className="gradient-anime text-white hover:opacity-90 transition-smooth"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="glass hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-smooth"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-glow-pulse">
              My Favorite Media
            </h1>
            <p className="text-muted-foreground">Manage your collection of movies and TV shows</p>
          </div>

          {/* Filters */}
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          {/* Media Grid */}
          {isLoading ? (
            <div className="glass-card text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading media...</p>
            </div>
          ) : Array.isArray(filteredMedia) && filteredMedia.length > 0 ? (
            <InfiniteScroll
              dataLength={filteredMedia.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                </div>
              }
              endMessage={
                <p className="text-center text-muted-foreground py-8">
                  You've reached the end! 🎬
                </p>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((media, index) => (
                  <motion.div
                    key={media.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MediaCard
                      {...media}
                      poster={media.imageUrl}
                      onEdit={() => handleEdit(media)}
                      onDelete={() => handleDelete(media.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <div className="glass-card text-center py-16">
              <Film className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No media found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first movie or TV show!'}
              </p>
              <Button
                onClick={handleAddNew}
                className="gradient-anime text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Media
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal */}
      <MediaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSuccess}
        editMedia={editingMedia}
      />
    </div>
  );
}
