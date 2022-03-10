import Phaser from "phaser";
import { Anims } from "~/anims/Anims";
import StateMachine from "../statemachine/StateMachine";
import KnightController from "~/controllers/KnightController";

export default class Game extends Phaser.Scene {
  private knight?: Phaser.Physics.Arcade.Sprite;
  private knightController?: KnightController;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private swordHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor() {
    super("game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //anims
    Anims(this.anims);

    //background and backwalls
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

    //enemies

    //knight
    this.knight = this.physics.add.sprite(150, 150, "knight");

    //front walls
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    // sword hitbox
    this.swordHitbox = this.add.rectangle(
      0,
      0,
      35,
      32,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.swordHitbox);
    this.swordHitbox.body.enable = false;
    this.physics.world.remove(this.swordHitbox.body);
    console.log(this.swordHitbox.body);

    //knight controller
    this.knightController = new KnightController(
      this,
      this.knight,
      this.cursors,
      this.swordHitbox
    );

    //colliders
    this.physics.add.collider(this.knight, wallsLayer);
    this.physics.add.collider(this.knight, wallsLayerFront);

    // camera
    this.cameras.main.startFollow(this.knight, true);
  }

  update(t: number, dt: number) {
    this.knightController?.update(dt);
  }
}
