export default class HealthBar {

  constructor(scene, target, config = {}) {
    this.scene  = scene;
    this.target = target;

    this.width           = config.width           ?? 30;
    this.height          = config.height          ?? 4;
    this.offsetY         = config.offsetY         ?? 10;
    this.borderColor     = config.borderColor     ?? 0x000000;
    this.backgroundColor = config.backgroundColor ?? 0x333333;
    this.fillColor       = config.fillColor       ?? 0xff0000;
    this.borderThickness = config.borderThickness ?? 1;
    this.cornerRadius    = config.cornerRadius    ?? 1;

    this.bar = scene.add.graphics();
  }
  update() {
    this.bar.clear();

    const x = this.target.x - this.width  / 2;
    const targetHeight = this.target.displayHeight || this.target.height;
    const y = this.target.y - targetHeight / 2 - this.offsetY;

    this.bar.fillStyle(this.backgroundColor);
    this.bar.fillRoundedRect(x, y, this.width, this.height, this.cornerRadius);

    const pct = Phaser.Math.Clamp(this.target.hp / this.target.maxHp, 0, 1);
    this.bar.fillStyle(this.fillColor);
    this.bar.fillRoundedRect(x, y, this.width * pct, this.height, this.cornerRadius);

    this.bar.lineStyle(this.borderThickness, this.borderColor);
    this.bar.strokeRoundedRect(x, y, this.width, this.height, this.cornerRadius);
  }

  destroy() {
    this.bar.destroy();
  }
}
