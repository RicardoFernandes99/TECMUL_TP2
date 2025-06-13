import Player from "../classes/Player.js";
import Slime from "../classes/Slime.js";
import Spawner from "../classes/Spawner.js";

export default class Level extends Phaser.Scene {
  constructor() {
    super("Level");
  }

  create() {
    const map = this.make.tilemap({ key: 'level-map' });
    this.map = map;
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const tileset = map.addTilesetImage("Tilesheet", "tiles");

    this.bgLayer      = map.createLayer("BG",     tileset, 0, 0);
    this.collideLayer = map.createLayer("Colide", tileset, 0, 0);
    this.collideLayer.setCollisionByExclusion([-1]);

    this.player = new Player(this, 169, 409);

    this.cameras.main
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .startFollow(this.player)
      .setZoom(1);

    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.input.on("pointerdown", pointer => this.player.attack(pointer));

    this.slimes    = this.physics.add.group();
    this.spawner   = new Spawner(this, this.slimes, this.collideLayer);
    this.crystals  = this.physics.add.group();

    this.physics.add.collider(this.player,this.collideLayer);
    this.physics.add.collider(this.slimes,this.collideLayer);
    this.physics.add.overlap(this.player,this.crystals, (p, c) => {
      p.gainXp(c.getData('xp') || 10);
      c.destroy();
    });
    this.physics.add.overlap(this.player.projectiles, this.slimes, (rock, slime) => {
      slime.takeDamage(10);
      rock.destroy();
    });
    
    
    this.physics.add.overlap(this.player.explosions, this.slimes, (explosion, _s) => {
      if (!explosion.isTravelling) return;
      explosion.isTravelling = false;
      explosion.body.setVelocity(0);
      const animData    = this.anims.get("Explosion_blue_oval");
      explosion.anims.play({
        key:        "Explosion_blue_oval",
        startFrame: 0,
        endFrame:   animData.frames.length - 1
      });
      const AOE_RADIUS = 64;
      const DAMAGE     = 50;
      this.slimes.children.iterate(s => {
        const d = Phaser.Math.Distance.Between(explosion.x, explosion.y,s.x,s.y);
        if (d <= AOE_RADIUS) {
          s.takeDamage(DAMAGE);
        }
      });
      explosion.once("animationcomplete-Explosion_blue_oval", () => {
        explosion.destroy();
      });
    });


    this.physics.add.overlap(this.player, this.slimes, (_p, slime) => {
      slime.attack();
    });
  }

  update() {
    this.player.update(this.keys);
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.map.widthInPixels);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.map.heightInPixels);
    this.slimes.children.iterate(slime => slime.update(this.player));
  }
}
