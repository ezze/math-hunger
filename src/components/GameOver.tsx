import './less/game-over.less';

import React, { ChangeEvent, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Space, Table, Form, Input, Button, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

import InjectionError from './helpers/InjectionError';

interface GameOverProps {
  settingsStore?: SettingsStore;
  gameStore?: GameStore;
  bestResultsStore?: BestResultsStore;
}

const GameOver = (props: GameOverProps) => {
  const { settingsStore, gameStore, bestResultsStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }
  if (!gameStore) {
    throw new InjectionError('Game store');
  }
  if (!bestResultsStore) {
    throw new InjectionError('Best results store');
  }

  const { lastResult } = gameStore;
  if (!lastResult) {
    throw new TypeError('Last result is not set');
  }

  const {
    correctCount,
    wrongCount,
    missedCount,
    score,
    incorrectItems
  } = lastResult;

  const { t } = useTranslation('game-over');

  const dataSource = [{
    label: t('score'),
    value: score,
    key: 'score'
  }, {
    label: t('correct'),
    value: correctCount,
    key: 'correct'
  }, {
    label: t('wrong'),
    value: wrongCount,
    key: 'wrong'
  }, {
    label: t('missed'),
    value: missedCount,
    key: 'missed'
  }];

  const columns = [{
    dataIndex: 'label',
    key: 'label',
    className: 'game-over-column game-over-column-label'
  }, {
    dataIndex: 'value',
    key: 'value',
    className: 'game-over-column game-over-column-value'
  }];

  const [name, setName] = useState(bestResultsStore.name);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onNameSubmit = () => {
    bestResultsStore.setName(name);
    bestResultsStore.add(settingsStore.hash, {
      ...lastResult,
      name
    });
    gameStore.finish();
  };

  const initialValues = { name };

  const incorrectList = incorrectItems.length > 0 ? (
    <div className="game-over-incorrect">
      <h3>{t('incorrect-list')}</h3>
      <Row gutter={24}>
        {incorrectItems.map((item, index) => (
          <Col key={index} span={8}>
            <div className={`game-over-incorrect-item game-over-incorrect-item-${item.type}`}>
              {item.operation}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  ) : '';

  return (
    <div className="game-over">
      <Space direction="vertical" size="large">
        <div className="game-over-title">{t('game-over')}</div>
        <div className="game-over-name">
          <Form name="game-over" layout="inline" initialValues={initialValues} onSubmitCapture={onNameSubmit}>
            <Form.Item name="name">
              <Input onChange={onNameChange} placeholder={t('input-your-name')} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onSubmit={onNameSubmit} onClick={onNameSubmit} disabled={!name.trim()}>
                {t('enter')}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowClassName={(record) => `game-over-row game-over-row-${record.key}`}
          showHeader={false}
          bordered={true}
          pagination={false}
        />
        {incorrectList}
      </Space>
    </div>
  );
};

export default inject('settingsStore', 'gameStore', 'bestResultsStore')(observer(GameOver));
