import { Droplets, LogIn, LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, logout, isFilterPanelOpen, setFilterPanelOpen } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="h-16 header-gradient text-primary-foreground flex items-center justify-between px-4 lg:px-6 shadow-lg z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => setFilterPanelOpen(!isFilterPanelOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Droplets className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight">GidroAtlas</h1>
            <p className="text-xs text-primary-foreground/70">Водные ресурсы Казахстана</p>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-primary-foreground hover:bg-primary-foreground/10",
              location.pathname === '/dashboard' && "bg-primary-foreground/20"
            )}
            onClick={() => navigate('/dashboard')}
          >
            Приоритеты
          </Button>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-foreground/10">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.username}</span>
              <span className="text-xs px-2 py-0.5 bg-primary-foreground/20 rounded-full">
                {user.role === 'expert' ? 'Эксперт' : 'Гость'}
              </span>
            </div>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAuth}
            className="gap-2"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Войти</span>
              </>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
