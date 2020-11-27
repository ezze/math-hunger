import './less/intro.less';

import React from 'react';
import { Space } from 'antd';

import { Button } from 'antd';

interface IntroProps extends React.HTMLAttributes<HTMLDivElement> {
  close: () => void;
}

const Intro: React.FunctionComponent<IntroProps> = props => {
  const { close } = props;
  return (
    <div className="intro">
      <Space direction="vertical">
        <div className="intro-title">
          Math Hunger
        </div>
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
