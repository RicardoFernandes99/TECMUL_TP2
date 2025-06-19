
import Slime from "./Mobs/Slime.js";
import Troll from "./Mobs/Troll.js";
import Golem from "./Mobs/Golem.js";
import Skeleton from "./Mobs/Skeleton.js";
import Dragon from "./Mobs/Dragon.js";
import Reaper from "./Mobs/Reaper.js";

export default class Spawner {

    constructor(scene, mobGroup, limitesLayer) {
        this.scene = scene;
        this.mobGroup = mobGroup;
        this.limitesLayer = limitesLayer;

        this.spawnDelay = 500;
        this.maxMobs = 30;

        this.mobClasses = {
            slime: Slime,
            skeleton: Skeleton,
            troll: Troll,
            reaper: Reaper,
            golem: Golem,
            dragon: Dragon
        };

        this.startSpawning();
    }    
    startSpawning() {
        this.scene.time.addEvent({
            delay: this.spawnDelay,
            callback: () => {
                if (this.mobGroup.countActive(true) < this.maxMobs) {
                    this.spawnMob();
                }
            },
            loop: true
        });
    }    
    getMobTypeForLevel() {
        const playerLevel = this.scene.player.level || 1;
        
        if (playerLevel <= 2) {
            return Math.random() < 0.7 ? 'slime' : 'skeleton';
        } else if (playerLevel <= 5) {
            const rand = Math.random();
            if (rand < 0.4) return 'slime';
            if (rand < 0.7) return 'skeleton';
            return 'troll';
        } else if (playerLevel <= 8) {
            const rand = Math.random();
            if (rand < 0.3) return 'slime';
            if (rand < 0.5) return 'skeleton';
            if (rand < 0.7) return 'troll';
            return 'reaper';
        } else if (playerLevel <= 12) {
            const rand = Math.random();
            if (rand < 0.2) return 'slime';
            if (rand < 0.4) return 'skeleton';
            if (rand < 0.6) return 'troll';
            if (rand < 0.8) return 'reaper';
            return 'golem';
        } else {
            const rand = Math.random();
            if (rand < 0.1) return 'slime';
            if (rand < 0.2) return 'skeleton';
            if (rand < 0.4) return 'troll';
            if (rand < 0.6) return 'reaper';
            if (rand < 0.8) return 'golem';
            return 'dragon';
        }
    }
    
    spawnMob() {
        let x, y;
        let attempts = 0;
        const maxAttempts = 50; 
        
        do {
            x = Phaser.Math.Between(100, this.scene.map.widthInPixels - 100);
            y = Phaser.Math.Between(100, this.scene.map.heightInPixels - 100);
            attempts++;
        } while (!this.isValidSpawnPosition(x, y) && attempts < maxAttempts);
        
        if (attempts >= maxAttempts) {
            console.warn("Could not find valid spawn position for mob");
            return;
        }

        const mobType = this.getMobTypeForLevel();
        const MobClass = this.mobClasses[mobType];

        const mob = new MobClass(this.scene, x, y);

        this.scaleMobForLevel(mob);

        this.mobGroup.add(mob);
        this.scene.physics.add.collider(mob, this.limitesLayer);
    }    

    scaleMobForLevel(mob) {
        const playerLevel = this.scene.player.level || 1;        
        const hpMultiplier = 1 + (playerLevel - 1) * 0.2;
        const damageMultiplier = 1 + (playerLevel - 1) * 0.15;
        const speedMultiplier = 1 + (playerLevel - 1) * 0.1;

        mob.maxHp = Math.floor(mob.maxHp * hpMultiplier);
        mob.hp = mob.maxHp;
        mob.attackDamage = Math.floor(mob.attackDamage * damageMultiplier);
        mob.speed = Math.floor(mob.speed * speedMultiplier);
        mob.expValue = Math.floor(mob.expValue * (1 + (playerLevel - 1) * 0.1));
    }

    isValidSpawnPosition(x, y) {
        const tileX = Math.floor(x / this.limitesLayer.tilemap.tileWidth);
        const tileY = Math.floor(y / this.limitesLayer.tilemap.tileHeight);
        
        const tile = this.limitesLayer.getTileAt(tileX, tileY);
        
        return !tile || !tile.collides;
    }
}
