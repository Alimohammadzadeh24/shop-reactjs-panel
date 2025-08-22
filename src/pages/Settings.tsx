import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('navigation.settings')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            این بخش به زودی تکمیل می‌شود.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;


