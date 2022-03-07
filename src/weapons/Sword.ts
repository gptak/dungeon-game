import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      sword(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Sword;
    }
  }
}

export default class Sword extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "sword",
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

}

Phaser.GameObjects.GameObjectFactory.register(
  "sword",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Sword(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    return sprite;
  }
);
