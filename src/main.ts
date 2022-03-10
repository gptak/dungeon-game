import Phaser from "phaser";

import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true
    },
  },
  scene: [Preloader, Game],
  scale: {
    zoom: 2,
  },
};

export default new Phaser.Game(config);
