import Phaser from "phaser";
import { sceneEvents } from "~/events center/EventsCenter";

export default class UI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  constructor() {
    super("UI");
  }

  create() {
    const startingHearts = 5;

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
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

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("knight-hit-points-change");
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
