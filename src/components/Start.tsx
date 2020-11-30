import './less/start.less';

import React from 'react';
import { Space, Button } from 'antd';

import AppTitle from './AppTitle';

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
        <AppTitle />
        <div className="start-content">
          <div className="start-pane">
            <h2>Settings</h2>
            <Settings />
          </div>
          <div className="start-pane-divider"></div>
          <div className="start-pane">
            <h2>Best results</h2>
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
