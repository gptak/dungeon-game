import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image("tiles_map", "assets/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/dungeon.json");
    
    this.load.atlas(
      "idle_up",
      "assets/knight/idle_up.png",
      "assets/knight/idle_up.json"
    );
    this.load.atlas(
      "idle_side",
      "assets/knight/idle_side.png",
      "assets/knight/idle_side.json"
    );
    this.load.atlas(
      "idle_down",
      "assets/knight/idle_down.png",
      "assets/knight/idle_down.json"
    );
    this.load.atlas(
      "run_up",
      "assets/knight/run_up.png",
      "assets/knight/run_up.json"
    );
    this.load.atlas(
      "run_side",
      "assets/knight/run_side.png",
      "assets/knight/run_side.json"
    );
    this.load.atlas(
      "run_down",
      "assets/knight/run_down.png",
      "assets/knight/run_down.json"
    );
    this.load.atlas(
      "attack_up",
      "assets/knight/attack_up.png",
      "assets/knight/attack_up.json"
    );
    this.load.atlas(
      "attack_side",
      "assets/knight/attack_side.png",
      "assets/knight/attack_side.json"
    );
    this.load.atlas(
      "attack_down",
      "assets/knight/attack_down.png",
      "assets/knight/attack_down.json"
    );

    this.load.atlas("hit", "assets/knight/hit.png", "assets/knight/hit.json");
    this.load.atlas(
      "dead",
      "assets/knight/dead.png",
      "assets/knight/dead.json"
    );

    this.load.image("ui_heart_empty", "assets/ui_heart_empty.png");
    this.load.image("ui_heart_full", "assets/ui_heart_full.png");
  }
  create() {
    this.scene.start("game");
  }
}
