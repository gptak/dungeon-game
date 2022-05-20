import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.image("tiles_map", "assets/tiles.png");
    this.load.tilemapTiledJSON("level1", "assets/level1.json");
    this.load.tilemapTiledJSON("level2", "assets/level2.json");

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
    this.load.atlas(
      "dead",
      "assets/knight/dead.png",
      "assets/knight/dead.json"
    );
    this.load.atlas("hit", "assets/knight/hit.png", "assets/knight/hit.json");
    this.load.atlas(
      "slime_run_up",
      "assets/slime/slime_run_up.png",
      "assets/slime/slime_run_up.json"
    );
    this.load.atlas(
      "slime_run_side",
      "assets/slime/slime_run_side.png",
      "assets/slime/slime_run_side.json"
    );
    this.load.atlas(
      "slime_run_down",
      "assets/slime/slime_run_down.png",
      "assets/slime/slime_run_down.json"
    );
    this.load.atlas(
      "slime_hit",
      "assets/slime/slime_hit.png",
      "assets/slime/slime_hit.json"
    );
    this.load.atlas(
      "shadow_run_up",
      "assets/shadow/shadow_run_up.png",
      "assets/shadow/shadow_run_up.json"
    );
    this.load.atlas(
      "shadow_run_side",
      "assets/shadow/shadow_run_side.png",
      "assets/shadow/shadow_run_side.json"
    );
    this.load.atlas(
      "shadow_run_down",
      "assets/shadow/shadow_run_down.png",
      "assets/shadow/shadow_run_down.json"
    );
    this.load.atlas(
      "shadow_attack_up",
      "assets/shadow/shadow_attack_up.png",
      "assets/shadow/shadow_attack_up.json"
    );
    this.load.atlas(
      "shadow_attack_side",
      "assets/shadow/shadow_attack_side.png",
      "assets/shadow/shadow_attack_side.json"
    );
    this.load.atlas(
      "shadow_attack_down",
      "assets/shadow/shadow_attack_down.png",
      "assets/shadow/shadow_attack_down.json"
    );
    this.load.atlas(
      "shadow_hit",
      "assets/shadow/shadow_hit.png",
      "assets/shadow/shadow_hit.json"
    );

    this.load.image("ui_heart_empty", "assets/ui_heart_empty.png");
    this.load.image("ui_heart_full", "assets/ui_heart_full.png");
  }

  create() {
    this.scene.start("level1");
    this.scene.launch("ui");
  }
}
