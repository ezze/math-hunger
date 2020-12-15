import './less/intro.less';

import React from 'react';
import { Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import AppTitle from './AppTitle';

interface IntroProps extends React.HTMLAttributes<HTMLDivElement> {
  close: () => void;
}

const Intro: React.FunctionComponent<IntroProps> = props => {
  const { t } = useTranslation('intro');
  const { close } = props;
  return (
    <div className="intro">
      <div className="intro-inner">
        <Space direction="vertical">
          <AppTitle />
          <div className="intro-logo" />
          <div className="intro-buttons">
            <Button type="primary" size="large" onClick={close}>
              {t('press-the-button')}
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Intro;
