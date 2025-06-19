export default class HealthBar {

  constructor(scene, target, config = {}) {
    this.scene = scene;
    this.target = target;

    this.width = config.width ?? 30;
    this.height = config.height ?? 4;
    this.offsetY = config.offsetY ?? 10;
    this.borderColor = config.borderColor ?? 0x000000;
    this.backgroundColor = config.backgroundColor ?? 0x333333;
    this.fillColor = config.fillColor ?? 0xff0000;
    this.borderThickness = config.borderThickness ?? 1;
    this.cornerRadius = config.cornerRadius ?? 1;

    this.staminaHeight = 2;
    this.staminaOffsetY = 2; 
    this.staminaColor = 0x0088ff; 
    this.staminaEmptyColor = 0x444444; 
    this.bar = scene.add.graphics();
  }
  update() {
    this.bar.clear();

    const x = this.target.x - this.width / 2;
    const targetHeight = this.target.displayHeight || this.target.height;
    const y = this.target.y - targetHeight / 2 - this.offsetY;

    this.bar.fillStyle(this.backgroundColor);
    this.bar.fillRoundedRect(x, y, this.width, this.height, this.cornerRadius);

    const pct = Phaser.Math.Clamp(this.target.hp / this.target.maxHp, 0, 1);
    this.bar.fillStyle(this.fillColor);
    this.bar.fillRoundedRect(x, y, this.width * pct, this.height, this.cornerRadius);

    this.bar.lineStyle(this.borderThickness, this.borderColor);
    this.bar.strokeRoundedRect(x, y, this.width, this.height, this.cornerRadius);

    const currentTime = Date.now();
    const timeSinceLastTurbo = currentTime - this.target.turboLastUsed;

    if (timeSinceLastTurbo < this.target.turboCooldown) {
      const staminaY = y + this.height + this.staminaOffsetY;

      this.bar.fillStyle(this.staminaEmptyColor);
      this.bar.fillRoundedRect(x, staminaY, this.width, this.staminaHeight, this.cornerRadius);

      let staminaPct = 0;

      if (this.target.turboMode) {
        const timeInTurbo = currentTime - this.target.turboStartTime;
        staminaPct = Math.max(0, 1 - (timeInTurbo / this.target.turboDuration));
      } else {
        const cooldownProgress = timeSinceLastTurbo / this.target.turboCooldown;
        staminaPct = Math.min(1, cooldownProgress);
      }

      this.bar.fillStyle(this.staminaColor);
      this.bar.fillRoundedRect(x, staminaY, this.width * staminaPct, this.staminaHeight, this.cornerRadius);

      this.bar.lineStyle(this.borderThickness, this.borderColor);
      this.bar.strokeRoundedRect(x, staminaY, this.width, this.staminaHeight, this.cornerRadius);
    }
  }

  destroy() {
    this.bar.destroy();
  }
}
