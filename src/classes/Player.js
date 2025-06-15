import HealthBar from "./HealthBar.js";
import RewardSystem from "./RewardSystem.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dude-walk", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.setCollideWorldBounds(true);   
    this.hp       = 100;
    this.maxHp    = 100;
    this.speed    = 200;
    this.xp       = 0;
    this.level    = 1;
    this.xpToNext = 10;    
    this.baseDamage = 10;    
    this.spells = {
      rock: { unlocked: true, cooldown: 0, baseDamage: 10, aoeRadius: 0 },
      explosion: { unlocked: false, cooldown: 0, baseDamage: 30, aoeRadius: 64 },
      explosionTwoColors: { unlocked: false, cooldown: 0, baseDamage: 40, aoeRadius: 80 },
    };
    this.currentSpell = 'rock';

    this.isAttacking    = false;
    this.attackCooldown = false;
    this.isDead         = false;    
    this.projectiles = this.scene.physics.add.group();           
    this.explosions = this.scene.physics.add.group({
      defaultKey: "Explosion_blue_oval1-0", // Need this for setup,override in the throwExplosion
      maxSize: 10,
      classType: Phaser.Physics.Arcade.Sprite
    });
    this.healthBar = new HealthBar(scene, this);
    this.rewardSystem = new RewardSystem(this);
    this.play("dude-walk");
  }

  update(keys) {
    if (this.isDead) return;   
    if (keys.key1 && keys.key1.isDown) this.switchSpell('rock');
    if (keys.key2 && keys.key2.isDown) this.switchSpell('explosion');
    if (keys.key3 && keys.key3.isDown) this.switchSpell('explosionTwoColors');

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
        }

    const animKey = this.anims.currentAnim?.key;
    const playing = this.anims.isPlaying;
    const moving  = this.body.velocity.length() > 0;

    if ((animKey === "dude-throw" || animKey === "dude-hurt") && playing) {
    }    else {
      if (moving) {
        this.play("dude-walk", true);
      } else {
        this.anims.stop();
        this.setFrame(0);
      }
    }

    this.healthBar.update();
  }
  attack(pointer) {
    if (this.isDead || this.attackCooldown) return;

    const spell = this.spells[this.currentSpell];
    if (!spell || !spell.unlocked || spell.cooldown > 0) return;

    this.isAttacking    = true;
    this.attackCooldown = true;

    // play the same throw anim on the player
    this.play("dude-throw");

    this.once("animationcomplete-dude-throw", () => {
      // Cast the current spell
      this.castSpell(this.currentSpell, pointer);

      // reset state & return to walk
      this.isAttacking    = false;
      this.attackCooldown = false;
      this.play("dude-walk", true);
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
        this.throwExplosion(pointer); // Uses same function as explosion
        break;
      // Add more spells here
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
  // 1) grab from the pool (uses defaultKey:"Explosion_blue_oval" that you already loaded)
  const exp = this.explosions.get(this.x, this.y);
  if (!exp) return;

  // 2) Set the appropriate texture and spell type based on current spell
  let textureKey;
  if (this.currentSpell === 'explosionTwoColors') {
    textureKey = 'Explosion_two_colors1-0';
    exp.spellType = 'explosionTwoColors'; // Track which spell this explosion is from
  } else {
    textureKey = 'Explosion_blue_oval1-0';
    exp.spellType = 'explosion'; // Track which spell this explosion is from
  }
  exp.setTexture(textureKey);

  // 3) activate & position
  exp
    .setActive(true)
    .setVisible(true);
  exp.body.reset(this.x, this.y);// 3) mark as travelling and give it a visible frame (frame 0 should be a solid projectile frame)
  exp.isTravelling = true;
  exp.anims.stop();
  exp.setFrame(0);

  // 4) shoot it toward the pointer
  const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
  const dir = new Phaser.Math.Vector2(world.x - this.x, world.y - this.y).normalize();
  exp.body.setVelocity(dir.x * 400, dir.y * 400);

  // 5) if it flies off-screen, destroy it
  exp.body.onWorldBounds = true;
  exp.once("worldbounds", () => exp.destroy());

  // (no overlap logic here—your scene’s existing this.physics.add.overlap on player.explosions will fire)
}


  hurt(damage) {
    if (this.isDead) return;
    this.hp -= damage;
    this.off("animationcomplete-dude-throw");
    this.isAttacking    = false;
    this.attackCooldown = false;
    if (this.anims.currentAnim?.key !== "dude-hurt") {
      this.play("dude-hurt");
    }
    if (this.hp <= 0) this.die();
  }

  die() {
    this.isDead = true;
    this.body.setVelocity(0);
    this.off("animationcomplete-dude-throw");
    this.play("dude-death");
    this.once("animationcomplete-dude-death", () => {
      this.disableBody(true, true);
      this.healthBar.destroy();
    });  }

  gainXp(amount) {
    this.xp += amount;

    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;      // carry over extra XP
      this.level++;                  // bump level
      this.xpToNext = Math.floor(this.xpToNext * 1.2);  // scale next threshold

      // Get available rewards from reward system
      const rewards = this.rewardSystem.getAvailableRewards(3);

      // Trigger the LevelUp UI:
      //   1) pause the main Level scene
      //   2) launch the LevelUp overlay, passing in reward choices
      this.scene.scene.pause("Level");
      this.scene.scene.launch("LevelUp", {
        rewards: rewards,
        onSelect: choice => {
          this.rewardSystem.applyReward(choice.key || choice.rewardKey);
        }
      });
    }
  }
  unlockSpell(spellName) {
    if (this.spells[spellName]) {
      this.spells[spellName].unlocked = true;
      // Trigger skill bar update if it exists
      if (this.scene.skillBar) {
        this.scene.skillBar.updateSkillSlots();
      }
    }
  }  switchSpell(spellName) {
    if (this.spells[spellName] && this.spells[spellName].unlocked) {
      this.currentSpell = spellName;
      // Trigger skill bar update if it exists
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

  getCurrentSpellDamage() {
    return this.getSpellDamage(this.currentSpell);
  }

  getCurrentSpellAOERadius() {
    return this.getSpellAOERadius(this.currentSpell);
  }
}
