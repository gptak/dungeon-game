import Phaser from "phaser";
import { Anims } from "~/anims/Anims";

import KnightController from "~/controllers/KnightController";
import SlimeController from "~/controllers/SlimeController";

export default class Game extends Phaser.Scene {
  private knight!: Phaser.Physics.Arcade.Sprite;
  private knightController?: KnightController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private swordHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

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

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

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
            this.swordHitbox
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
          this.physics.add.collider(slime, this.knight);
          this.physics.add.collider(slime, wallsLayer);
          this.physics.add.collider(slime, wallsLayerFront);
          
          
          break;
        }
      });
      
    //front walls
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });
  }

  destroy() {
    this.scene.stop("ui");
    this.slimeControllers.forEach((slime) => slime.destroy());
  }

  update(t: number, dt: number) {
    this.knightController?.update(dt);
    this.slimeControllers.forEach((slime) => slime.update(dt));
  }
}
