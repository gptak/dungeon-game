import Phaser from "phaser";

const createHeroAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "hero-idle",
        frames: anims.generateFrameNames("hero", {
          start: 0,
          end: 3,
          prefix: "knight_m_idle_anim_f",
          suffix: ".png",
        }),
        repeat: -1,
        frameRate: 10,
      });
  
      anims.create({
        key: "hero-run",
        frames: anims.generateFrameNames("hero", {
          start: 0,
          end: 3,
          prefix: "knight_m_run_anim_f",
          suffix: ".png",
        }),
        repeat: -1,
        frameRate: 15,
      });
};

export { createHeroAnims };