import './less/best-results.less';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';

import InjectionError from './helpers/InjectionError';

interface BestResultsProps {
  settingsStore?: SettingsStore;
  bestResultsStore?: BestResultsStore;
}

const BestResults = (props: BestResultsProps) => {
  const { settingsStore, bestResultsStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }
  if (!bestResultsStore) {
    throw new InjectionError('Best results store');
  }

  const { t } = useTranslation('best-results');

  const { hash } = settingsStore;
  const { bestResults } = bestResultsStore;

  const dataSource = (bestResults[hash] || []).map((bestResult: BestResult, i: number) => {
    const { name, score, time, correctCount, wrongCount, missedCount } = bestResult;
    const dateArray = time.toString().replace(/T.+$/, '').split('-');
    return {
      key: i,
      number: i + 1,
      date: `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`,
      name,
      score,
      stats: `${correctCount}-${wrongCount}-${missedCount}`
    };
  });

  const columns: ColumnsType<{
    number: number;
    name: string;
    date: string;
    score: number;
    stats: string;
  }> = [{
    key: 'number',
    title: '№',
    dataIndex: 'number',
    className: 'best-results-number',
    align: 'right'
  }, {
    key: 'name',
    title: t('name'),
    dataIndex: 'name',
    className: 'best-results-name'
  }, {
    key: 'date',
    title: t('date'),
    dataIndex: 'date',
    className: 'best-result-date',
    align: 'center'
  }, {
    key: 'stats',
    title: t('stats'),
    dataIndex: 'stats',
    className: 'best-results-stats',
    align: 'right'
  }, {
    key: 'score',
    title: t('score'),
    dataIndex: 'score',
    className: 'best-results-score',
    align: 'right'
  }];

  return (
    <div className="best-results">
      {dataSource.length > 0 ? (
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered={true} size="small" />
      ) : (
        <div className="best-results-nothing">
          {t('no-results')}
        </div>
      )}
    </div>
  );
};

export default inject('settingsStore', 'bestResultsStore')(observer(BestResults));
