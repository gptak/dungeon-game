import Phaser from "phaser";

import { sceneEvents } from "~/events/EventsCenter";
export default class UI extends Phaser.Scene {
  private _hearts!: Phaser.GameObjects.Group;

  constructor() {
    super("ui");
  }

  create() {
    this._hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this._hearts.createMultiple({
      key: "ui_heart_full",
      setXY: {
        x: 10,
        y: 10,
        stepX: 15,
      },
      quantity: 5,
    });

    sceneEvents.on("player-damage", this.handlePlayerHealthLose, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("player-damage", this.handlePlayerHealthLose, this);
    });
  }

  private handlePlayerHealthLose(health: number) {
    this._hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image;
      if (idx < health) {
        heart.setTexture("ui_heart_full");
      } else {
        heart.setTexture("ui_heart_empty");
      }
    });
  }
}
