import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Level1 from "./scenes/Level1";
import UI from "./scenes/UI";
import GameOver from "./scenes/GameOver";
import Level2 from "./scenes/Level2";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: "game-container",
    width: 400,
    height: 300,
    zoom: 2,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true
    },
  },
  scene: [Preloader, Level1, UI, GameOver, Level2],
};

export default new Phaser.Game(config);
