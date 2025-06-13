import HealthBar from "./HealthBar.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dude-walk", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    this.setCollideWorldBounds(true);

    this.hp = 100;
    this.maxHp = 100;
    this.speed = 200;
    this.xp = 0;
    this.isAttacking = false;
    this.attackCooldown = false;
    this.isDead = false;

    this.projectiles = this.scene.physics.add.group();

    this.healthBar = new HealthBar(scene, this);

    this.play("dude-walk");
  }

  update(keys) {
    if (this.isDead) return;

    this.body.setVelocity(0);
    if (keys.left.isDown) {
      this.body.setVelocityX(-this.speed);
      this.flipX = true;
    } else if (keys.right.isDown) {
      this.body.setVelocityX(this.speed);
      this.flipX = false;
    }
    if (keys.up.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (keys.down.isDown) {
      this.body.setVelocityY(this.speed);
    }

    const key   = this.anims.currentAnim?.key;
    const playing = this.anims.isPlaying;
    const moving  = this.body.velocity.length() > 0;

    if ((key === "dude-throw" || key === "dude-hurt") && playing) {
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

    this.play("dude-throw");

    this.once("animationcomplete-dude-throw", () => {
      this.throwRock(pointer);
      this.isAttacking    = false;
      this.attackCooldown = false;
      this.play("dude-walk", true);
    });
  }

  throwRock(pointer) {
    const rock = this.projectiles.create(this.x, this.y, "rock");
    rock.setCollideWorldBounds(true);
    rock.body.onWorldBounds = true;

    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const dir = new Phaser.Math.Vector2(world.x - this.x, world.y - this.y).normalize();

    const speed = 400;
    rock.body.setVelocity(dir.x * speed, dir.y * speed);

    this.scene.time.delayedCall(2000, () => rock.destroy());
  }

  hurt(damage) {
    if (this.isDead) return;

    this.hp -= damage;

    this.off("animationcomplete-dude-throw");
    this.isAttacking = false;
    this.attackCooldown = false;

    if (this.anims.currentAnim?.key !== "dude-hurt") {
      this.play("dude-hurt");
    }

    if (this.hp <= 0) {
      this.die();
    }
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
    this.xp = (this.xp || 0) + amount;
    console.log("Gained XP:", amount, "Total:", this.xp);
    }
}
