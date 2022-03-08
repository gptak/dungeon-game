import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image("tiles_map", "assets/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/dungeon.json");

    this.load.atlas("hero_axe_idle", "assets/hero_axe_idle.png", "assets/hero_axe_idle.json");
    this.load.atlas("hero_axe_run", "assets/hero_axe_run.png", "assets/hero_axe_run.json");
    this.load.atlas("hero_axe_swing1", "assets/hero_axe_swing1.png", "assets/hero_axe_swing1.json");
    this.load.atlas("hero_dead", "assets/hero_dead.png", "assets/hero_dead.json");
    this.load.atlas(
      "orc_warrior",
      "assets/orc_warrior.png",
      "assets/orc_warrior.json"
    );

    this.load.image("ui_heart_empty", "assets/ui_heart_empty.png");
    this.load.image("ui_heart_full", "assets/ui_heart_full.png");
    this.load.image("sword", "assets/weapon_rusty_sword.png");
  }
  create() {
    this.scene.start("game");
  }
}
