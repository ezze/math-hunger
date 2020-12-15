import React from 'react';
import { useTranslation } from 'react-i18next';

const AppTitle: React.FunctionComponent = () => {
  const { t } = useTranslation('app');
  return (
    <div className="app-title">
      <div className="app-title-name">{t('name')}</div>
      <div className="app-title-version">v{appVersion}</div>
    </div>
  );
};

export default AppTitle;
