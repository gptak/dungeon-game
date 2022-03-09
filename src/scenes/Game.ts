import Phaser from "phaser";
import { Anims } from "~/anims/Anims";
import StateMachine from "../statemachine/StateMachine";

export default class Game extends Phaser.Scene {
  private knight!: Phaser.Physics.Arcade.Sprite;
  private knightStateMachine!: StateMachine;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private axeHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor() {
    super("game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //add anims
    Anims(this.anims);

    //add background and backwalls
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

    //add hero
    this.knight = this.physics.add.sprite(150, 150, "knight");
    this.knight.setBodySize(this.knight.width * 0.36, this.knight.height * 0.4);
    this.knight.setOrigin(0.4, 0);
    this.knight.body.offset.x = 18;
    this.knight.body.offset.y = 36;

    //front walls
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    this.knightStateMachine = new StateMachine(this, "knight")
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
        onEnter: this.knightRunUpEnter,
        onUpdate: this.knightRunUpUpdate,
      })
      .addState("run-down", {
        onEnter: this.knightRunDownEnter,
        onUpdate: this.knightRunDownUpdate,
      })
      .addState("run-right", {
        onEnter: this.knightRunRightEnter,
        onUpdate: this.knightRunRightUpdate,
      })
      .addState("run-left", {
        onEnter: this.knightRunLeftEnter,
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
      });
    this.knightStateMachine.setState("idle-down");

    // axe hitbox
    this.axeHitbox = this.add.rectangle(
      0,
      0,
      30,
      30,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.axeHitbox);
    this.axeHitbox.body.enable = false;
    this.physics.world.remove(this.axeHitbox.body);
    console.log(this.axeHitbox.body);

    //camera

    this.cameras.main.startFollow(this.knight, true);
  }

  update(t: number, dt: number) {
    this.knightStateMachine.update(dt);
  }

  private knightIdleUpEnter() {
    this.knight.play("idle-up");
    this.knight.setVelocity(0, 0);
  }
  private knightIdleDownEnter() {
    this.knight.play("idle-down");
    this.knight.setVelocity(0, 0);
  }
  private knightIdleRightEnter() {
    this.knight.play("idle-side");
    this.knight.setVelocity(0, 0);
  }
  private knightIdleLeftEnter() {
    this.knight.play("idle-side");
    this.knight.setVelocity(0, 0);
  }

  private knightIdleUpUpdate() {
    if (this.cursors.up.isDown) {
      this.knightStateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.knightStateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.knightStateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.knightStateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-up");
    }
  }

  private knightIdleDownUpdate() {
    if (this.cursors.up.isDown) {
      this.knightStateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.knightStateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.knightStateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.knightStateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-down");
    }
  }

  private knightIdleRightUpdate() {
    if (this.cursors.up.isDown) {
      this.knightStateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.knightStateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.knightStateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.knightStateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-right");
    }
  }

  private knightIdleLeftUpdate() {
    if (this.cursors.up.isDown) {
      this.knightStateMachine.setState("run-up");
    } else if (this.cursors.down.isDown) {
      this.knightStateMachine.setState("run-down");
    } else if (this.cursors.right.isDown) {
      this.knightStateMachine.setState("run-right");
    } else if (this.cursors.left.isDown) {
      this.knightStateMachine.setState("run-left");
    } else if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-left");
    }
  }

  private knightRunUpEnter() {
    this.knight.play("run-up");
  }
  private knightRunDownEnter() {
    this.knight.play("run-down");
  }
  private knightRunLeftEnter() {
    this.knight.play("run-side");
  }
  private knightRunRightEnter() {
    this.knight.play("run-side");
  }

  private speed = 120;

  private knightRunUpUpdate() {
    if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-up");
    } else if (this.cursors.up.isDown) {
      this.knight.play("run-up", true);
      this.knight.setVelocity(0, -this.speed);
    } else {
      this.knightStateMachine.setState("idle-up");
    }
  }

  private knightRunDownUpdate() {
    if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-down");
    } else if (this.cursors.down.isDown) {
      this.knight.play("run-down", true);
      this.knight.setVelocity(0, this.speed);
    } else {
      this.knightStateMachine.setState("idle-down");
    }
  }

  private knightRunRightUpdate() {
    if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-right");
    } else if (this.cursors.right.isDown) {
      this.knight.play("run-side", true);
      this.knight.setVelocity(this.speed, 0);
      this.knight.scaleX = 1;
    } else {
      this.knightStateMachine.setState("idle-right");
    }
  }

  private knightRunLeftUpdate() {
    if (this.cursors.space.isDown) {
      this.knightStateMachine.setState("attack-left");
    } else if (this.cursors.left.isDown) {
      this.knight.play("run-side", true);
      this.knight.setVelocity(-this.speed, 0);
      this.knight.scaleX = -1;
    } else {
      this.knightStateMachine.setState("idle-left");
    }
  }

  private knightAttackUpEnter() {
    this.knight.setVelocity(0, 0);

    this.knight.play("attack-up");
    this.axeHitbox.x = this.knight.x;
    this.axeHitbox.y = this.knight.y + 35;
    this.physics.world.add(this.axeHitbox.body);

    this.knight.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-up",
      () => {
        this.knightStateMachine.setState("idle-up");
        this.axeHitbox.body.enable = false;
        this.physics.world.remove(this.axeHitbox.body);
      }
    );
  }

  private knightAttackDownEnter() {
    this.knight.setVelocity(0, 0);

    this.knight.play("attack-down");
    this.axeHitbox.x = this.knight.x;
    this.axeHitbox.y = this.knight.y + 35;
    this.physics.world.add(this.axeHitbox.body);

    this.knight.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-down",
      () => {
        this.knightStateMachine.setState("idle-down");
        this.axeHitbox.body.enable = false;
        this.physics.world.remove(this.axeHitbox.body);
      }
    );
  }

  private knightAttackRightEnter() {
    this.knight.setVelocity(0, 0);

    this.knight.play("attack-side");
    this.axeHitbox.x = this.knight.x;
    this.axeHitbox.y = this.knight.y + 35;
    this.knight.scaleX = 1;
    this.physics.world.add(this.axeHitbox.body);

    this.knight.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-side",
      () => {
        this.knightStateMachine.setState("idle-right");
        this.axeHitbox.body.enable = false;
        this.physics.world.remove(this.axeHitbox.body);
      }
    );
  }

  private knightAttackLeftEnter() {
    this.knight.setVelocity(0, 0);

    this.knight.play("attack-side");
    this.axeHitbox.x = this.knight.x;
    this.axeHitbox.y = this.knight.y + 35;
    this.knight.scaleX = -1;
    this.physics.world.add(this.axeHitbox.body);

    this.knight.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack-side",
      () => {
        this.knightStateMachine.setState("idle-left");
        this.axeHitbox.body.enable = false;
        this.physics.world.remove(this.axeHitbox.body);
      }
    );
  }
}
