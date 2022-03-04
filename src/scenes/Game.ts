import Phaser from "phaser";

import { createOrcWarriorAnims } from "~/anims/EnemyAnims";
import { createHeroAnims } from "~/anims/HeroAnims";
import OrcWarrior from "~/enemies/OrcWarrior";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
  }
  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    const idleFrameRate = 10;
    const heroMoveFrameRate = 15;
    const orcWarriorMoveFrameRate = 10;

    //background

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

    //hero character

    this.hero = this.physics.add.sprite(
      128,
      128,
      "hero",
      "knight_m_idle_anim_f0.png"
    );
    this.hero.body.setSize(this.hero.width * 0.8, this.hero.height * 0.4);
    this.hero.body.offset.y = 16;

    createHeroAnims(this.anims);

    //enemies
    createOrcWarriorAnims(this.anims);

    const orcWarriors = this.physics.add.group({
      classType: OrcWarrior,
      createCallback : (object)=>{
        const orcObject = object as OrcWarrior
        orcObject.body.onCollide = true
      }
    });

    orcWarriors.get(256, 128, "orc_warrior");


    //front walls

    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    //collisions

    this.physics.add.collider(this.hero, wallsLayer);
    this.physics.add.collider(this.hero, wallsLayerFront);
    
    this.physics.add.collider(orcWarriors, wallsLayer);
    this.physics.add.collider(orcWarriors, wallsLayerFront);
    this.physics.add.collider(orcWarriors, this.hero);

    //camera

    this.cameras.main.startFollow(this.hero, true);
  }

  update(time: number, delta: number): void {
    const speed = 150;

    if (!this.cursors || !this.hero) {
      return;
    }

    if (this.cursors.left?.isDown) {
      this.hero.anims.play("hero-run", true);
      this.hero.setVelocity(-speed, 0);
      this.hero.scaleX = -1;
      this.hero.body.offset.x = 14;
    } else if (this.cursors.right?.isDown) {
      this.hero.anims.play("hero-run", true);
      this.hero.setVelocity(speed, 0);
      this.hero.scaleX = 1;
      this.hero.body.offset.x = 2;
    } else if (this.cursors.up?.isDown) {
      this.hero.anims.play("hero-run", true);
      this.hero.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.hero.anims.play("hero-run", true);
      this.hero.setVelocity(0, speed);
    } else {
      this.hero.anims.play("hero-idle", true);
      this.hero.setVelocity(0, 0);
    }

    
  }
}
