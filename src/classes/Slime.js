import HealthBar from "./HealthBar.js";

export default class Slime extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, "slime-walk", 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 100;
        this.maxHp = 100;
        
        this.speed = 50;
        this.isDead = false;
        this.isAttacking = false;

        this.play("slime-walk");
        this.healthBar = new HealthBar(scene, this);

        this.body.setVelocity(Phaser.Math.Between(-this.speed, this.speed), Phaser.Math.Between(-this.speed, this.speed));
        this.body.setCollideWorldBounds(true);
        
    }

    takeDamage(amount) {
        if (this.isDead) return;

        this.hp -= amount;

        if (this.hp <= 0) {
            this.die();
        } else {
            this.anims.play("slime-hurt", true);

            this.once("animationcomplete-slime-hurt", () => {
                    this.anims.play("slime-walk", true);

            });
        }
    }

    attack() {
            if (this.isDead || this.isAttacking) return;

            this.isAttacking = true;
            this.body.setVelocity(0, 0);

            this.anims.play("slime-attack", true);

            this.once("animationcomplete-slime-attack", () => {
                this.isAttacking = false;
                this.anims.play("slime-walk", true);
            });

            this.scene.player.hurt(10); 
    }

    die() {
        this.isDead = true;
        this.body.setVelocity(0, 0);

        this.play("slime-death", true);

        this.once("animationcomplete-slime-death", () => {
            const crystal = this.scene.crystals.create(this.x, this.y, "Exp_drop");
            
            crystal.setData("xp", 10);         
            
            crystal.play("Exp_drop");
            this.scene.player.kills += 1; 
            this.destroy();
            
        });
        this.healthBar.destroy(); // remove sem esperar pela animacao

    }

    
    update(player) {
        if (this.isDead) return; 

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance < 1 && !this.isAttacking) {
            this.attack();
            return; 
        }

        if (!this.isAttacking) {
            const dir = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
            dir.normalize();

            this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);

            this.flipX = this.body.velocity.x < 0;
        }
        this.healthBar.update();
    }
}