import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import TitleScreen from "./scenes/TitleScreen";
import Game from "./scenes/Game";
import UI from "./scenes/UI";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
      
    },
    
  },
  scene: [Preloader, Game, UI],
  scale: { zoom: 2 },
});
