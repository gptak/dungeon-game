import Phaser from "phaser";

const Anims = (anims: Phaser.Animations.AnimationManager) => {

  anims.create({
    key: "idle-up",
    frames: anims.generateFrameNames("idle_up", {
      start: 6,
      end: 8,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 5,
    repeat: -1,
  });
  anims.create({
    key: "idle-side",
    frames: anims.generateFrameNames("idle_side", {
      start: 3,
      end: 5,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 5,
    repeat: -1,
  });
  anims.create({
    key: "idle-down",
    frames: anims.generateFrameNames("idle_down", {
      start: 0,
      end: 2,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 5,
    repeat: -1,
  });

  anims.create({
    key: "run-up",
    frames: anims.generateFrameNames("run_up", {
      start: 27,
      end: 34,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
    repeat: -1,
  });
  anims.create({
    key: "run-side",
    frames: anims.generateFrameNames("run_side", {
      start: 9,
      end: 18,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
    repeat: -1,
  });
  anims.create({
    key: "run-down",
    frames: anims.generateFrameNames("run_down", {
      start: 19,
      end: 26,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
    repeat: -1,
  });

  anims.create({
    key: "attack-up",
    frames: anims.generateFrameNames("attack_up", {
      start: 68,
      end: 76,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
  });

  anims.create({
    key: "attack-side",
    frames: anims.generateFrameNames("attack_side", {
      start: 50,
      end: 58,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
  });

  anims.create({
    key: "attack-down",
    frames: anims.generateFrameNames("attack_down", {
      start: 59,
      end: 67,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
  });

  anims.create({
    key: "hit",
    frames: anims.generateFrameNames("hit", {
      start: 35,
      end: 39,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
  });

  anims.create({
    key: "dead",
    frames: anims.generateFrameNames("dead", {
      start: 40,
      end: 49,
      prefix: "Hooded knight_finalsheet-",
      suffix: ".png",
    }),
    frameRate: 20,
  });
};

export { Anims };
