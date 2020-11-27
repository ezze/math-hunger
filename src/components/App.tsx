import './less/app.less';

import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import Intro from './Intro';
import Start from './Start';
import GameField from './GameField';

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
  const { playing } = gameStore;
  const startGame = () => gameStore.start(duration);

  const [intro, setIntro] = useState(true);

  let content;
  if (intro) {
    const closeIntro = () => setIntro(false);
    content = (
      <Intro close={closeIntro} />
    );
  }
  else if (!playing) {
    content = (
      <Start start={startGame} />
    );
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
