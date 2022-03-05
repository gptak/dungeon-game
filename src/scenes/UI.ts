import Phaser from "phaser";

export default class UI extends Phaser.Scene {
  constructor() {
    super("ui");
  }

  create() {
    const hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    hearts.createMultiple({
      key: "ui_heart_full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 15,
      },
      quantity: 3,
    });
  }
}
