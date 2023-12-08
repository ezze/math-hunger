import './less/app.less';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { usePrevious } from '../utils';
import { playMusic } from '../audio/music';

import Intro from './Intro';
import Start from './Start';
import GameField from './GameField';
import GameOver from './GameOver';

import { useStoresContext } from '../store/utils';

const App = observer(() => {
  const { settingsStore, gameStore } = useStoresContext();

  const { duration } = settingsStore;
  const { playing, gameOver } = gameStore;
  const start = () => gameStore.start(duration);
  const canBeStarted = (
    settingsStore.operators.length > 0 &&
    settingsStore.minChallengeDuration <= settingsStore.maxChallengeDuration &&
    settingsStore.minChallengeDelay <= settingsStore.maxChallengeDelay
  );

  const [intro, setIntro] = useState(true);
  const prevIntro = usePrevious(intro);
  useEffect(() => {
    if (prevIntro && !intro) {
      if (settingsStore.music) {
        playMusic(settingsStore.animationType).catch(e => console.error(e));
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
});

export default App;
