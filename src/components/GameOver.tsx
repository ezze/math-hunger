import './less/game-over.less';

import React, { ChangeEvent, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Space, Table, Form, Input, Button } from 'antd';

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
    score
  } = lastResult;

  const dataSource = [{
    label: 'Score',
    value: score,
    key: 'score'
  }, {
    label: 'Correct count',
    value: correctCount,
    key: 'correntCount'
  }, {
    label: 'Wrong count',
    value: wrongCount,
    key: 'wrongCount'
  }, {
    label: 'Missed count',
    value: missedCount,
    key: 'missedCount'
  }];

  const columns = [{
    dataIndex: 'label',
    key: 'label'
  }, {
    dataIndex: 'value',
    key: 'value'
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

  const initialValues = {
    name
  };

  return (
    <div className="game-over">
      <Space direction="vertical" size="large">
        <div className="game-over-title">Game over</div>
        <div className="game-over-name">
          <Form name="game-over" layout="inline" initialValues={initialValues} onSubmitCapture={onNameSubmit}>
            <Form.Item
              name="name"
            >
              <Input onChange={onNameChange} placeholder="Input your name..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onSubmit={onNameSubmit} onClick={onNameSubmit} disabled={!name.trim()}>
                Enter
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table dataSource={dataSource} columns={columns} showHeader={false} bordered={true} pagination={false} />
      </Space>
    </div>
  );
};

export default inject('settingsStore', 'gameStore', 'bestResultsStore')(observer(GameOver));