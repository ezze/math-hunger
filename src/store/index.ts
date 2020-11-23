import GameStore from './GameStore';

function createStores() {
  return {
    game: new GameStore({ key: 'game' })
  };
}

export {
  createStores
};
