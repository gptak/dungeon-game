import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  create() {
    const mainText = "Game Over";
    const secondaryText = "Click anywhere to play again";

    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.45, mainText, {
        fontSize: "28px",
        color: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(width * 0.5, height * 0.55, secondaryText, {
        fontSize: "12px",
        color: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("game");
    });
  }
}
