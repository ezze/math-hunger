import './less/app.less';

import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';

import { usePrevious } from '../utils';
import { playMusic } from '../sound';

import Intro from './Intro';
import Start from './Start';
import GameField from './GameField';
import GameOver from './GameOver';

import InjectionError from './helpers/InjectionError';

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
  settingsStore?: SettingsStore;
  gameStore?: GameStore;
}

const App: React.FunctionComponent<AppProps> = props => {
  const { settingsStore, gameStore } = props;
  if (!settingsStore) {
    throw new InjectionError('Settings store');
  }
  if (!gameStore) {
    throw new InjectionError('Game store');
  }

  const { duration } = settingsStore;
  const { playing, gameOver } = gameStore;
  const start = () => gameStore.start(duration);
  const canBeStarted = settingsStore.operators.length > 0;

  const [intro, setIntro] = useState(true);
  const prevIntro = usePrevious(intro);
  useEffect(() => {
    if (prevIntro && !intro) {
      if (settingsStore.music) {
        playMusic().catch(e => console.error(e));
      }
    }
  });

  let content;
  if (intro) {
    const closeIntro = () => setIntro(false);
    content = (
      <Intro close={closeIntro} />
    );
  }
  else if (!playing) {
    if (gameOver) {
      content = (
        <GameOver />
      );
    }
    else {
      content = (
        <Start start={start} canBeStarted={canBeStarted}/>
      );
    }
  }
  else {
    content = (
      <GameField />
    );
  }

  return (
    <div className="app">
      {content}
    </div>
  );
};

export default inject('settingsStore', 'gameStore')(observer(App));
