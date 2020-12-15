import './less/settings.less';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Select, InputNumber, Switch, Tabs, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  durationsAvailable,
  operatorsAvailable,
  maxSumStart,
  maxSumEnd,
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

import InjectionError from './helpers/InjectionError';

import { languages } from '../constants';

interface SettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  settingsStore?: SettingsStore;
}

const Settings: React.FunctionComponent<SettingsProps> = props => {
  const { settingsStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }

  const { t } = useTranslation(['settings', 'language']);

  const {
    tab,
    language,
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
    language,
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
      if (typeof value === 'number') {
        (settingsStore as any)[name](value);
      }
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

  const onLanguageChange = (language: string) => {
    settingsStore.setLanguage(language);
  };

  return (
    <div className="settings">
      <Form name="settings" layout="vertical" initialValues={initialValues} requiredMark={false}>
        <Tabs defaultActiveKey={tab} onChange={onTabChange}>
          <Tabs.TabPane key="basic" tab={t('basic')}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={t('game-duration')}
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
                  label={t('max-challenges-count')}
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
                  label={t('concurrency')}
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
                  label={t('min-challenge-duration')}
                  name="minChallengeDuration"
                >
                  <InputNumber
                    type="number"
                    min={challengeDurationStart}
                    max={challengeDurationEnd}
                    onChange={onMinChallengeDurationChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('max-challenge-duration')}
                  name="maxChallengeDuration"
                >
                  <InputNumber
                    type="number"
                    min={challengeDurationStart}
                    max={challengeDurationEnd}
                    onChange={onMaxChallengeDurationChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('min-challenge-delay')}
                  name="minChallengeDelay"
                >
                  <InputNumber
                    type="number"
                    min={challengeDelayStart}
                    max={challengeDelayEnd}
                    onChange={onMinChallengeDelayChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('max-challenge-delay')}
                  name="maxChallengeDelay"
                >
                  <InputNumber
                    type="number"
                    min={challengeDelayStart}
                    max={challengeDelayEnd}
                    onChange={onMaxChallengeDelayChange}
                  >
                  </InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key="math" tab={t('math')}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={t('operators')}
                  name="operators"
                >
                  <Select mode="multiple" allowClear={false} onChange={onOperatorsChange}>
                    {operatorsAvailable.map(operator => (
                      <Select.Option key={operator} value={operator}>{t(`operator:${operator}`)}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('max-sum')}
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
                  label={t('max-minuend')}
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
                  label={t('max-multiplier-1')}
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
                  label={t('max-multiplier-2')}
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
                  label={t('max-divisor')}
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
                  label={t('max-quotient')}
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
          <Tabs.TabPane key="misc" tab={t('misc')}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={t('language')}
                  name="language"
                  rules={[{ required: true }]}
                >
                  <Select onChange={onLanguageChange}>
                    {languages.map(language => (
                      <Select.Option key={language} value={language}>{t(`language:${language}`)}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('sound')} name="sound" valuePropName="checked">
                  <Switch onChange={onSoundChange} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('music')} name="music" valuePropName="checked">
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
