export default class StatusBars {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    this.barWidth = 120;
    this.barHeight = 12;
    this.barSpacing = 5;
    this.startX = 20;
    this.startY = 20;
    this.createHealthBar();
    this.createExperienceBar();
    this.createKillCounter();
    this.updateBars();
  }

  createHealthBar() {
    const y = this.startY;
    
    this.healthBarBg = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1000);
    this.healthBarBg.fillStyle(0x333333, 0.8);
    this.healthBarBg.fillRect(this.startX, y, this.barWidth, this.barHeight);
    this.healthBarBg.lineStyle(1, 0x000000, 1);
    this.healthBarBg.strokeRect(this.startX + 0.5, y + 0.5, this.barWidth - 1, this.barHeight - 1);
    
    this.healthBarFill = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1001);
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
    const y = this.startY + this.barHeight + this.barSpacing + 20; 
    
    this.xpBarBg = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1000);
    this.xpBarBg.fillStyle(0x333333, 0.8);
    this.xpBarBg.fillRect(this.startX, y, this.barWidth, this.barHeight);
    this.xpBarBg.lineStyle(1, 0x000000, 1);
    this.xpBarBg.strokeRect(this.startX + 0.5, y + 0.5, this.barWidth - 1, this.barHeight - 1);
    
    this.xpBarFill = this.scene.add.graphics()
      .setScrollFactor(0)
      .setDepth(1001);
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

  createKillCounter() {
    const screenWidth = this.scene.cameras.main.width;
    
    this.killCounterText = this.scene.add.text(screenWidth - 20, 20, 'Kills: 0', {
      fontSize: '16px',
      fill: '#ffffff',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#000000',
      strokeThickness: 3
    })
    .setOrigin(1, 0) 
    .setScrollFactor(0)
    .setDepth(1002);
  }
  updateBars() {
    this.updateHealthBar();
    this.updateExperienceBar();
    this.updateKillCounter();
  }

  updateHealthBar() {
    const healthPercent = this.player.hp / this.player.maxHp;
    const fillWidth = Math.max(0, (this.barWidth - 2) * healthPercent);
    
    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(0xff0000, 1); 
    this.healthBarFill.fillRect(this.startX + 1, this.startY + 1, fillWidth, this.barHeight - 2);
    
    this.healthText.setText(`${Math.ceil(this.player.hp)}/${this.player.maxHp}`);
  }

  updateExperienceBar() {
    const xpPercent = this.player.xp / this.player.xpToNext;
    const fillWidth = Math.max(0, (this.barWidth - 2) * xpPercent);
    const y = this.startY + this.barHeight + this.barSpacing + 20;
    
    this.xpBarFill.clear();
    this.xpBarFill.fillStyle(0x00ff00, 1); 
    this.xpBarFill.fillRect(this.startX + 1, y + 1, fillWidth, this.barHeight - 2);
    
    this.levelText.setText(`Lv.${this.player.level}`);
  }

  updateKillCounter() {
    const kills = this.player.kills || 0; 
    this.killCounterText.setText(`Score: ${kills}`);
  }

  update() {
    this.updateBars();
  }


}
