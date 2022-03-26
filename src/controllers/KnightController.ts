import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { sceneEvents } from "~/events center/EventsCenter";

export default class KnightController {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private swordHitbox1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private swordHitbox2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private stateMachine: StateMachine;

  //knight consts
  private hitPoints = 5; //also need to be changed in UI to work properly
  private speed = 100;

  constructor(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    swordHitbox1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody,
    swordHitbox2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ) {
    this.scene = scene;
    this.sprite = sprite;
    this.cursors = cursors;
    this.swordHitbox2 = swordHitbox1;
    this.swordHitbox1 = swordHitbox2;

    this.sprite.setBodySize(this.sprite.width * 0.28, this.sprite.height * 0.4);
    this.sprite.body.offset.x = 28;
    this.sprite.body.offset.y = 26;

    this.createAnimation();
    this.stateMachine = new StateMachine(this, "knight")
      .addState("idle-up", {
        onEnter: this.knightIdleUpEnter,
        onUpdate: this.knightIdleUpUpdate,
      })
      .addState("idle-down", {
        onEnter: this.knightIdleDownEnter,
        onUpdate: this.knightIdleDownUpdate,
      })
      .addState("idle-right", {
        onEnter: this.knightIdleRightEnter,
        onUpdate: this.knightIdleRightUpdate,
      })
      .addState("idle-left", {
        onEnter: this.knightIdleLeftEnter,
        onUpdate: this.knightIdleLeftUpdate,
      })
      .addState("run-up", {
        onUpdate: this.knightRunUpUpdate,
      })
      .addState("run-down", {
        onUpdate: this.knightRunDownUpdate,
      })
      .addState("run-right", {
        onUpdate: this.knightRunRightUpdate,
      })
      .addState("run-left", {
        onUpdate: this.knightRunLeftUpdate,
      })
      .addState("attack-up", {
        onEnter: this.knightAttackUpEnter,
      })
      .addState("attack-down", {
        onEnter: this.knightAttackDownEnter,
      })
      .addState("attack-right", {
        onEnter: this.knightAttackRightEnter,
      })
      .addState("attack-left", {
        onEnter: this.knightAttackLeftEnter,
      })
      .addState("hit", {
        onEnter: this.knightHitEnter,
      })
      .addState("dead", {
        onEnter: this.knightDeadEnter,
      });

    this.stateMachine.setState("idle-down");

    sceneEvents.on("knight-hit", this.handleKnightHit, this);
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  private handleKnightHit(dir: Phaser.Math.Vector2, dmg: number) {
    // swordHitbox disable if knight hitted during attack

    console.log(this);
    this.swordHitbox1.body.enable = false;
    this.swordHitbox2.body.enable = false;
    this.hitPoints -= dmg;
    this.sprite.setVelocity(dir.x, dir.y);
    sceneEvents.emit("knight-hit-points-change", this.hitPoints);
    this.stateMachine.setState("hit");
  }

  private knightHitEnter() {
    this.sprite.play("hit");
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "hit",
      () => {
        if (this.hitPoints > 0) {
          this.stateMachine.setState("idle-down");
          return;
        }
        this.stateMachine.setState("dead");
      }
    );
  }

  private knightDeadEnter() {
    this.sprite.play("dead");
    this.sprite.disableBody();
    this.sprite.setVelocity(0, 0);

    this.scene.scene.start("game-over");
  }

  private knightIdleUpEnter() {
    this.sprite.play("idle-up");
    this.sprite.setVelocity(0, 0);
  }
  private knightIdleDownEnter() {
    this.sprite.play("idle-down");
    this.sprite.setVelocity(0, 0);
  }
  private knightIdleRightEnter() {
    this.sprite.play("idle-side");
    this.sprite.setVelocity(0, 0);
  }
  private knightIdleLeftEnter() {
    this.sprite.play("idle-side");
    this.sprite.setVelocity(0, 0);
  }

  private knightIdleUpUpdate() {
    if (this.cursors.up.isDown) {
      this.stateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.stateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.stateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-up");
    }
  }

  private knightIdleDownUpdate() {
    if (this.cursors.up.isDown) {
      this.stateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.stateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.stateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-down");
    }
  }

  private knightIdleRightUpdate() {
    if (this.cursors.up.isDown) {
      this.stateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.stateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.stateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-right");
    }
  }

  private knightIdleLeftUpdate() {
    if (this.cursors.up.isDown) {
      this.stateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.stateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.stateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.stateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-left");
    }
  }

