import './less/start.less';

import React from 'react';
import { Space, Button } from 'antd';

import Settings from './Settings';
import BestResults from './BestResults';

interface StartProps extends React.HTMLAttributes<HTMLDivElement> {
  start: () => void;
  canBeStarted: boolean;
}

const Start: React.FunctionComponent<StartProps> = props => {
  const { start, canBeStarted } = props;
  return (
    <div className="start">
      <Space direction="vertical" size="large">
        <div className="start-title">
          Math Hunger
        </div>
        <div className="start-content">
          <div className="start-pane">
            <Settings />
          </div>
          <div className="start-pane-divider"></div>
          <div className="start-pane">
            <BestResults />
          </div>
        </div>
        <div className="start-footer">
          <Button type="primary" size="large" danger={true} disabled={!canBeStarted} onClick={start}>
            Start the game
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default Start;
