import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sceneEvents } from "~/events center/EventsCenter";

export default class SlimeController {
  private stateMachine: StateMachine;
  private sprite: Phaser.Physics.Arcade.Sprite;

  //slime stats
  private moveTime = 0;
  private speed = 20;
  private hitPoints = 5;
  private gold = Math.floor(Math.random() * 4 + 1);
  private exp = 100;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
    this.sprite.setBodySize(this.sprite.width * 0.4, this.sprite.height * 0.4);

    this.createAnimation();
    this.stateMachine = new StateMachine(this, "slime");

    this.stateMachine
      .addState("idle", {
        onEnter: this.idleEnter,
      })
      .addState("run-up", {
        onEnter: this.runEnter,
        onUpdate: this.runUpUpdate,
      })
      .addState("run-down", {
        onEnter: this.runEnter,
        onUpdate: this.runDownUpdate,
      })
      .addState("run-left", {
        onEnter: this.runEnter,
        onUpdate: this.runLeftUpdate,
      })
      .addState("run-right", {
        onEnter: this.runEnter,
        onUpdate: this.runRightUpdate,
      })
      .addState("hit", {
        onEnter: this.hitEnter,
      })
      .addState("dead", {
        onEnter: this.deadEnter,
      });

    this.stateMachine.setState("idle");

    sceneEvents.on("slime-hit", this.handleHit, this);
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  private handleHit(
    dir: Phaser.Math.Vector2,
    slime: Phaser.Physics.Arcade.Sprite
  ) {
    if (slime === this.sprite && this.hitPoints >= 1) {
      this.sprite.setVelocity(dir.x, dir.y);
      this.stateMachine.setState("hit");
      this.hitPoints--;
      return;
    }
    return;
  }

  private hitEnter() {
    this.sprite.play("slime-hit");
    this.sprite.tint = 0xff0000;
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "slime-hit",
      () => {
        if (this.hitPoints > 0) {
          this.stateMachine.setState("idle");
          return;
        }

        this.stateMachine.setState("dead");
      }
    );
  }

  private deadEnter() {
    this.sprite.play("slime-hit");
    this.sprite.disableBody();
    sceneEvents.emit("mob-dead", this.gold, this.exp);
    sceneEvents.off("slime-hit", this.handleHit, this);
  }

  private idleEnter() {
    const r = Math.floor(Math.random() * 4);
    this.sprite.tint = 0xffffff;
    if (r === 0) {
      this.stateMachine.setState("run-right");
    } else if (r === 1) {
      this.stateMachine.setState("run-up");
    } else if (r === 2) {
      this.stateMachine.setState("run-left");
    } else if (r === 3) {
      this.stateMachine.setState("run-down");
    }
  }

  private runEnter() {
    this.moveTime = 0;
  }

  private runUpUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-up", true);
    this.sprite.setVelocity(0, -this.speed);
    if (this.moveTime > Math.floor(Math.random() * 2000 + 2000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
  }

  private runDownUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-down", true);
    this.sprite.setVelocity(0, this.speed);

    if (this.moveTime > Math.floor(Math.random() * 2000 + 2000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
  }

  private runLeftUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-side", true);
    this.sprite.setVelocity(-this.speed, 0);
    this.sprite.flipX = true;
    if (this.moveTime > Math.floor(Math.random() * 2000 + 2000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
  }

  private runRightUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("slime-run-side", true);
    this.sprite.setVelocity(this.speed, 0);
    this.sprite.flipX = false;
    if (this.moveTime > Math.floor(Math.random() * 2000 + 2000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
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
      frameRate: 15,
    });
  }
}
