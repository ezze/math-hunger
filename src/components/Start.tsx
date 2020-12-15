import './less/start.less';

import React from 'react';
import { Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import AppTitle from './AppTitle';

import Settings from './Settings';
import BestResults from './BestResults';

interface StartProps extends React.HTMLAttributes<HTMLDivElement> {
  start: () => void;
  canBeStarted: boolean;
}

const Start: React.FunctionComponent<StartProps> = props => {
  const { t } = useTranslation('start');
  const { start, canBeStarted } = props;
  return (
    <div className="start">
      <Space direction="vertical" size="large">
        <AppTitle />
        <div className="start-content">
          <div className="start-pane">
            <h2>{t('settings')}</h2>
            <Settings />
          </div>
          <div className="start-pane-divider"></div>
          <div className="start-pane">
            <h2>{t('best-results')}</h2>
            <BestResults />
          </div>
        </div>
        <div className="start-footer">
          <Button type="primary" size="large" danger={true} disabled={!canBeStarted} onClick={start}>
            {t('start-the-game')}
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default Start;
