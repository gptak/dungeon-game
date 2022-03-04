import Phaser from "phaser";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const randomDirection = (currentDir: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);

  while (newDirection === currentDir) {
    newDirection = Phaser.Math.Between(0, 3);
  }

  return newDirection;
};

export default class OrcWarrior extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;

  private moveEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("orc_warrior-run");

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 8000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  destroy(fromScene?: boolean): void {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  private handleTileCollision(
    object: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (object !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const speed = 35;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;

      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;

      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        this.scaleX = -1;
        this.body.offset.x = 16
        break;

      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        this.scaleX = 1;
        this.body.offset.x = 0
        break;
    }
  }
}
