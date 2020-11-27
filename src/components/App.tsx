import './less/app.less';

import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import Intro from './Intro';
import Start from './Start';
import GameField from './GameField';

import InjectionError from './helpers/InjectionError';

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
  gameStore?: GameStore;
}

const App: React.FunctionComponent<AppProps> = props => {
  const { gameStore } = props;
  if (!gameStore) {
    throw new InjectionError('Game store');
  }

  const { playing } = gameStore;
  const startGame = () => gameStore.setPlaying(true);

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

export default inject('gameStore')(observer(App));
