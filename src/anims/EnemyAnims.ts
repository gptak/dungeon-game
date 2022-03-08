import Phaser from "phaser";

const createOrcWarriorAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "orc_warrior-idle",
    frames: anims.generateFrameNames("orc_warrior", {
      start: 0,
      end: 3,
      prefix: "orc_warrior_idle_anim_f",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });

  anims.create({
    key: "orc_warrior-run",
    frames: anims.generateFrameNames("orc_warrior", {
      start: 0,
      end: 3,
      prefix: "orc_warrior_run_anim_f",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 8,
  });
};

export { createOrcWarriorAnims };
