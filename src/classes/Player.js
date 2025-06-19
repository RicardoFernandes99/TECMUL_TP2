import HealthBar from "./HealthBar.js";
import RewardSystem from "./RewardSystem.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, selectedCharacter = 'dude') {
    const initialTexture = selectedCharacter === 'dude' ? 'dude-walk' : 'pink-walk';
    super(scene, x, y, initialTexture, 0);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.selectedCharacter = selectedCharacter;
    
    this.setupCharacterAnimations();
    this.setCollideWorldBounds(true);
    this.hp = 100;
    this.maxHp = 100;
    this.speed = 200;
    this.pickupRange = 80; 
    this.xp = 0;
    this.level = 1;
    this.xpToNext = 10;    
    this.baseDamage = 10;  
    this.lifesteal = 0;
    this.kills = 0;

    this.spells = {
      rock: { unlocked: true, baseDamage: 10, aoeRadius: 0 },
      explosion: { unlocked: false, baseDamage: 30, aoeRadius: 64 },
      explosionTwoColors: { unlocked: false, baseDamage: 40, aoeRadius: 80 },
      nuclearexplosion: { unlocked: false, baseDamage: 100, aoeRadius: 128 }
    };

    this.currentSpell = 'rock';

    this.isAttacking    = false;
    this.attackCooldown = false;
    this.isDead         = false;    
    this.projectiles = this.scene.physics.add.group();             
    this.explosions = this.scene.physics.add.group({
      defaultKey: "Explosion_blue_oval1-0", // Need this for setup,override in the throwExplosion
      classType: Phaser.Physics.Arcade.Sprite
    });    
    this.healthBar = new HealthBar(scene, this);
    this.rewardSystem = new RewardSystem(this);
    
    this.play(this.getAnimationKey('walk'));
  }    

  setupCharacterAnimations() {
    this.characterAnims = {
      dude: {
        walk: 'dude-walk',
        hurt: 'dude-hurt', 
        throw: 'dude-throw',
        death: 'dude-death'
      },
      dudette: {
        walk: 'pink-walk',
        hurt: 'pink-hurt',
        throw: 'pink-throw', 
        death: 'pink-death'
      }
    }[this.selectedCharacter];
  }

  getAnimationKey(animationType) {
    const animKey = this.characterAnims[animationType];
    
    if (!this.scene.anims.exists(animKey)) {

      if (this.selectedCharacter === 'dudette') {
        const fallbackKey = animKey.replace('pink', 'dude');
        return this.scene.anims.exists(fallbackKey) ? fallbackKey : 'dude-walk';
      }
    }
    
    return animKey;
  }

  update(keys) {
    if (this.isDead) return;     
    if (keys.key1 && keys.key1.isDown) this.switchSpell('rock');
    if (keys.key2 && keys.key2.isDown) this.switchSpell('explosion');
    if (keys.key3 && keys.key3.isDown) this.switchSpell('explosionTwoColors');
    if (keys.key4 && keys.key4.isDown) this.switchSpell('nuclearexplosion');

    this.body.setVelocity(0);
    if (keys.left.isDown){ 
    this.body.setVelocityX(-this.speed); 
    this.flipX = true; 
    }
    else if (keys.right.isDown){
       this.body.setVelocityX(this.speed);
         this.flipX = false; 
         }
    if (keys.up.isDown)        
    { this.body.setVelocityY(-this.speed); 
    }
    else if (keys.down.isDown) {
       this.body.setVelocityY(this.speed); 
        }    const animKey = this.anims.currentAnim?.key;
    const playing = this.anims.isPlaying;
    const moving  = this.body.velocity.length() > 0;

    const throwAnimKey = this.getAnimationKey('throw');
    const hurtAnimKey = this.getAnimationKey('hurt');
    
    if ((animKey === throwAnimKey || animKey === hurtAnimKey) && playing) {
    }
    else {
      if (moving) {
        this.play(this.getAnimationKey('walk'), true);
      } else {
        this.anims.stop();
        this.setFrame(0);      
      }    
    }    
    this.healthBar.update();
    
    this.checkCrystalPickup();
  }  
  attack(pointer) {
    if (this.isDead || this.attackCooldown || this.isAttacking) return;
    
    const spell = this.spells[this.currentSpell];
    if (!spell || !spell.unlocked) return;

    this.isAttacking = true;
    this.attackCooldown = true;    
    const throwAnimKey = this.getAnimationKey('throw');
    this.play(throwAnimKey);

    this.once(`animationcomplete-${throwAnimKey}`, () => {
      this.castSpell(this.currentSpell, pointer);

      this.play(this.getAnimationKey('walk'), true);
      this.isAttacking = false;
      this.attackCooldown = false;
    });
  }
  castSpell(spellName, pointer) {
    switch(spellName) {
      case 'rock':
        this.throwRock(pointer);
        break;
      case 'explosion':
        this.throwExplosion(pointer);
        break;
      case 'explosionTwoColors':
        this.throwExplosion(pointer); 
        break;
      case 'nuclearexplosion':
        this.throwExplosion(pointer); 
        break;
    }
  }

  throwRock(pointer) {
    const rock = this.projectiles
      .create(this.x, this.y, "rock")
      .setCollideWorldBounds(true);
    rock.body.onWorldBounds = true;

    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const dir   = new Phaser.Math.Vector2(world.x - this.x, world.y - this.y).normalize();
    rock.body.setVelocity(dir.x * 400, dir.y * 400);

    this.scene.time.delayedCall(2000, () => rock.destroy());
  }

