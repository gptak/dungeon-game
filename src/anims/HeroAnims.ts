import Phaser from "phaser";

const createHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "hero-idle",
    frames: anims.generateFrameNames("hero_axe_idle", {
      start: 1,
      end: 8,
      prefix: "Viking_IdleAxe_0",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 5,
  });

  anims.create({
    key: "hero-run",
    frames: anims.generateFrameNames("hero_axe_run", {
      start: 1,
      end: 8,
      prefix: "Viking_RunAxe_0",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 15,
  });

  anims.create({
    key: "hero-axe-swing1",
    frames: anims.generateFrameNames("hero_axe_swing1", {
      start: 1,
      end: 17,
      prefix: "Viking_AttackAxe01_",
      suffix: ".png",
    }),
    frameRate: 20,
  });

  anims.create({
    key: "hero-dead",
    frames: anims.generateFrameNames("hero_dead", {
      start: 3,
      end: 15,
      prefix: "Viking_Death_",
      suffix: ".png",
    }),
    frameRate: 10,
  });
};

export { createHeroAnims };
