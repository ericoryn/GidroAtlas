import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!username.trim()) {
      setError('Введите имя пользователя');
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);

    if (success) {
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в систему GidroAtlas',
      });
      navigate('/');
    } else {
      setError('Неверное имя пользователя или пароль');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl water-gradient mb-4 shadow-lg">
            <Droplets className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">GidroAtlas</h1>
          <p className="text-muted-foreground">Водные ресурсы Казахстана</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center">
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Введите данные для доступа к экспертным функциям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Вход...
                  </span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Войти
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Демо-доступ для тестирования:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-muted">
                  <p className="font-medium">Эксперт</p>
                  <p className="text-muted-foreground">expert / expert123</p>
                </div>

              </div>
            </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                Продолжить как гость
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
