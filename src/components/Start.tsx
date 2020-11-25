import './less/start.less';

import React from 'react';
import { Space, Button } from 'antd';

import Settings from './Settings';

interface StartProps extends React.HTMLAttributes<HTMLDivElement> {
  start: () => void;
}

const Start: React.FunctionComponent<StartProps> = props => {
  const { start } = props;
  return (
    <div className="start">
      <Space direction="vertical" size="large">
        <div className="start-content">
          <Space size="large">
            <div className="start-pane">
              <Settings />
            </div>
            <div className="start-pane-divider"></div>
            <div className="start-pane">Two</div>
          </Space>
        </div>
        <div className="start-footer">
          <Button type="primary" size="large" danger={true} onClick={start}>
            Start a game
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default Start;
