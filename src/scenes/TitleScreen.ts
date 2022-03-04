import Phaser from "phaser";

export default class TitleScreen extends Phaser.Scene {
  preload() {}
  create() {
    const text = this.add.text(400, 300, "Hello!");
    text.setOrigin(0.5, 0.5);
  }
}
