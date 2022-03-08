import Phaser from "phaser";

import { createOrcWarriorAnims } from "~/anims/EnemyAnims";
import { createHeroAnims } from "~/anims/HeroAnims";
import OrcWarrior from "~/enemies/OrcWarrior";
import "~/characters/Hero";
import { sceneEvents } from "~/events/EventsCenter";
import Hero from "~/characters/Hero";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero!: Hero;

  private playerEnemyCollider?: Phaser.Physics.Arcade.Collider;

  private axeHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

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
        orcObject.body.setSize(
          orcObject.body.width * 0.8,
          orcObject.body.height * 0.7
        );
      },
    });

    orcWarriors.get(100, 100, "orc_warrior");
    orcWarriors.get(200, 200, "orc_warrior");
    orcWarriors.get(300, 300, "orc_warrior");
    orcWarriors.get(400, 400, "orc_warrior");

    //hero character
    this.hero = this.add.hero(128, 128, "hero");
    createHeroAnims(this.anims);

    //front walls
    const wallsLayerFront = map.createLayer("WallsFront", tileset, 0, 0);
    wallsLayerFront.setCollisionByProperty({ collide: true });

    //UI
    this.scene.run("ui");

    //weapon hitbox
    this.axeHitbox = this.add.rectangle(
      0,
      0,
      28,
      29,
      0xffffff,
      0
    ) as unknown as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    this.physics.add.existing(this.axeHitbox);
    this.physics.world.remove(this.axeHitbox.body);

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

    this.physics.add.overlap(
      this.axeHitbox,
      orcWarriors,
      this.handleEnemyDamage,
      undefined,
      this
    );

    //camera

    this.cameras.main.startFollow(this.hero, true);
  }

  private handleEnemyDamage = (
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) => {
    const enemy = obj2 as OrcWarrior;
    enemy.destroy();
  };

  private handlePlayerEnemyCollision = (
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) => {
    const enemy = obj2 as OrcWarrior;
    const dx = this.hero.x - enemy.x;
    const dy = this.hero.y - enemy.y + 40;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.hero.handleDamage(dir);

    sceneEvents.emit("player-damage", this.hero.health);

    if (this.hero.health <= 0) {
      this.playerEnemyCollider?.destroy();
    }
  };

  update(time: number, delta: number): void {
    const speed = 150;

    if (this.hero) {
      this.hero.update(this.cursors);
    }

    if (this.cursors.space.isDown) {
      const startHit = (
        anim: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame
      ) => {
        if (frame.index < 6) {
          return
        } else if (frame.index >= 12) {
          this.physics.world.remove(this.axeHitbox.body);
          console.log("usuwam");
          this.hero.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
          
        } else {
          
          console.log("wale");
          this.physics.world.add(this.axeHitbox.body);
          this.axeHitbox.x = this.hero.x;
          this.axeHitbox.y = this.hero.y + 35;
          
        }
      };

      this.hero.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
      
    }
  }
}
