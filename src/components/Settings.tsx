import './less/settings.less';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Select, InputNumber, Switch, Tabs, Row, Col } from 'antd';

import {
  durationsAvailable,
  operatorsAvailable,
  maxSumStart,
  maxSumEnd,
  maxSumDefault,
  maxMinuendStart,
  maxMinuendEnd,
  maxMultiplierStart,
  maxMultiplierEnd,
  maxDivisorStart,
  maxDivisorEnd,
  maxQuotientStart,
  maxQuotientEnd,
  challengeConcurrencyStart,
  challengeConcurrencyEnd,
  maxChallengesCountStart,
  maxChallengesCountEnd,
  challengeDurationStart,
  challengeDurationEnd,
  challengeDelayStart,
  challengeDelayEnd
} from '../constants';

import { getOperatorLabel } from '../utils';

import InjectionError from './helpers/InjectionError';

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  settingsStore?: SettingsStore;
}

const Settings: React.FunctionComponent<SettingsProps> = props => {
  const { settingsStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }

  const {
    tab,
    duration,
    operators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient,
    challengeConcurrency,
    maxChallengesCount,
    minChallengeDuration,
    maxChallengeDuration,
    minChallengeDelay,
    maxChallengeDelay,
    sound,
    music
  } = settingsStore;

  const initialValues = {
    duration,
    operators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient,
    challengeConcurrency,
    maxChallengesCount,
    minChallengeDuration,
    maxChallengeDuration,
    minChallengeDelay,
    maxChallengeDelay,
    sound,
    music
  };

  const onTabChange = (tab: string) => {
    settingsStore.setTab(tab as SettingsTab);
  };

  const onDurationChange = (duration: number) => {
    settingsStore.setDuration(duration);
  };

  const onOperatorsChange = (operators: Array<Operator>) => {
    settingsStore.setOperators(operators);
  };

  const onSoundChange = (sound: boolean) => {
    settingsStore.setSound(sound);
  };

  const onMusicChange = (music: boolean) => {
    settingsStore.setMusic(music);
  };

  const createOnNumberInputChange = (name: string): (value: number | string | undefined) => void => {
    return (value: number | string | undefined) => {
      (settingsStore as any)[name](typeof value === 'number' ? value : maxSumDefault);
    };
  };

  const onMaxSumChange = createOnNumberInputChange('setMaxSum');
  const onMaxMinuendChange = createOnNumberInputChange('setMaxMinuend');
  const onMaxMultiplier1Change = createOnNumberInputChange('setMaxMultiplier1');
  const onMaxMultiplier2Change = createOnNumberInputChange('setMaxMultiplier2');
  const onMaxDivisorChange = createOnNumberInputChange('setMaxDivisor');
  const onMaxQuotientChange = createOnNumberInputChange('setMaxQuotient');
  const onChallengeConcurrencyChange = createOnNumberInputChange('setChallengeConcurrency');
  const onMaxChallengesCountChange = createOnNumberInputChange('setMaxChallengesCount');
  const onMinChallengeDurationChange = createOnNumberInputChange('setMinChallengeDuration');
  const onMaxChallengeDurationChange = createOnNumberInputChange('setMaxChallengeDuration');
  const onMinChallengeDelayChange = createOnNumberInputChange('setMinChallengeDelay');
  const onMaxChallengeDelayChange = createOnNumberInputChange('setMaxChallengeDelay');

  return (
    <div className="settings">
      <Form name="settings" layout="vertical" initialValues={initialValues} requiredMark={false}>
        <Tabs defaultActiveKey={tab} onChange={onTabChange}>
          <Tabs.TabPane key="basic" tab="Basic">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Game duration, min"
                  name="duration"
                  rules={[{ required: true }]}
                >
                  <Select onChange={onDurationChange}>
                    {durationsAvailable.map(duration => (
                      <Select.Option key={duration} value={duration}>{duration}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tracks"
                  name="maxChallengesCount"
                >
                  <InputNumber
                    type="number"
                    min={maxChallengesCountStart}
                    max={maxChallengesCountEnd}
                    onChange={onMaxChallengesCountChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Concurrency"
                  name="challengeConcurrency"
                >
                  <InputNumber
                    type="number"
                    min={challengeConcurrencyStart}
                    max={Math.min(maxChallengesCount, challengeConcurrencyEnd)}
                    onChange={onChallengeConcurrencyChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Min question duration, sec"
                  name="minChallengeDuration"
                >
                  <InputNumber
                    type="number"
                    min={challengeDurationStart}
                    max={Math.min(maxChallengeDuration, challengeDurationEnd)}
                    onChange={onMinChallengeDurationChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max question duration, sec"
                  name="maxChallengeDuration"
                >
                  <InputNumber
                    type="number"
                    min={Math.max(minChallengeDuration, challengeDurationStart)}
                    max={challengeDurationEnd}
                    onChange={onMaxChallengeDurationChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Min question delay, sec"
                  name="minChallengeDelay"
                >
                  <InputNumber
                    type="number"
                    min={challengeDelayStart}
                    max={Math.min(maxChallengeDelay, challengeDelayEnd)}
                    onChange={onMinChallengeDelayChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max question delay, sec"
                  name="maxChallengeDelay"
                >
                  <InputNumber
                    type="number"
                    min={Math.max(minChallengeDelay, challengeDelayStart)}
                    max={challengeDelayEnd}
                    onChange={onMaxChallengeDelayChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key="math" tab="Math">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Operators"
                  name="operators"
                >
                  <Select mode="multiple" allowClear={false} onChange={onOperatorsChange}>
                    {operatorsAvailable.map(operator => (
                      <Select.Option key={operator} value={operator}>{getOperatorLabel(operator)}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max sum"
                  name="maxSum"
                >
                  <InputNumber
                    type="number"
                    min={maxSumStart}
                    max={maxSumEnd}
                    disabled={!operators.includes('add')}
                    onChange={onMaxSumChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max minuend"
                  name="maxMinuend"
                >
                  <InputNumber
                    type="number"
                    min={maxMinuendStart}
                    max={maxMinuendEnd}
                    disabled={!operators.includes('subtract')}
                    onChange={onMaxMinuendChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max multiplier 1"
                  name="maxMultiplier1"
                >
                  <InputNumber
                    type="number"
                    min={maxMultiplierStart}
                    max={maxMultiplierEnd}
                    disabled={!operators.includes('multiply')}
                    onChange={onMaxMultiplier1Change}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max multiplier 2"
                  name="maxMultiplier2"
                >
                  <InputNumber
                    type="number"
                    min={maxMultiplierStart}
                    max={maxMultiplierEnd}
                    disabled={!operators.includes('multiply')}
                    onChange={onMaxMultiplier2Change}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max divisor"
                  name="maxDivisor"
                >
                  <InputNumber
                    type="number"
                    min={maxDivisorStart}
                    max={maxDivisorEnd}
                    disabled={!operators.includes('divide')}
                    onChange={onMaxDivisorChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max quotient"
                  name="maxQuotient"
                >
                  <InputNumber
                    type="number"
                    min={maxQuotientStart}
                    max={maxQuotientEnd}
                    disabled={!operators.includes('divide')}
                    onChange={onMaxQuotientChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key="misc" tab="Misc">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Sound" name="sound" valuePropName="checked">
                  <Switch onChange={onSoundChange} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Music" name="music" valuePropName="checked">
                  <Switch onChange={onMusicChange} />
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

export default inject('settingsStore')(observer(Settings));
