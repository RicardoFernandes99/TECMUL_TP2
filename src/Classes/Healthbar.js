export default class HealthBar {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Sprite} target   Sprite to follow
   * @param {object} [config]
   * @param {number} [config.width=40]
   * @param {number} [config.height=6]
   * @param {number} [config.offsetY=10]   Vertical offset above the sprite
   */
  constructor(scene, target, config = {}) {
    this.scene = scene;
    this.target = target;
    this.width  = config.width  ?? 40;
    this.height = config.height ?? 6;
    this.offsetY = config.offsetY ?? 10;

    // Create a single Graphics object
    this.bar = scene.add.graphics();
  }

  update() {
    // clear old
    this.bar.clear();

    // background
    const x = this.target.x - this.width/2;
    const y = this.target.y - this.target.height/2 - this.offsetY;
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(x, y, this.width, this.height);

    // fill
    const pct = Phaser.Math.Clamp(this.target.hp / this.target.maxHp, 0, 1);
    this.bar.fillStyle(0xff0000);
    this.bar.fillRect(x, y, this.width * pct, this.height);
  }

  destroy() {
    this.bar.destroy();
  }
}
