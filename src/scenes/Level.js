import Player from "../classes/Player.js";
import Slime from "../classes/Slime.js";
import Spawner from "../classes/Spawner.js";
import SkillBar from "../classes/SkillBar.js";
import StatusBars from "../classes/StatusBars.js";

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
      .setZoom(1);    this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      // Spell switching keys
      key1:  Phaser.Input.Keyboard.KeyCodes.ONE,
      key2:  Phaser.Input.Keyboard.KeyCodes.TWO,
      key3:  Phaser.Input.Keyboard.KeyCodes.THREE,
      key4:  Phaser.Input.Keyboard.KeyCodes.FOUR
    });
    this.input.on("pointerdown", pointer => this.player.attack(pointer));    
    this.slimes    = this.physics.add.group();
    this.spawner   = new Spawner(this, this.slimes, this.collideLayer);
    this.crystals  = this.physics.add.group();    // Create skill bar UI
    this.skillBar = new SkillBar(this, this.player);
    
    // Create status bars UI (health and experience)
    this.statusBars = new StatusBars(this, this.player);

    this.physics.add.collider(this.player,this.collideLayer);
    this.physics.add.collider(this.slimes,this.collideLayer);
    this.physics.add.overlap(this.player,this.crystals, (p, c) => {
      p.gainXp(c.getData('xp') || 10);
      c.destroy();
    });    
    this.physics.add.overlap(this.player.projectiles, this.slimes, (rock, slime) => {
      const damage = this.player.getSpellDamage('rock');
      slime.takeDamage(damage);
      rock.destroy();
    });        
    this.physics.add.overlap(this.player.explosions, this.slimes, (explosion, slime) => {
      if (!explosion.isTravelling) return;
      
      // Only trigger if explosion directly hits this specific slime
      const distance = Phaser.Math.Distance.Between(
        explosion.x, explosion.y,
        slime.x, slime.y
      );
      if (distance > 20) return; // Must be very close to the slime (direct hit)
        explosion.isTravelling = false;
      explosion.body.setVelocity(0);
      
      // Determine animation and spell type based on the explosion
      let animationKey;
      let spellType = explosion.spellType || 'explosion'; // Default to explosion if not set
      
      if (spellType === 'explosionTwoColors') {
        animationKey = "Explosion_two_colors";
      } else {
        animationKey = "Explosion_blue_oval";
      }
      
      const animData = this.anims.get(animationKey);
      explosion.anims.play({
        key: animationKey,
        startFrame: 0,
        endFrame: animData.frames.length - 1
      });      
      // Get damage and AOE from player based on spell type
      const damage = this.player.getSpellDamage(spellType);
      const aoeRadius = this.player.getSpellAOERadius(spellType);
        this.slimes.children.iterate(s => {
        const d = Phaser.Math.Distance.Between(explosion.x, explosion.y,s.x,s.y);
        if (d <= aoeRadius) {
          s.takeDamage(damage);
        }
      });
      explosion.once(`animationcomplete-${animationKey}`, () => {
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
    
    // Update skill bar
    this.skillBar.update();
    
    // Update status bars
    this.statusBars.update();
  }
}
