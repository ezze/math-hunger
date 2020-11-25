import './less/intro.less';

import React from 'react';

import { Button } from 'antd';

interface IntroProps extends React.HTMLAttributes<HTMLDivElement> {
  close: () => void;
}

const Intro: React.FunctionComponent<IntroProps> = props => {
  const { close } = props;
  return (
    <div className="intro">
      <Button type="primary" size="large" onClick={close}>
        Press a button
      </Button>
    </div>
  );
};

export default Intro;
