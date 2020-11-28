import './less/settings.less';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Select, InputNumber, Row, Col } from 'antd';

import {
  durationsAvailable,
  operatorsAvailable,
  maxSumStart,
  maxSumEnd,
  maxSumDefault,
  maxMinuendStart,
  maxMinuendEnd,
  maxMinuendDefault,
  maxMultiplierStart,
  maxMultiplierEnd,
  maxMultiplierDefault,
  maxDivisorStart,
  maxDivisorEnd,
  maxDivisorDefault,
  maxQuotientStart,
  maxQuotientEnd,
  maxQuotientDefault
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
    duration,
    operators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient
  } = settingsStore;

  const initialValues = {
    duration,
    operators,
    maxSum,
    maxMinuend,
    maxMultiplier1,
    maxMultiplier2,
    maxDivisor,
    maxQuotient
  };

  const onDurationChange = (duration: number) => {
    settingsStore.setDuration(duration);
  };

  const onOperatorsChange = (operators: Array<Operator>) => {
    settingsStore.setOperators(operators);
  };

  const onMaxSumChange = (maxSum: number | string | undefined) => {
    settingsStore.setMaxSum(typeof maxSum === 'number' ? maxSum : maxSumDefault);
  };

  const onMaxMinuendChange = (maxMinuend: number | string | undefined) => {
    settingsStore.setMaxMinuend(typeof maxMinuend === 'number' ? maxMinuend : maxMinuendDefault);
  };

  const onMaxMultiplier1Change = (maxMultiplier1: number | string | undefined) => {
    settingsStore.setMaxMultiplier1(typeof maxMultiplier1 === 'number' ? maxMultiplier1 : maxMultiplierDefault);
  };

  const onMaxMultiplier2Change = (maxMultiplier2: number | string | undefined) => {
    settingsStore.setMaxMultiplier2(typeof maxMultiplier2 === 'number' ? maxMultiplier2 : maxMultiplierDefault);
  };

  const onMaxDivisorChange = (maxDivisor: number | string | undefined) => {
    settingsStore.setMaxDivisor(typeof maxDivisor === 'number' ? maxDivisor : maxDivisorDefault);
  };

  const onMaxQuotientChange = (maxQuotient: number | string | undefined) => {
    settingsStore.setMaxQuotient(typeof maxQuotient === 'number' ? maxQuotient : maxQuotientDefault);
  };

  return (
    <div className="settings">
      <Form layout="vertical" name="settings" initialValues={initialValues} requiredMark={false}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Duration, min"
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
      </Form>
    </div>
  );
};

export default inject('settingsStore')(observer(Settings));
