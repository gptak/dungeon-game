import Phaser from "phaser";
import { sceneEvents } from "~/events center/EventsCenter";

export default class UI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;

  constructor() {
    super("ui");
  }

  create() {
    const startingHearts = 5; //also need to be changed in controllers/KnightController to work properly
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    const { width, height } = this.scale;
    const goldLabel = this.add.text(width * 0.05, height * 0.07, "0", {
      fontSize: "14px",
    });

    this.hearts.createMultiple({
      key: "ui_heart_full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16,
      },
      quantity: startingHearts,
    });

    sceneEvents.on(
      "knight-hit-points-change",
      this.handleKnightHitPoints,
      this
    );

    sceneEvents.on(
      "knight-gold-change",
      (gold: number) => {
        goldLabel.text = gold.toString();
      },
      this
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("knight-hit-points-change");
      sceneEvents.off("knight-gold-change");
    });
  }

  private handleKnightHitPoints(hitPoints: number) {
    this.hearts.children.each((image, index) => {
      const heart = image as Phaser.GameObjects.Image;
      if (index < hitPoints) {
        heart.setTexture("ui_heart_full");
      } else {
        heart.setTexture("ui_heart_empty");
      }
    });
  }
}
