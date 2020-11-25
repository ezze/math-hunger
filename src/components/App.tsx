import './less/app.less';

import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import Intro from './Intro';
import Start from './Start';

import GameStore from '../store/GameStore';

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
  gameStore?: GameStore;
}

const App: React.FunctionComponent<AppProps> = props => {
  const { gameStore } = props;
  if (!gameStore) {
    throw new TypeError('Game store is not passed.');
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
    content = '';
  }

  return (
    <div className="app">
      {content}
    </div>
  );
};

export default inject('gameStore')(observer(App));
