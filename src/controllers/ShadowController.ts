import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sceneEvents } from "~/events center/EventsCenter";

export default class ShadowController {
  private scene: Phaser.Scene;
  private stateMachine: StateMachine;
  private sprite: Phaser.Physics.Arcade.Sprite;

  //shadow stats
  private moveTime = 0;
  private speed = 40;
  private hitPoints = 50;
  private gold = Math.floor(Math.random() * 7 + 3);
  private exp = 100;

  constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.sprite = sprite;

    this.sprite.setBodySize(this.sprite.width * 0.45, this.sprite.height * 0.45);
    this.sprite.body.offset.x = 0;
    this.sprite.body.offset.y = 2;

    this.createAnimation();
    this.stateMachine = new StateMachine(this, "shadow");

    this.stateMachine
      .addState("shadow-idle", {
        onEnter: this.idleEnter,
      })
      .addState("shadow-run-up", {
        onEnter: this.runEnter,
        onUpdate: this.runUpUpdate,
      })
      .addState("shadow-run-down", {
        onEnter: this.runEnter,
        onUpdate: this.runDownUpdate,
      })
      .addState("shadow-run-left", {
        onEnter: this.runEnter,
        onUpdate: this.runLeftUpdate,
      })
      .addState("shadow-run-right", {
        onEnter: this.runEnter,
        onUpdate: this.runRightUpdate,
      })
      .addState("shadow-hit", {
        onEnter: this.hitEnter,
      })
      .addState("shadow-dead", {
        onEnter: this.deadEnter,
      });

    this.stateMachine.setState("shadow-idle");

    sceneEvents.on("shadow-hit", this.handleHit, this);
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  private handleHit(
    dir: Phaser.Math.Vector2,
    shadow: Phaser.Physics.Arcade.Sprite
  ) {
    if (shadow === this.sprite && this.hitPoints >= 1) {
      this.sprite.setVelocity(dir.x, dir.y);
      this.stateMachine.setState("shadow-hit");
      this.hitPoints--;
      return;
    }
    return;
  }

  private hitEnter() {
    this.sprite.play("shadow-hit");
    this.sprite.tint = 0xff0000;
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "shadow-hit",
      () => {
        if (this.hitPoints > 0) {
          this.stateMachine.setState("shadow-idle");
          return;
        }

        this.stateMachine.setState("shadow-dead");
      }
    );
  }

  private deadEnter() {
    this.sprite.play("shadow-hit");
    this.sprite.disableBody();
    sceneEvents.emit("mob-dead", this.gold, this.exp);
    sceneEvents.off("shadow-hit", this.handleHit, this);
  }

  private idleEnter() {
    const r = Phaser.Math.Between(1, 100);
    this.sprite.tint = 0xffffff;
    if (r <= 25) {
      this.stateMachine.setState("shadow-run-right");
    } else if (r > 25 && r <= 50) {
      this.stateMachine.setState("shadow-run-up");
    } else if (r > 50 && r <= 75) {
      this.stateMachine.setState("shadow-run-left");
    } else if (r > 75) {
      this.stateMachine.setState("shadow-run-down");
    }
  }

  private runEnter() {
    this.moveTime = 0;
  }

  private runUpUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-up", true);
    this.sprite.setVelocity(0, -this.speed);
    if (this.moveTime > Math.floor(Math.random() * 4000 + 6000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("shadow-run-left");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("shadow-run-down");
      } else if (r > 100) {
        this.stateMachine.setState("shadow-run-right");
      }
    }
  }

  private runDownUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-down", true);
    this.sprite.setVelocity(0, this.speed);

    if (this.moveTime > Math.floor(Math.random() * 6000 + 4000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("shadow-run-right");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("shadow-run-up");
      } else if (r > 100) {
        this.stateMachine.setState("shadow-run-left");
      }
    }
  }

  private runLeftUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-side", true);
    this.sprite.setVelocity(-this.speed, 0);
    this.sprite.flipX = false;
    if (this.moveTime > Math.floor(Math.random() * 5000 + 5000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("shadow-run-down");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("shadow-run-right");
      } else if (r > 100) {
        this.stateMachine.setState("shadow-run-up");
      }
    }
  }

  private runRightUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-side", true);
    this.sprite.setVelocity(this.speed, 0);
    this.sprite.flipX = true;
    if (this.moveTime > Math.floor(Math.random() * 7000 + 3000)) {
      const r = Phaser.Math.Between(1, 100);
      if (r <= 33) {
        this.stateMachine.setState("shadow-run-up");
      } else if (r > 33 && r <= 66) {
        this.stateMachine.setState("shadow-run-left");
      } else if (r > 100) {
        this.stateMachine.setState("shadow-run-down");
      }
    }
  }

  private createAnimation() {
    this.sprite.anims.create({
      key: "shadow-run-up",
      frames: this.sprite.anims.generateFrameNames("shadow_run_up", {
        start: 3,
        end: 5,
        prefix: "0",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "shadow-run-down",
      frames: this.sprite.anims.generateFrameNames("shadow_run_down", {
        start: 0,
        end: 2,
        prefix: "0",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "shadow-run-side",
      frames: this.sprite.anims.generateFrameNames("shadow_run_side", {
        start: 6,
        end: 8,
        prefix: "0",
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "shadow-hit",
      frames: this.sprite.anims.generateFrameNames("shadow_hit", {
        start: 1,
        end: 2,
        prefix: "00",
        suffix: ".png",
      }),
      frameRate: 4,
    });
  }
}
