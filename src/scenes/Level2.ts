import Phaser from "phaser";
import { sceneEvents } from "~/events center/EventsCenter";

import KnightController from "~/controllers/KnightController";
import ShadowController from "~/controllers/ShadowController";
export default class Level2 extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private knight!: Phaser.Physics.Arcade.Sprite;
  private knightController!: KnightController;
  private shadows: Phaser.Physics.Arcade.Sprite[] = [];
  private shadowsControllers: ShadowController[] = [];
  private swordHitbox1!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private swordHitbox2!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor() {
    super("level2");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shadowsControllers = [];
    this.shadows = [];

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  destroy() {
   
  }

  create() {
    
    this.scene.moveBelow("ui");
    //map
    const map = this.make.tilemap({ key: "level2" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collide: true });
    wallsLayerFront.setCollisionByProperty({ collide: true });

    // sword hitboxes
    this.swordHitbox1 = this.add.rectangle(
      0,
      0,
      18,
      30,
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
        //knight spawn
        case "knight-spawn":
          this.knight = this.physics.add.sprite(x, y, "knight");
          this.knightController = new KnightController(
            this,
            this.knight,
            this.cursors,
            this.swordHitbox1,
            this.swordHitbox2
          );

          //knight colliders
          this.physics.add.collider(this.knight, wallsLayer);
          this.physics.add.collider(this.knight, wallsLayerFront);

          //camera
          this.cameras.main.startFollow(this.knight, true);
          this.cameras.main.fadeIn();
          break;

        //slime spawn
        case "shadow-spawn":
          const shadow = this.physics.add.sprite(x, y, "shadow");
          this.shadows?.push(shadow);
          this.shadowsControllers.push(new ShadowController(this, shadow));

          //slime coliders
          this.physics.add.collider(
            this.knight,
            shadow,
            this.handleKnightHitBySlime,
            undefined,
            this
          );

          this.physics.add.overlap(
            this.swordHitbox1,
            shadow,
            this.handleShadowHitBySword,
            undefined,
            this
          );

          this.physics.add.overlap(
            this.swordHitbox2,
            shadow,
            this.handleShadowHitBySword,
            undefined,
            this
          );
          
          this.physics.add.collider(shadow, wallsLayer);
          this.physics.add.collider(shadow, wallsLayerFront);
          break;
      }
    });

    //layers
    const mapLayer = this.add.layer(wallsLayer);
    const enemiesLayer = this.add.layer(this.shadows);
    const playerLayer = this.add.layer(this.knight);
    const frontLayer = this.add.layer(wallsLayerFront);
    mapLayer.depth = 0;
    enemiesLayer.depth = 1;
    playerLayer.depth = 2;
    frontLayer.depth = 3;
  }

  private handleKnightHitBySlime(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const slime = obj2 as Phaser.Physics.Arcade.Sprite;
    const dx = this.knight.x - slime.x;
    const dy = this.knight.y - slime.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    const dmg = 1;

    sceneEvents.emit("knight-hit", dir, dmg);
  }

  private handleShadowHitBySword(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const shadow = obj2 as Phaser.Physics.Arcade.Sprite;
    const dx = shadow.x - this.knight.x;
    const dy = shadow.y - this.knight.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);

    sceneEvents.emit("shadow-hit", dir, shadow);
  }

  update(t: number, dt: number) {
    this.knightController?.update(dt);
    this.shadowsControllers.forEach((shadowController) =>
      shadowController.update(dt)
    );
  }
}
