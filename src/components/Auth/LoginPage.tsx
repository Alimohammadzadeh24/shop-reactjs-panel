import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Globe, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isRTL = i18n.language === 'fa';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('ورود موفقیت‌آمیز بود');
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || t('auth.invalidCredentials'));
      toast.error('خطا در ورود به سیستم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'fa' ? 'English' : 'فارسی'}
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-primary">
                {t('auth.loginTitle')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('auth.loginSubtitle')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={cn(
                  "text-sm font-medium",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('common.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  disabled={isLoading}
                  className={cn(
                    "transition-all duration-200",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={cn(
                  "text-sm font-medium",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {t('common.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  disabled={isLoading}
                  className={cn(
                    "transition-all duration-200",
                    isRTL ? "text-right" : "text-left"
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('auth.loginButton')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              اطلاعات تست:
            </p>
            <div className="text-xs space-y-1 text-center">
              <div>Admin: admin@example.com / admin123</div>
              <div>Primary: inventory@example.com / inv123</div>
              <div>Secondary: viewer@example.com / view123</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;