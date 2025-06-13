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
        this.level = 1;
        this.speed = 200;
        this.isAttacking = false;
        this.isDead = false;
        this.attackCooldown = false;

        this.projectiles = this.scene.physics.add.group();

        this.play("dude-walk");
        this.healthBar = new HealthBar(scene, this);

    }

    update(cursors) {
        if (this.isDead || this.isAttacking) return;

        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.flipX = false;
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
        }

        if (this.body.velocity.length() > 0 && !this.anims.isPlaying) {
            this.play("dude-walk", true);
        } else if (this.body.velocity.length() === 0 && !this.isAttacking) {
            this.play("dude-walk", true);
        }
        this.healthBar.update();

    }

    attack(cursors) {
        if (this.isDead || this.attackCooldown) return;

        this.isAttacking = true;
        this.attackCooldown = true;
        this.currentCursors = cursors;

        this.play("dude-throw");
        this.once("animationcomplete-dude-throw", () => {
            this.throwRock(this.currentCursors);
            this.isAttacking = false;
            this.attackCooldown = false;
            this.play("dude-walk", true);
        });
    }

    throwRock(cursors) {
        const rock = this.projectiles.create(this.x, this.y, "rock");
        rock.setCollideWorldBounds(true);
        rock.body.onWorldBounds = true;

        const speed = 400;
        let velocityX = 0;
        let velocityY = 0;

        if (cursors.left.isDown) {
            velocityX = -1;
        } else if (cursors.right.isDown) {
            velocityX = 1;
        }

        if (cursors.up.isDown) {
            velocityY = -1;
        } else if (cursors.down.isDown) {
            velocityY = 1;
        }

        // If no direction pressed → throw in facing direction (left/right)
        if (velocityX === 0 && velocityY === 0) {
            velocityX = this.flipX ? -1 : 1;
            velocityY = 0;
        }

        // Normalize vector → so diagonal speed is correct
        const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        velocityX = (velocityX / length) * speed;
        velocityY = (velocityY / length) * speed;

        rock.body.setVelocity(velocityX, velocityY);

        // Optional: destroy after some time
        this.scene.time.delayedCall(2000, () => {
            rock.destroy();
        });
    }

    hurt(damage) {
        if (this.isDead) return;

        // Always deduct HP
        this.hp -= damage;

        // Stop any pending throw-rock listener
        this.off("animationcomplete-dude-throw");

        // Only start 'dude-hurt' if it's not already playing
        const cur = this.anims.currentAnim;
        if (!this.anims.isPlaying || cur.key !== "dude-hurt") {
            this.play("dude-hurt");
        }

        // If HP has fallen to zero or below, die
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.body.setVelocity(0);

        // Remove any pending throw listener to avoid bug
        this.off("animationcomplete-dude-throw");

        this.play("dude-death");

        this.once("animationcomplete-dude-death", () => {
            this.disableBody(true, true);
        });
        this.healthBar.destroy();

    }
}
