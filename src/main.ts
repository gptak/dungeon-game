import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Level1 from "./scenes/Level1";
import UI from "./scenes/UI";
import GameOver from "./scenes/GameOver";
import Level2 from "./scenes/Level2";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true
    },
  },
  scene: [Preloader, Level1, UI, GameOver, Level2],
  scale: {
    zoom: 2,
  },
};

export default new Phaser.Game(config);