  private knightRunUpUpdate() {
    if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-up");
    } else if (this.cursors.up.isDown) {
      this.sprite.play("run-up", true);
      this.sprite.setVelocity(0, -this.speed);
    } else {
      this.stateMachine.setState("idle-up");
    }
  }

  private knightRunDownUpdate() {
    if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-down");
    } else if (this.cursors.down.isDown) {
      this.sprite.play("run-down", true);
      this.sprite.setVelocity(0, this.speed);
    } else {
      this.stateMachine.setState("idle-down");
    }
  }

  private knightRunRightUpdate() {
    if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-right");
    } else if (this.cursors.right.isDown) {
      this.sprite.play("run-side", true);
      this.sprite.setVelocity(this.speed, 0);
      this.sprite.flipX = false;
    } else {
      this.stateMachine.setState("idle-right");
    }
  }

  private knightRunLeftUpdate() {
    if (this.cursors.space.isDown) {
      this.stateMachine.setState("attack-left");
    } else if (this.cursors.left.isDown) {
      this.sprite.play("run-side", true);
      this.sprite.setVelocity(-this.speed, 0);
      this.sprite.flipX = true;
    } else {
      this.stateMachine.setState("idle-left");
    }
  }

  private knightAttackUpEnter() {
    this.sprite.setVelocity(0, 0);

    this.sprite.play("attack-up");
    this.swordHitbox1.x = this.sprite.x;
    this.swordHitbox1.y = this.sprite.y - 8;
    setTimeout(() => {
      this.scene.physics.world.add(this.swordHitbox1.body);
    }, 50);

    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-up",
      () => {
        this.stateMachine.setState("idle-up");
        this.swordHitbox1.body.enable = false;
        this.scene.physics.world.remove(this.swordHitbox1.body);
      }
    );
  }

  private knightAttackDownEnter() {
    this.sprite.setVelocity(0, 0);

    this.sprite.play("attack-down");
    this.swordHitbox1.x = this.sprite.x;
    this.swordHitbox1.y = this.sprite.y + 10;
    setTimeout(() => {
      this.scene.physics.world.add(this.swordHitbox1.body);
    }, 50);

    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-down",
      () => {
        this.stateMachine.setState("idle-down");
        this.swordHitbox1.body.enable = false;
        this.scene.physics.world.remove(this.swordHitbox1.body);
      }
    );
  }

  private knightAttackRightEnter() {
    this.sprite.setVelocity(0, 0);

    this.sprite.play("attack-side");
    this.swordHitbox2.x = this.sprite.x + 10;
    this.swordHitbox2.y = this.sprite.y + 3;
    this.sprite.flipX = false;
    setTimeout(() => {
      this.scene.physics.world.add(this.swordHitbox2.body);
    }, 50);

    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-side",
      () => {
        this.stateMachine.setState("idle-right");
        this.swordHitbox2.body.enable = false;
        this.scene.physics.world.remove(this.swordHitbox2.body);
      }
    );
  }

  private knightAttackLeftEnter() {
    this.sprite.setVelocity(0, 0);

    this.sprite.play("attack-side");
    this.swordHitbox2.x = this.sprite.x - 10;
    this.swordHitbox2.y = this.sprite.y + 3;
    this.sprite.flipX = true;
    setTimeout(() => {
      this.scene.physics.world.add(this.swordHitbox2.body);
    }, 50);

    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-side",
      () => {
        this.stateMachine.setState("idle-left");
        this.swordHitbox2.body.enable = false;
        this.scene.physics.world.remove(this.swordHitbox2.body);
      }
    );
  }

  //animations
  private createAnimation() {
    this.sprite.anims.create({
      key: "idle-up",
      frames: this.sprite.anims.generateFrameNames("idle_up", {
        start: 6,
        end: 8,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "idle-side",
      frames: this.sprite.anims.generateFrameNames("idle_side", {
        start: 3,
        end: 5,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "idle-down",
      frames: this.sprite.anims.generateFrameNames("idle_down", {
        start: 0,
        end: 2,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "run-up",
      frames: this.sprite.anims.generateFrameNames("run_up", {
        start: 27,
        end: 34,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "run-side",
      frames: this.sprite.anims.generateFrameNames("run_side", {
        start: 9,
        end: 18,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: "run-down",
      frames: this.sprite.anims.generateFrameNames("run_down", {
        start: 19,
        end: 26,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.sprite.anims.create({
      key: "attack-up",
      frames: this.sprite.anims.generateFrameNames("attack_up", {
        start: 68,
        end: 76,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 20,
    });

    this.sprite.anims.create({
      key: "attack-side",
      frames: this.sprite.anims.generateFrameNames("attack_side", {
        start: 50,
        end: 58,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 20,
    });

    this.sprite.anims.create({
      key: "attack-down",
      frames: this.sprite.anims.generateFrameNames("attack_down", {
        start: 59,
        end: 67,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 20,
    });

    this.sprite.anims.create({
      key: "hit",
      frames: this.sprite.anims.generateFrameNames("hit", {
        start: 35,
        end: 39,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 20,
    });

    this.sprite.anims.create({
      key: "dead",
      frames: this.sprite.anims.generateFrameNames("dead", {
        start: 40,
        end: 49,
        prefix: "Hooded knight_finalsheet-",
        suffix: ".png",
      }),
      frameRate: 8,
    });
  }
}
