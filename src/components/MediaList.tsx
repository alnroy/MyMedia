import { useState, useEffect } from "react";
import MediaCard from "./MediaCard";
import MediaFormModal from "./MediaFormModal";
import { mediaService } from "@/services/mediaService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MediaList() {
  const [media, setMedia] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

const fetchMedia = async (pageNum = 1) => {
  if (loading) return;
  setLoading(true);
  try {
    const params = { page: pageNum, limit: 10 };
  const response = await mediaService.getMedia(params);
const fetched = response?.data || []; // adjust for your backend response shape

if (fetched.length === 0) setHasMore(false);
else setMedia((prev) => [...prev, ...fetched]);

  } catch {
    toast.error("Failed to load media");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMedia();
  }, []);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        fetchMedia(page + 1);
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    await mediaService.deleteMedia(id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    toast.success("Deleted successfully!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Favorite Movies & Shows
        </h1>
        <Button
          className="gradient-anime text-white"
          onClick={() => {
            setEditing(null);
            setIsModalOpen(true);
          }}
        >
          + Add New
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((m) => (
          <MediaCard
              key={m.id}
              {...m}
              poster={m.imageUrl} // ✅ ensures the image shows in the card
              onEdit={() => {
                setEditing(m);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(m.id)}
            />
        ))}
      </div>

      {loading && <p className="text-center text-muted-foreground mt-6">Loading more...</p>}

      <MediaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setMedia([]);
          setPage(1);
          fetchMedia(1);
        }}
        editMedia={editing}
      />
    </div>
  );
}