throwExplosion(pointer) {
  const exp = this.explosions.get(this.x, this.y);
  if (!exp) return;
  let textureKey;
  if (this.currentSpell === 'explosionTwoColors') {
    textureKey = 'Explosion_two_colors1-0';
    exp.spellType = 'explosionTwoColors';
  } else if (this.currentSpell === 'nuclearexplosion') {
    textureKey = 'Nuclear_explosion1-0';
    exp.spellType = 'nuclearexplosion';
  } else {
    textureKey = 'Explosion_blue_oval1-0';
    exp.spellType = 'explosion';
  }
  exp.setTexture(textureKey);

  exp
    .setActive(true)
    .setVisible(true);
  exp.body.reset(this.x, this.y);
  exp.isTravelling = true;
  exp.anims.stop();
  exp.setFrame(0);

  const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
  const dir = new Phaser.Math.Vector2(world.x - this.x, world.y - this.y).normalize();
  exp.body.setVelocity(dir.x * 400, dir.y * 400);

  this.scene.time.delayedCall(2000, () => {
    if (exp && exp.active) {
      exp.destroy();
    }
  });

}

  hurt(damage) {
    if (this.isDead) return;
    this.hp -= damage;
    const throwAnimKey = this.getAnimationKey('throw');
    this.off(`animationcomplete-${throwAnimKey}`);
    this.isAttacking    = false;
    this.attackCooldown = false;    
    const hurtAnimKey = this.getAnimationKey('hurt');
    if (this.anims.currentAnim?.key !== hurtAnimKey) {
      this.play(hurtAnimKey);
    }
    this.healthBar.update();

    if (this.hp <= 0) this.die();
  }    die() {
    this.isDead = true;
    this.body.setVelocity(0);
    const throwAnimKey = this.getAnimationKey('throw');
    this.off(`animationcomplete-${throwAnimKey}`);    const deathAnimKey = this.getAnimationKey('death');
    this.play(deathAnimKey);
    this.once(`animationcomplete-${deathAnimKey}`, () => {
      this.disableBody(true, true);      
      this.healthBar.destroy();
      
      if (this.scene.leaderboard && this.scene.playerName) {
        this.scene.leaderboard.addScore(this.scene.playerName, this.kills);
        
        this.scene.scene.pause('Level');
        
        this.scene.scene.launch('GameOver', {
          playerName: this.scene.playerName,
          score: this.kills,
          leaderboard: this.scene.leaderboard
        });
      }
    });
  }

  checkCrystalPickup() {
    if (!this.scene.crystals) return;
    
    this.scene.crystals.children.iterate(crystal => {
      if (!crystal || !crystal.active) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.x, this.y,
        crystal.x, crystal.y
      );
      if (distance <= this.pickupRange && distance > 20) { 
        const angle = Phaser.Math.Angle.Between(crystal.x, crystal.y, this.x, this.y);
        
        const magnetSpeed = 200;
        
        if (crystal.body) {
          crystal.body.setVelocity(
            Math.cos(angle) * magnetSpeed,
            Math.sin(angle) * magnetSpeed
          );
        }
      } else if (distance <= 20) {
        this.collectCrystal(crystal);
      } else {
        if (crystal.body) {
          crystal.body.setVelocity(0, 0);
        }
      }
    });
  }
    collectCrystal(crystal) {
    this.gainXp(crystal.getData("xp") || 10);    
    crystal.destroy();
  }

  gainXp(amount) {
    this.xp += amount;

    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;     
      this.level++;                 
      this.xpToNext = Math.floor(this.xpToNext * 1.2);  

      const rewards = this.rewardSystem.getAvailableRewards(3);      

      this.scene.scene.pause("Level");
      this.scene.scene.launch("LevelUp", {
        rewards: rewards,
        playerLevel: this.level,
        onSelect: choice => {
          this.rewardSystem.applyReward(choice.key || choice.rewardKey);
        }
      });
    }
  }
  unlockSpell(spellName) {
    if (this.spells[spellName]) {
      this.spells[spellName].unlocked = true;
      if (this.scene.skillBar) {
        this.scene.skillBar.updateSkillSlots();
      }
    }
  }  
  
  switchSpell(spellName) {
    if (this.spells[spellName] && this.spells[spellName].unlocked) {
      this.currentSpell = spellName;
      if (this.scene.skillBar) {
        this.scene.skillBar.updateSkillSlots();
      }
    }
  }
  getSpellDamage(spellName) {
    const spell = this.spells[spellName];
    if (!spell) return 0;
    return spell.baseDamage + this.baseDamage;
  }

  getSpellAOERadius(spellName) {
    const spell = this.spells[spellName];
    return spell ? spell.aoeRadius : 0;
  }

  lifestealRegeneration() {
    if (this.lifesteal <= 0 || this.hp >= this.maxHp) return;

    const lifestealAmount = Math.floor(this.baseDamage * (this.lifesteal / 100));
    this.hp = Math.min(this.hp + lifestealAmount, this.maxHp);
    this.healthBar.update();
  }
  
}
