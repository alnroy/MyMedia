import { Film, LogOut, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavbarProps {
  user?: { name: string };
  onLogout?: () => void;
  onAddNew?: () => void;
}

export default function Navbar({ user, onLogout, onAddNew }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <div className="glass-card flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-anime">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MyMedia
          </span>
        </div>

        {/* Actions */}
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, <span className="font-semibold text-foreground">{user.name}</span>
            </span>
            
            {onAddNew && (
              <Button
                onClick={onAddNew}
                className="gradient-anime text-white hover:opacity-90 transition-smooth"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
            >
              <User className="w-5 h-5" />
            </Button>

            {onLogout && (
              <Button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
