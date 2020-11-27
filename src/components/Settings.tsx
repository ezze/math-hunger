import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Select } from 'antd';

import { durations } from '../constants';

import InjectionError from './helpers/InjectionError';

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  settingsStore?: SettingsStore;
}

const Settings: React.FunctionComponent<SettingsProps> = props => {
  const { settingsStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }

  const { duration } = settingsStore;
  const onDurationChange = (duration: number) => {
    settingsStore.setDuration(duration);
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

export default inject('settingsStore')(observer(Settings));
