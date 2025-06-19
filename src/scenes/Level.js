import Player from "../classes/Player.js";
import Spawner from "../classes/Spawner.js";
import SkillBar from "../classes/SkillBar.js";
import StatusBars from "../classes/StatusBars.js";
import Leaderboard from "../classes/Leaderboard.js";

export default class Level extends Phaser.Scene {
  constructor() {
    super("Level");
  }  
  create(data) {

    this.selectedCharacter = data.selectedCharacter || 'dude';
    this.playerName = data.playerName || 'Player';

    this.fightMusic = this.sound.add('fight', { loop: true, volume: 0.05 });
    this.fightMusic.play();

    const map = this.make.tilemap({ key: 'level-map' });
    this.map = map;
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const tileset = map.addTilesetImage("Tilesheet", "tiles");

    this.bgLayer      = map.createLayer("BG",     tileset, 0, 0);
    this.collideLayer = map.createLayer("Colide", tileset, 0, 0);
    this.collideLayer.setCollisionByExclusion([-1]);

    this.player = new Player(this, 169, 409, this.selectedCharacter);

    this.cameras.main
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .startFollow(this.player)
      .setZoom(1);      

      this.keys = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,

      key1:  Phaser.Input.Keyboard.KeyCodes.ONE,
      key2:  Phaser.Input.Keyboard.KeyCodes.TWO,
      key3:  Phaser.Input.Keyboard.KeyCodes.THREE,
      key4:  Phaser.Input.Keyboard.KeyCodes.FOUR,
      escape: Phaser.Input.Keyboard.KeyCodes.ESC,

      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });    
    this.isPaused = false;
    this.pauseMenu = null;
    
    this.leaderboard = new Leaderboard(this);    
    this.input.on("pointerdown", pointer => this.player.attack(pointer));
    this.mobs      = this.physics.add.group();
    this.spawner   = new Spawner(this, this.mobs, this.collideLayer);
    this.crystals  = this.physics.add.group();
    this.skillBar = new SkillBar(this, this.player);
    this.statusBars = new StatusBars(this, this.player);      
    this.physics.add.collider(this.player,this.collideLayer);
    this.physics.add.collider(this.mobs,this.collideLayer);
    
    this.physics.add.overlap(this.player, this.crystals, (player, crystal) => {
      player.collectCrystal(crystal);
    });
      this.physics.add.overlap(this.player.projectiles, this.mobs, (rock, mob) => {
      const damage = this.player.getSpellDamage('rock');
      mob.takeDamage(damage);
      this.player.lifestealRegeneration();

      rock.destroy();
    });    
    this.physics.add.overlap(this.player.explosions, this.mobs, (explosion, mob) => {
      if (!explosion.isTravelling) return;
      
      const distance = Phaser.Math.Distance.Between(
        explosion.x, explosion.y,
        mob.x, mob.y
      );
      if (distance > 20) return; 
      explosion.isTravelling = false;
      explosion.body.setVelocity(0);

      let animationKey;
      let spellType = explosion.spellType || 'explosion'; 
      
      if (spellType === 'explosionTwoColors') {
        animationKey = "Explosion_two_colors";
      } else if (spellType === 'nuclearexplosion') {
        animationKey = "Nuclear_explosion";
      } else {
        animationKey = "Explosion_blue_oval";
      }
      
      const animData = this.anims.get(animationKey);
      explosion.anims.play({
        key: animationKey,
        startFrame: 0,
        endFrame: animData.frames.length - 1
      });      
      const damage = this.player.getSpellDamage(spellType);
      const aoeRadius = this.player.getSpellAOERadius(spellType);
        this.mobs.children.iterate(mob => {
        const d = Phaser.Math.Distance.Between(explosion.x, explosion.y, mob.x, mob.y);
        if (d <= aoeRadius) {
          mob.takeDamage(damage);
          this.player.lifestealRegeneration();

        }
      });
      explosion.once(`animationcomplete-${animationKey}`, () => {
        explosion.destroy();
      });
    });
      this.physics.add.overlap(this.player, this.mobs, (_p, mob) => {
      mob.attack();
    });

  }  
    togglePause() {
    if (this.isPaused) {
      this.isPaused = false;
      this.physics.world.resume();
      this.anims.resumeAll();
      this.time.paused = false;
      
      if (this.pauseMenu) {
        this.pauseMenu.destroy(true);
        this.pauseMenu = null;
      }
    } else {
      this.isPaused = true;
      this.physics.world.pause();
      this.anims.pauseAll();
      this.time.paused = true;
      
      this.pauseMenu = this.add.group();
      
      const overlay = this.add.rectangle(
        this.cameras.main.centerX, 
        this.cameras.main.centerY, 
        this.cameras.main.width, 
        this.cameras.main.height, 
        0x000000, 0.5
      );
      overlay.setScrollFactor(0);
      
      const text = this.add.text(
        this.cameras.main.centerX, 
        this.cameras.main.centerY, 
        'GAME PAUSED', 
        {
          fontSize: '32px',
          fill: '#ffffff',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 4
        }
      );
      text.setOrigin(0.5);
      text.setScrollFactor(0);
      
      this.pauseMenu.add(overlay);
      this.pauseMenu.add(text);
    }
  }
  update() {

    if (Phaser.Input.Keyboard.JustDown(this.keys.escape)) {
      this.togglePause();
    }

    if (this.isPaused) return;    this.player.update(this.keys);
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.map.widthInPixels);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.map.heightInPixels);
    this.mobs.children.iterate(mob => mob.update(this.player));
    
    this.skillBar.update();
    
    this.statusBars.update();
  }


}
