import Phaser from "phaser";
import { sceneEvents } from "~/events center/EventsCenter";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  private mainText = "Game Over";

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.45, this.mainText, {
        fontSize: "28px",
        color: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);

    const button = this.add
      .rectangle(width * 0.5, height * 0.6, 100, 50, 0xffffff)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        this.scene.start("game");
      });

    this.add
      .text(button.x, button.y, "Play Again", {
        color: "#000000",
      })
      .setOrigin(0.5);
  }
}
