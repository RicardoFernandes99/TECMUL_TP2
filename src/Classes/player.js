import HealthBar from "./HealthBar.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dude-walk", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.setCollideWorldBounds(true);

    // stats
    this.hp       = 100;
    this.maxHp    = 100;
    this.speed    = 200;
    this.xp       = 0;
    this.level    = 1;
    this.xpToNext = 10;

    // state
    this.isAttacking    = false;
    this.attackCooldown = false;
    this.isDead         = false;

    // two separate pools
    this.projectiles = this.scene.physics.add.group();           // rocks
    this.explosions  = this.scene.physics.add.group({            // explosion projectiles
      defaultKey: "Explosion_blue_oval",
      maxSize: 10
    });

    this.healthBar = new HealthBar(scene, this);
    this.play("dude-walk");
  }

  update(keys) {
    if (this.isDead) return;

    this.body.setVelocity(0);
    if (keys.left.isDown)      { this.body.setVelocityX(-this.speed); this.flipX = true; }
    else if (keys.right.isDown){ this.body.setVelocityX(this.speed);  this.flipX = false; }
    if (keys.up.isDown)        { this.body.setVelocityY(-this.speed); }
    else if (keys.down.isDown) { this.body.setVelocityY(this.speed);  }

    const animKey = this.anims.currentAnim?.key;
    const playing = this.anims.isPlaying;
    const moving  = this.body.velocity.length() > 0;

    // only block new walk‐anim if we’re mid-throw or mid-hurt
    if ((animKey === "dude-throw" || animKey === "dude-hurt") && playing) {
      // let that finish
    }
    else if (moving) {
      this.play("dude-walk", true);
    } else {
      this.play("dude-walk", true);
    }

    this.healthBar.update();
  }

  attack(pointer) {
    if (this.isDead || this.attackCooldown) return;

    this.isAttacking    = true;
    this.attackCooldown = true;

    // play the same throw anim on the player
    this.play("dude-throw");

    this.once("animationcomplete-dude-throw", () => {
      // level‐based projectile
      if (this.level === 1) {
        this.throwRock(pointer);
      } else {
        this.throwExplosion(pointer);
      }

      // reset state & return to walk
      this.isAttacking    = false;
      this.attackCooldown = false;
      this.play("dude-walk", true);
    });
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

    exp.setActive(true)
       .setVisible(true)
       .body.reset(this.x, this.y);

    exp.play("Explosion_blue_oval");

    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const dir   = new Phaser.Math.Vector2(world.x - this.x, world.y - this.y).normalize();
    exp.body.setVelocity(dir.x * 400, dir.y * 400);

    // return to pool on animation complete
    exp.once("animationcomplete-Explosion_blue_oval", () => exp.destroy());
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
    });
  }


        gainXp(amount) {
            this.xp += amount;
            console.log(`Gained ${amount} XP (now ${this.xp}/${this.xpToNext})`);

            if (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;      // carry over extra XP
            this.level++;                  // bump level
            this.xpToNext = Math.floor(this.xpToNext * 1.2);  // scale next threshold

            // Trigger the LevelUp UI:
            //   1) pause the main Level scene
            //   2) launch the LevelUp overlay, passing in reward choices
            this.scene.scene.pause("Level");
            this.scene.scene.launch("LevelUp", {
                rewards: [
                { key: "icon-hp",    label: "Max HP +20"   },
                { key: "icon-speed", label: "Move Speed +50"},
                { key: "icon-dmg",   label: "Damage +5"     },
                ],
                onSelect: choice => {
                console.log("Chose reward:", choice.label);
                // apply the upgrade:
                if (choice.label.includes("HP"))    this.maxHp += 20;
                if (choice.label.includes("Speed")) this.speed += 50;
                if (choice.label.includes("Damage")) {
                    // e.g. you could track an attackDamage property
                    this.attackDamage = (this.attackDamage||0) + 5;
                }
                }
            });
            }
        }
}
