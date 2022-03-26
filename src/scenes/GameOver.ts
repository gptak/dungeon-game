import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  private mainText = "Game Over";
  private secondaryText = "Click anywhere to try again";

  create() {
    const { width, height } = this.scale;
    this.add
      .text(width * 0.5, height * 0.45, this.mainText, {
        fontSize: "24px",
        color: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(width * 0.5, height * 0.55, this.secondaryText, {
        fontSize: "12px",
        color: "#fff",
        strokeThickness: 1,
      })
      .setOrigin(0.5, 0.5);
  }
}
