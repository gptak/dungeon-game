import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";

export default class SlimeController {
  private scene: Phaser.Scene;
  private stateMachine: StateMachine;
  private sprite: Phaser.Physics.Arcade.Sprite;

  private moveTime = 0;
  private hitPoints = 1;

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

    this.sprite.setBodySize(this.sprite.width * 0.4, this.sprite.height * 0.4);

    this.createAnimation();
    this.stateMachine = new StateMachine(this, "slime");

    this.stateMachine
      .addState("slime-idle", {
        onEnter: this.slimeIdleEnter,
      })
      .addState("slime-run-up", {
        onEnter: this.slimeRunEnter,
        onUpdate: this.slimeRunUpUpdate,
      })
      .addState("slime-run-down", {
        onEnter: this.slimeRunEnter,
        onUpdate: this.slimeRunDownUpdate,
      })
      .addState("slime-run-left", {
        onEnter: this.slimeRunEnter,
        onUpdate: this.slimeRunLeftUpdate,
      })
      .addState("slime-run-right", {
        onEnter: this.slimeRunEnter,
        onUpdate: this.slimeRunRightUpdate,
      })
      .addState("slime-hit", {
        onEnter: this.slimeHitEnter,
      })
      .addState("slime-dead", {
        onEnter: this.slimeDeadEnter,
      });

    this.stateMachine.setState("slime-idle");
  }

  destroy() {}

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  handleSlimeHit(
    dir: Phaser.Math.Vector2,
    slime: Phaser.Physics.Arcade.Sprite
  ) {
    if (slime === this.sprite) {
      console.log(this.hitPoints);
      this.hitPoints--
      if (this.hitPoints >= 1) {
        this.sprite.setVelocity(dir.x, dir.y);
        this.stateMachine.setState("slime-hit");
      }else{
        this.sprite.setVelocity(dir.x, dir.y);
        this.stateMachine.setState("slime-dead");
      }
    } else {
      return;
    }
  }

  private slimeHitEnter() {
    this.sprite.play("slime-hit");
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "slime-hit",
      () => {
        this.stateMachine.setState("slime-idle");
        this.sprite.setVelocity(0, 0);
      }
    );
  }

  private slimeDeadEnter() {
    this.sprite.play("slime-hit");
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "slime-hit",
      () => {
        this.sprite.setVelocity(0, 0);
      }
    );
  }

  private slimeIdleEnter() {
    const r = Phaser.Math.Between(1, 100);

    if (r <= 25) {
      this.stateMachine.setState("slime-run-right");
    } else if (r > 25 && r <= 50) {
      this.stateMachine.setState("slime-run-up");
    } else if (r > 50 && r <= 75) {
      this.stateMachine.setState("slime-run-left");
    } else if (r > 75) {
      this.stateMachine.setState("slime-run-down");
    }
  }

  private slimeRunEnter() {
    this.moveTime = 0;
  }

  private speed = 20;

  private slimeRunUpUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-up", true);
    this.sprite.setVelocity(0, -this.speed);
    if (this.moveTime > Math.floor(Math.random() * 4000 + 6000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("slime-run-left");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("slime-run-down");
      } else if (r > 100) {
        this.stateMachine.setState("slime-run-right");
      }
    }
  }

  private slimeRunDownUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-down", true);
    this.sprite.setVelocity(0, this.speed);

    if (this.moveTime > Math.floor(Math.random() * 6000 + 4000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("slime-run-right");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("slime-run-up");
      } else if (r > 100) {
        this.stateMachine.setState("slime-run-left");
      }
    }
  }

  private slimeRunLeftUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-side", true);
    this.sprite.setVelocity(-this.speed, 0);
    this.sprite.flipX = true;
    if (this.moveTime > Math.floor(Math.random() * 5000 + 5000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("slime-run-down");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("slime-run-right");
      } else if (r > 100) {
        this.stateMachine.setState("slime-run-up");
      }
    }
  }

  private slimeRunRightUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-side", true);
    this.sprite.setVelocity(this.speed, 0);
    this.sprite.flipX = false;
    if (this.moveTime > Math.floor(Math.random() * 7000 + 3000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("slime-run-up");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("slime-run-left");
      } else if (r > 100) {
        this.stateMachine.setState("slime-run-down");
      }
    }
  }

  private createAnimation() {
    this.sprite.anims.create({
      key: "slime-run-up",
      frames: this.sprite.anims.generateFrameNames("slime_run_up", {
        start: 8,
        end: 11,
        prefix: "Slime_Medium_Green-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "slime-run-down",
      frames: this.sprite.anims.generateFrameNames("slime_run_down", {
        start: 0,
        end: 3,
        prefix: "Slime_Medium_Green-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "slime-run-side",
      frames: this.sprite.anims.generateFrameNames("slime_run_side", {
        start: 4,
        end: 7,
        prefix: "Slime_Medium_Green-",
        suffix: ".png",
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "slime-hit",
      frames: this.sprite.anims.generateFrameNames("slime_hit", {
        start: 0,
        end: 3,
        prefix: "Slime_Medium_Green-",
        suffix: ".png",
      }),
      frameRate: 10,
    });
  }
}
