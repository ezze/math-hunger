import './less/intro.less';

import React from 'react';
import { Space, Button } from 'antd';

import AppTitle from './AppTitle';

interface IntroProps extends React.HTMLAttributes<HTMLDivElement> {
  close: () => void;
}

const Intro: React.FunctionComponent<IntroProps> = props => {
  const { close } = props;
  return (
    <div className="intro">
      <Space direction="vertical">
        <AppTitle />
        <div className="intro-logo" />
        <div className="intro-buttons">
          <Button type="primary" size="large" onClick={close}>
            Press the button
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default Intro;
