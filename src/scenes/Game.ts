import Phaser from "phaser";

import { createOrcWarriorAnims } from "~/anims/EnemyAnims";
import { createHeroAnims } from "~/anims/HeroAnims";
import OrcWarrior from "~/enemies/OrcWarrior";
import "~/characters/Hero";
import Hero from "~/characters/Hero";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero!: Hero;

  constructor() {
    super("game");
  }
  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    this.scene.run("ui")
    //background
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

    //hero character
    this.hero = this.add.hero(128, 128, "hero");

    createHeroAnims(this.anims);

    //enemies
    createOrcWarriorAnims(this.anims);

    const orcWarriors = this.physics.add.group({
      classType: OrcWarrior,
      createCallback: (object) => {
        const orcObject = object as OrcWarrior;
        orcObject.body.onCollide = true;
      },
    });

    orcWarriors.get(256, 128, "orc_warrior");

    //front walls

    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    //UI


    //collisions

    this.physics.add.collider(this.hero, wallsLayer);
    this.physics.add.collider(this.hero, wallsLayerFront);

    this.physics.add.collider(orcWarriors, wallsLayer);
    this.physics.add.collider(orcWarriors, wallsLayerFront);

    this.physics.add.collider(
      orcWarriors,
      this.hero,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    );

    //camera

    this.cameras.main.startFollow(this.hero, true);
  }

  private handlePlayerEnemyCollision = (
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) => {
    const enemy = obj2 as OrcWarrior;
    const dx = this.hero.x - enemy.x;
    const dy = this.hero.y - enemy.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.hero.handleDamage(dir);
  };

  update(time: number, delta: number): void {
    const speed = 150;

    if (this.hero) {
      this.hero.update(this.cursors);
    }
  }
}
