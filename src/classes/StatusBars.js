export default class StatusBars {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    // UI configuration
    this.barWidth = 120;
    this.barHeight = 12;
    this.barSpacing = 5;
    this.startX = 20;
    this.startY = 20;
    
    this.createHealthBar();
    this.createExperienceBar();
    this.updateBars();
  }

  createHealthBar() {
    const y = this.startY;
    
    // Health bar background
    this.healthBarBg = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1000);
    this.healthBarBg.fillStyle(0x333333, 0.8);
    this.healthBarBg.fillRect(this.startX, y, this.barWidth, this.barHeight);
    this.healthBarBg.lineStyle(1, 0x000000, 1);
    this.healthBarBg.strokeRect(this.startX + 0.5, y + 0.5, this.barWidth - 1, this.barHeight - 1);
    
    // Health bar fill
    this.healthBarFill = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1001);
      // Health bar label
    this.healthLabel = this.scene.add.text(this.startX, y - 15, 'HP', {
      fontSize: '12px',
      fill: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#000000',
      strokeThickness: 2
    })
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(1002);
    
    // Health text (current/max)
    this.healthText = this.scene.add.text(this.startX + this.barWidth + 8, y + 1, '', {
      fontSize: '10px',
      fill: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#000000',
      strokeThickness: 2
    })
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(1002);
  }

  createExperienceBar() {
    const y = this.startY + this.barHeight + this.barSpacing + 20; // Below health bar
    
    // Experience bar background
    this.xpBarBg = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1000);
    this.xpBarBg.fillStyle(0x333333, 0.8);
    this.xpBarBg.fillRect(this.startX, y, this.barWidth, this.barHeight);
    this.xpBarBg.lineStyle(1, 0x000000, 1);
    this.xpBarBg.strokeRect(this.startX + 0.5, y + 0.5, this.barWidth - 1, this.barHeight - 1);
    
    // Experience bar fill
    this.xpBarFill = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1001);
      // Experience bar label
    this.xpLabel = this.scene.add.text(this.startX, y - 15, 'XP', {
      fontSize: '12px',
      fill: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#000000',
      strokeThickness: 2
    })
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(1002);
    
    // Level text
    this.levelText = this.scene.add.text(this.startX + this.barWidth + 8, y + 1, '', {
      fontSize: '10px',
      fill: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#000000',
      strokeThickness: 2
    })
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(1002);
  }

  updateBars() {
    this.updateHealthBar();
    this.updateExperienceBar();
  }

  updateHealthBar() {
    const healthPercent = this.player.hp / this.player.maxHp;
    const fillWidth = Math.max(0, (this.barWidth - 2) * healthPercent);
    
    // Clear and redraw health bar fill
    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(0xff0000, 1); // Red color
    this.healthBarFill.fillRect(this.startX + 1, this.startY + 1, fillWidth, this.barHeight - 2);
    
    // Update health text
    this.healthText.setText(`${Math.ceil(this.player.hp)}/${this.player.maxHp}`);
  }

  updateExperienceBar() {
    const xpPercent = this.player.xp / this.player.xpToNext;
    const fillWidth = Math.max(0, (this.barWidth - 2) * xpPercent);
    const y = this.startY + this.barHeight + this.barSpacing + 20;
    
    // Clear and redraw experience bar fill
    this.xpBarFill.clear();
    this.xpBarFill.fillStyle(0x00ff00, 1); // Green color
    this.xpBarFill.fillRect(this.startX + 1, y + 1, fillWidth, this.barHeight - 2);
    
    // Update level text
    this.levelText.setText(`Lv.${this.player.level}`);
  }

  update() {
    this.updateBars();
  }

  destroy() {
    if (this.healthBarBg) this.healthBarBg.destroy();
    if (this.healthBarFill) this.healthBarFill.destroy();
    if (this.healthLabel) this.healthLabel.destroy();
    if (this.healthText) this.healthText.destroy();
    if (this.xpBarBg) this.xpBarBg.destroy();
    if (this.xpBarFill) this.xpBarFill.destroy();
    if (this.xpLabel) this.xpLabel.destroy();
    if (this.levelText) this.levelText.destroy();
  }
}
