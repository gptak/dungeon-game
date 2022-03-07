import Phaser from "phaser";

import { createOrcWarriorAnims } from "~/anims/EnemyAnims";
import { createHeroAnims } from "~/anims/HeroAnims";
import OrcWarrior from "~/enemies/OrcWarrior";
import "~/characters/Hero";
import { sceneEvents } from "~/events/EventsCenter";
import Hero from "~/characters/Hero";
import Sword from "~/weapons/sword";
import "~/weapons/sword";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero!: Hero;
  private sword!: Sword;

  private playerEnemyCollider?: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("game");
  }
  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    //background
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tiles", "tiles_map");

    map.createLayer("Floor", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);
    wallsLayer.setCollisionByProperty({ collide: true });

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

    //hero character
    this.hero = this.add.hero(128, 128, "hero");

    createHeroAnims(this.anims);

    //weapon
    this.sword = this.add.sword(500, 128, "sword");
    

    //front walls

    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    //UI

    this.scene.run("ui");

    //collisions

    this.physics.add.collider(this.hero, wallsLayer);
    this.physics.add.collider(this.hero, wallsLayerFront);

    this.physics.add.collider(orcWarriors, wallsLayer);
    this.physics.add.collider(orcWarriors, wallsLayerFront);

    this.playerEnemyCollider = this.physics.add.collider(
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

    sceneEvents.emit("player-damage", this.hero.health);

    if (this.hero.health <= 0) {
      this.playerEnemyCollider?.destroy();
    }
  };

  update(time: number, delta: number): void {
    const speed = 150;

    this.sword.x = this.hero.x+10;
    this.sword.y = this.hero.y
    

    if (this.hero) {
      this.hero.update(this.cursors);
    }

    if(this.sword){
      this.sword.update(this.cursors)
    }
  }
}
