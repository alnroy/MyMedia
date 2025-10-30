import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Media } from "@/types";
import { mediaService } from "@/services/mediaService";
import { toast } from "sonner";

interface MediaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMedia?: Media | null;
}

export default function MediaFormModal({
  isOpen,
  onClose,
  onSuccess,
  editMedia,
}: MediaFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    type: "Movie",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  useEffect(() => {
    if (editMedia) {
      setFormData({
        title: editMedia.title,
        type: editMedia.type,
        director: editMedia.director,
        budget: editMedia.budget || "",
        location: editMedia.location || "",
        duration: editMedia.duration || "",
        year: editMedia.year || "",
      });

      // ✅ Use correct preview field from backend
      setPosterPreview(editMedia.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editMedia, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
    });
    setPosterFile(null);
    setPosterPreview("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("director", formData.director);
      data.append("budget", formData.budget);
      data.append("location", formData.location);
      data.append("duration", formData.duration);
      data.append("year", formData.year);

      // ✅ Append image only if user uploaded one
      if (posterFile) data.append("poster", posterFile);

      if (editMedia) {
        await mediaService.updateMedia(editMedia.id, data);
        toast.success("Media updated successfully!");
      } else {
        await mediaService.createMedia(data);
        toast.success("Media added successfully!");
      }

      onSuccess(); // refresh dashboard list
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to save media");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative glass-card neon-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary/20">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {editMedia ? "Edit Media" : "Add New Media"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Poster Upload */}
            <div className="space-y-2">
              <Label>Poster Image</Label>
              <div className="flex gap-4">
                {posterPreview && (
                  <div className="relative w-32 h-48 rounded-xl overflow-hidden border-2 border-primary/20">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="glass border-2 border-dashed border-primary/30 rounded-xl p-8 hover:border-primary/60 transition-smooth text-center">
                    {posterPreview ? (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to change poster
                        </p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-foreground font-medium">
                          Upload poster
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="glass border-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="glass border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="Movie">Movie</SelectItem>
                    <SelectItem value="TV Show">TV Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="director">
                  Director <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                  className="glass border-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="e.g. 2010"
                  className="glass border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="e.g. $160M"
                  className="glass border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 148 min"
                  className="glass border-primary/20"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Paris, France"
                  className="glass border-primary/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 glass hover:bg-muted/50"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-anime text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editMedia ? "Update" : "Add Media"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
