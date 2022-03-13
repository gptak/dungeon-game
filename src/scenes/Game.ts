import Phaser from "phaser";
import { Anims } from "~/anims/Anims";

import KnightController from "~/controllers/KnightController";
import SlimeController from "~/controllers/SlimeController";
export default class Game extends Phaser.Scene {
  private knight!: Phaser.Physics.Arcade.Sprite;
  private knightController?: KnightController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private swordHitbox1!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private swordHitbox2!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private slimeControllers: SlimeController[] = [];

  constructor() {
    super("game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.slimeControllers = [];
  }

  create() {
    //ui
    this.scene.launch("ui");

    //anims
    Anims(this.anims);

    //background and backwalls
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collide: true });
    wallsLayerFront.setCollisionByProperty({ collide: true });

    // sword hitbox
    this.swordHitbox1 = this.add.rectangle(
      0,
      0,
      18,
      32,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.swordHitbox1);
    this.swordHitbox1.body.enable = false;
    this.physics.world.remove(this.swordHitbox1.body);

    this.swordHitbox2 = this.add.rectangle(
      0,
      0,
      32,
      25,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.swordHitbox2);
    this.swordHitbox2.body.enable = false;
    this.physics.world.remove(this.swordHitbox2.body);

    //game objects creator
    const objectsLayer = map.getObjectLayer("Objects");
    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name, width = 0, height = 0 } = objData;

      switch (name) {
        case "knight-spawn":
          //knight spawn
          this.knight = this.physics.add.sprite(x, y, "knight");
          this.knightController = new KnightController(
            this,
            this.knight,
            this.cursors,
            this.swordHitbox1,
            this.swordHitbox2,
            this.slimeControllers
          );

          //knight colliders
          this.physics.add.collider(this.knight, wallsLayer);
          this.physics.add.collider(this.knight, wallsLayerFront);

          //camera
          this.cameras.main.startFollow(this.knight, true);
          break;

        case "slime-spawn":
          //slime spawn
          const slime = this.physics.add.sprite(x, y, "slime");
          this.slimeControllers.push(new SlimeController(this, slime));

          //slime coliders
          this.physics.add.collider(
            this.knight,
            slime,
            this.handleKnightSlimeCollision,
            undefined,
            this
          );
          this.physics.add.overlap(
            this.swordHitbox1,
            slime,
            this.handleSwordSlimeCollision,
            undefined,
            this
          );
          this.physics.add.overlap(
            this.swordHitbox2,
            slime,
            this.handleSwordSlimeCollision,
            undefined,
            this
          );
          this.physics.add.collider(slime, wallsLayer);
          this.physics.add.collider(slime, wallsLayerFront);
          break;
      }
    });

    //front walls
  }

  destroy() {
    this.scene.stop("ui");
  }

  private handleKnightSlimeCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const slime = obj2 as Phaser.Physics.Arcade.Sprite;
    const dx = this.knight.x - slime.x;
    const dy = this.knight.y - slime.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    const slimeDmg = 10;

    this.knightController?.knightCollison(dir, slimeDmg);
  }

  private handleSwordSlimeCollision(
    // slime : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const slime = obj2 as Phaser.Physics.Arcade.Sprite;
    const dx = slime.x - this.knight.x;
    const dy = slime.y - this.knight.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);

    this.slimeControllers.forEach((slimeController) => {
      slimeController.handleSlimeHit(dir, slime);
    });
  }

  update(t: number, dt: number) {
    this.knightController?.update(dt);
    this.slimeControllers.forEach((slimeController) =>
      slimeController.update(dt)
    );
  }
}
