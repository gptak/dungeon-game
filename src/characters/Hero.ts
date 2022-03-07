import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      hero(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Hero;
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Hero extends Phaser.Physics.Arcade.Sprite {
  private _healthState = HealthState.IDLE;
  private _damageTime = 0;

  private _health = 5;

  get health() {
    return this._health;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.anims.play("hero-idle");
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }
    if (this._healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;

    if (this._health <= 0) {
      this._healthState = HealthState.DEAD;
      this.anims.play("hero-idle");
      this.setVelocity(0,0)

    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this._healthState = HealthState.DAMAGE;
      this._damageTime = 0;
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    switch (this._healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this._damageTime += delta;
        if (this._damageTime >= 250) {
          this._healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this._damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this._healthState === HealthState.DAMAGE ||
      this._healthState === HealthState.DEAD
    ) {
      return;
    }

    if (!cursors) {
      return;
    }

    const speed = 100;

    if (cursors.left?.isDown) {
      this.anims.play("hero-run", true);
      this.setVelocity(-speed, 0);

      this.scaleX = -1;
      this.body.offset.x = 14;
    } else if (cursors.right?.isDown) {
      this.anims.play("hero-run", true);
      this.setVelocity(speed, 0);

      this.scaleX = 1;
      this.body.offset.x = 2;
    } else if (cursors.up?.isDown) {
      this.anims.play("hero-run", true);
      this.setVelocity(0, -speed);
    } else if (cursors.down?.isDown) {
      this.anims.play("hero-run", true);
      this.setVelocity(0, speed);
    } else {
      this.anims.play("hero-idle", true);
      this.setVelocity(0, 0);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "hero",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Hero(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.8, sprite.height * 0.4);
    sprite.body.offset.y = 16;

    return sprite;
  }
);
