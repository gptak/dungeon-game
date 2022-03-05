import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image("tiles_map", "assets/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/dungeon.json");

    this.load.atlas("hero", "assets/hero.png", "assets/hero.json");
    this.load.atlas(
      "orc_warrior",
      "assets/orc_warrior.png",
      "assets/orc_warrior.json"
    );

    this.load.image("ui_heart_empty", "assets/ui_heart_empty.png");
    this.load.image("ui_heart_full", "assets/ui_heart_full.png");
  }
  create() {
    this.scene.start("game");
  }
}
