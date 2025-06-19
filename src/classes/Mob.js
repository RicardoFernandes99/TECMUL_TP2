import HealthBar from "./HealthBar.js";

export default class Mob extends Phaser.Physics.Arcade.Sprite {    constructor(scene, x, y, textureKey, mobConfig) {
        super(scene, x, y, textureKey + "-walk", 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.maxHp = mobConfig.maxHp;
        this.hp = this.maxHp;
        this.speed = mobConfig.speed;
        this.attackDamage = mobConfig.attackDamage;
        this.expValue = mobConfig.expValue;
        this.attackRange = mobConfig.attackRange || 1;
        
        this.textureKey = textureKey;
        this.walkAnim = textureKey + "-walk";
        this.attackAnim = textureKey + "-attack";
        this.hurtAnim = textureKey + "-hurt";
        this.deathAnim = textureKey + "-death";
        
        this.isDead = false;
        this.isAttacking = false;

        this.normalizeSize();

        this.play(this.walkAnim);
        
        this.healthBar = new HealthBar(scene, this);

        this.initializeMovement();
        
        this.body.setCollideWorldBounds(true);
        
    }    
    normalizeSize() {
        const mobScales = {
            'slime': 1.0,        
            'skeleton': 0.07,      
            'reaper': 0.07,      
            'golem': 0.07,       
            'dragon': 0.25,     
            'troll': 0.08        
        };
        const collisionSizes = {
            'slime': 45,        
            'skeleton': 900,     
            'reaper': 900,      
            'golem': 900,       
            'dragon': 256,      
            'troll': 900         
        };
        
        const scale = mobScales[this.textureKey] || 1.0;
        const bodySize = collisionSizes[this.textureKey] || 45;
        this.setScale(scale);
        
        this.body.setSize(bodySize, bodySize);
        
        this.body.setOffset(0, 0);
        
        this.displayScale = scale;
    }


    initializeMovement() {
        this.body.setVelocity(
            Phaser.Math.Between(-this.speed, this.speed), 
            Phaser.Math.Between(-this.speed, this.speed)
        );
    }

    takeDamage(amount) {
        if (this.isDead) return;

        this.hp -= amount;

        if (this.hp <= 0) {
            this.die();
        } else {
            this.anims.play(this.hurtAnim, true);

            this.once("animationcomplete-" + this.hurtAnim, () => {
                this.anims.play(this.walkAnim, true);
            });
        }
    }

    attack() {
        if (this.isDead || this.isAttacking) return;

        this.isAttacking = true;
        this.body.setVelocity(0, 0);

        this.anims.play(this.attackAnim, true);

        this.once("animationcomplete-" + this.attackAnim, () => {
            this.isAttacking = false;
            this.anims.play(this.walkAnim, true);
        });

        this.scene.player.hurt(this.attackDamage); 
    }

    die() {
        this.isDead = true;
        this.body.setVelocity(0, 0);

        this.play(this.deathAnim, true);        
        this.once("animationcomplete-" + this.deathAnim, () => {
            this.dropExperience();
            this.scene.player.kills += 1; 
            
            this.destroy();
        });
        
        this.healthBar.destroy();
    }

    dropExperience() {
        const crystal = this.scene.crystals.create(this.x, this.y, "Exp_drop");
        crystal.setData("xp", this.expValue);         
        crystal.play("Exp_drop");
    }    
    update(player) {
        if (this.isDead) return; 

        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        if (distance <= this.attackRange && !this.isAttacking) {
            this.attack();
            return; 
        }       
        if (!this.isAttacking) {
            this.moveTowardsPlayer(player);
        }

        this.healthBar.update();
        

    }

     moveTowardsPlayer(player) {
        const dir = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
        dir.normalize();

        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
        this.flipX = this.body.velocity.x < 0;
    }
}
