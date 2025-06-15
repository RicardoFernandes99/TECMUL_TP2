
import Slime from "./Slime.js";

export default class Spawner {

    /**
     * @param {Phaser.Scene} scene - Reference to your Level scene
     * @param {Phaser.GameObjects.Group} slimeGroup - The group where slimes go
     * @param {Phaser.Tilemaps.TilemapLayer} limitesLayer - To add collisions
     */
    constructor(scene, slimeGroup, limitesLayer) {
        this.scene = scene;
        this.slimeGroup = slimeGroup;
        this.limitesLayer = limitesLayer;

        this.spawnDelay = 500; // ms → spawn every 3 sec
        this.maxSlimes = 30;    // Max slimes at once
        this.level = 1;         // Game level → makes slimes stronger

        this.startSpawning();
    }

    startSpawning() {
        this.scene.time.addEvent({
            delay: this.spawnDelay,
            callback: () => {
                if (this.slimeGroup.countActive(true) < this.maxSlimes) {
                    this.spawnSlime();
                }
            },
            loop: true
        });
    }    
    spawnSlime() {
        let x, y;
        let attempts = 0;
        const maxAttempts = 50; // Prevent infinite loops
        
        // Keep trying to find a valid spawn position
        do {
            x = Phaser.Math.Between(100, this.scene.map.widthInPixels - 100);
            y = Phaser.Math.Between(100, this.scene.map.heightInPixels - 100);
            attempts++;
        } while (!this.isValidSpawnPosition(x, y) && attempts < maxAttempts);
        
        // If we couldn't find a valid position after max attempts, skip spawning
        if (attempts >= maxAttempts) {
            console.warn("Could not find valid spawn position for slime");
            return;
        }

        const slime = new Slime(this.scene, x, y);

        // Make slime stronger based on level
        slime.hp = 50 + this.level * 20;
        slime.maxHp = slime.hp;
        slime.speed = 40 + this.level * 5;

        this.slimeGroup.add(slime);
        this.scene.physics.add.collider(slime, this.limitesLayer);
    }

    /**
     * Check if a position is valid for spawning (not in collision tiles)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} - True if position is valid for spawning
     */
    isValidSpawnPosition(x, y) {
        // Convert world coordinates to tile coordinates
        const tileX = Math.floor(x / this.limitesLayer.tilemap.tileWidth);
        const tileY = Math.floor(y / this.limitesLayer.tilemap.tileHeight);
        
        // Get the tile at this position
        const tile = this.limitesLayer.getTileAt(tileX, tileY);
        
        // If there's no tile or the tile doesn't collide, it's a valid position
        return !tile || !tile.collides;
    }

    increaseDifficulty() {
        this.level += 1;
    }
}
