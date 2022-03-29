import Phaser from "phaser";
import { sceneEvents } from "~/events center/EventsCenter";

export default class UI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;

  private hitPoints = 5;
  private gold = 0;

  constructor() {
    super("ui");
  }

  create() {
    const startingHearts = 5;
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

    //events listeners
    sceneEvents.on("knight-hit", this.handleKnightHitPoints, this);

    sceneEvents.on(
      "mob-dead",
      (gold: number) => {
        this.gold += gold;
        goldLabel.text = this.gold.toString();
      },
      this
    );

    sceneEvents.on(
      "restart",
      () => {
        this.hitPoints = 5;
        this.gold = 0;
        this.hearts.children.each((image) => {
          const heart = image as Phaser.GameObjects.Image;
          heart.setTexture("ui_heart_full");
        });
      },
      this
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("knight-hit-points-change");
      sceneEvents.off("mob-dead");
    });
  }

  //events handlers
  private handleKnightHitPoints(dir: Phaser.Math.Vector2, dmg: number) {
    this.hitPoints = this.hitPoints - dmg;
    console.log(this.hitPoints);

    this.hearts.children.each((image, index) => {
      console.log("sprawdzam");
      const heart = image as Phaser.GameObjects.Image;
      if (index < this.hitPoints) {
        heart.setTexture("ui_heart_full");
      } else {
        heart.setTexture("ui_heart_empty");
      }
    });

    if (this.hitPoints > 0) {
      sceneEvents.emit("knight-hitted", dir);
    } else {
      sceneEvents.emit("knight-dead");
    }
  }
}
