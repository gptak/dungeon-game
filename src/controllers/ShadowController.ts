import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sceneEvents } from "~/events center/EventsCenter";

export default class ShadowController {
  private stateMachine: StateMachine;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private knight: Phaser.Physics.Arcade.Sprite;

  //shadow stats
  private moveTime = 0;
  private speed = 45;
  private triggerDistance = 70;
  private hitPoints = 10;
  private gold = Math.floor(Math.random() * 7 + 3);
  private exp = 100;

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    knight: Phaser.Physics.Arcade.Sprite
  ) {
    this.sprite = sprite;
    this.knight = knight;

    this.sprite.setBodySize(
      this.sprite.width * 0.45,
      this.sprite.height * 0.45
    );
    this.sprite.body.offset.x = 0;
    this.sprite.body.offset.y = 2;

    this.createAnimation();
    this.stateMachine = new StateMachine(this, "shadow");

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
      .addState("attack-up", {
        onEnter: this.attackUpEnter,
        onUpdate: this.attackUpdate,
      })
      .addState("attack-left", {
        onEnter: this.attackLeftEnter,
        onUpdate: this.attackUpdate,
      })
      .addState("attack-right", {
        onEnter: this.attackRightEnter,
        onUpdate: this.attackUpdate,
      })
      .addState("attack-down", {
        onEnter: this.attackDownEnter,
        onUpdate: this.attackUpdate,
      })
      .addState("hit", {
        onEnter: this.hitEnter,
      })
      .addState("dead", {
        onEnter: this.deadEnter,
      });

    this.stateMachine.setState("idle");

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
      this.stateMachine.setState("hit");
      this.hitPoints--;
      return;
    }
    return;
  }

  private knightDistance() {
    const dx = this.knight.x - this.sprite.x;
    const dy = this.knight.y - this.sprite.y;
    const distance = new Phaser.Math.Vector2(dx, dy).length();
    return distance;
  }

  //state handlers
  private hitEnter() {
    this.sprite.play("shadow-hit");
    this.sprite.tint = 0xff0000;
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "shadow-hit",
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
    this.sprite.play("shadow-hit");
    this.sprite.disableBody();
    sceneEvents.emit("mob-dead", this.gold, this.exp);
    sceneEvents.off("shadow-hit", this.handleHit, this);
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
    this.sprite.play("shadow-run-up", true);
    this.sprite.setVelocity(0, -this.speed);
    if (this.moveTime > Math.floor(Math.random() * 3000 + 3000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
    const dx = this.knight.x - this.sprite.x;
    const dy = this.knight.y - this.sprite.y;
    if (this.knightDistance() < this.triggerDistance) {
      if (dy < 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-up");
        return;
      }
      if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-down");
        return;
      }
      if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-left");
        return;
      }
      if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-right");
        return;
      }
    }
  }

  private runDownUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-down", true);
    this.sprite.setVelocity(0, this.speed);

    if (this.moveTime > Math.floor(Math.random() * 3000 + 3000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
    const dx = this.knight.x - this.sprite.x;
    const dy = this.knight.y - this.sprite.y;
    if (this.knightDistance() < this.triggerDistance) {
      if (dy < 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-up");
        return;
      }
      if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-down");
        return;
      }
      if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-left");
        return;
      }
      if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-right");
        return;
      }
    }
  }

  private runLeftUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-side", true);
    this.sprite.setVelocity(-this.speed, 0);
    this.sprite.flipX = false;
    if (this.moveTime > Math.floor(Math.random() * 3000 + 3000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
    const dx = this.knight.x - this.sprite.x;
    const dy = this.knight.y - this.sprite.y;
    if (this.knightDistance() < this.triggerDistance) {
      if (dy < 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-up");
        return;
      }
      if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-down");
        return;
      }
      if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-left");
        return;
      }
      if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-right");
        return;
      }
    }
  }

  private runRightUpdate(dt: number) {
    this.moveTime += dt;
    this.sprite.play("shadow-run-side", true);
    this.sprite.setVelocity(this.speed, 0);
    this.sprite.flipX = true;
    if (this.moveTime > Math.floor(Math.random() * 3000 + 3000)) {
      const r = Math.floor(Math.random() * 3);
      if (r === 0) {
        this.stateMachine.setState("run-left");
      } else if (r === 1) {
        this.stateMachine.setState("run-down");
      } else if (r === 2) {
        this.stateMachine.setState("run-right");
      }
    }
    const dx = this.knight.x - this.sprite.x;
    const dy = this.knight.y - this.sprite.y;
    if (this.knightDistance() < this.triggerDistance) {
      if (dy < 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-up");
        return;
      }
      if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
        this.stateMachine.setState("attack-down");
        return;
      }
      if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-left");
        return;
      }
      if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
        this.stateMachine.setState("attack-right");
        return;
      }
    }
  }

  private attackUpEnter() {
    this.sprite.play("shadow-attack-up", true);
    this.sprite.setVelocity(
      (this.knight.x - this.sprite.x) * 1.2,
      (this.knight.y - this.sprite.y) * 1.2
    );
  }

  private attackLeftEnter() {
    this.sprite.play("shadow-attack-side", true);
    this.sprite.setVelocity(
      (this.knight.x - this.sprite.x) * 1.2,
      (this.knight.y - this.sprite.y) * 1.2
    );
    this.sprite.flipX = false;
  }

  private attackRightEnter() {
    this.sprite.play("shadow-attack-side", true);
    this.sprite.setVelocity(
      (this.knight.x - this.sprite.x) * 1.2,
      (this.knight.y - this.sprite.y) * 1.2
    );
    this.sprite.flipX = true;
  }

  private attackDownEnter() {
    this.sprite.play("shadow-attack-down", true);
    this.sprite.setVelocity(
      (this.knight.x - this.sprite.x) * 1.2,
      (this.knight.y - this.sprite.y) * 1.2
    );
  }

  private attackUpdate() {
    if (this.knightDistance() > this.triggerDistance) {
      this.stateMachine.setState("idle");
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
      key: "shadow-attack-up",
      frames: this.sprite.anims.generateFrameNames("shadow_attack_up", {
        start: 2,
        end: 4,
        prefix: "1",
        suffix: ".png",
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "shadow-attack-down",
      frames: this.sprite.anims.generateFrameNames("shadow_attack_down", {
        start: 1,
        end: 3,
        prefix: "10",
        suffix: ".png",
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "shadow-attack-side",
      frames: this.sprite.anims.generateFrameNames("shadow_attack_side", {
        start: 5,
        end: 7,
        prefix: "1",
        suffix: ".png",
      }),
      frameRate: 15,
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
