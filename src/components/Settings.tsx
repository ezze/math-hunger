import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Select } from 'antd';

import GameStore from '../store/GameStore';
import { durations } from '../constants';

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  gameStore?: GameStore;
}

const Settings: React.FunctionComponent<SettingsProps> = props => {
  const { gameStore } = props;
  if (!gameStore) {
    throw new TypeError('Game store is not passed.');
  }

  const { duration } = gameStore;
  const onDurationChange = (duration: number) => {
    gameStore.setDuration(duration);
  };

  const initialValues = {
    duration
  };

  return (
    <div className="settings">
      <Form name="settings" initialValues={initialValues}>
        <Form.Item
          label="Duration, minutes"
          name="duration"
          rules={[{ required: true }]}
        >
          <Select onChange={onDurationChange}>
            {durations.map(duration => (
              <Select.Option key={duration} value={duration}>{duration}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default inject('gameStore')(observer(Settings));
