export default class SkillBar {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.skillSlots = [];
    
    // UI configuration
    this.slotSize = 32;
    this.slotSpacing = 8;
    this.startX = 20;
    this.startY = this.scene.cameras.main.height - 42; // 20px from bottom
    
    this.createSkillSlots();
    this.updateSkillSlots();
  }

  createSkillSlots() {
    // Create 4 skill slots
    for (let i = 0; i < 4; i++) {
      const x = this.startX + (i * (this.slotSize + this.slotSpacing));
      const y = this.startY;
        // Create slot background with crisp positioning
      const slotBg = this.scene.add.rectangle(Math.round(x), Math.round(y), this.slotSize, this.slotSize, 0x333333, 0.8)
        .setOrigin(0, 0)
        .setScrollFactor(0) // Keep UI fixed on screen
        .setDepth(1000);
      
      // Create slot border with crisp lines
      const slotBorder = this.scene.add.graphics()
        .setScrollFactor(0)
        .setDepth(1001);
      slotBorder.lineStyle(1, 0x666666, 1);
      slotBorder.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, this.slotSize - 1, this.slotSize - 1);
      
      // Create skill icon (will be set later)
      const skillIcon = this.scene.add.image(x + this.slotSize/2, y + this.slotSize/2, '')
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(1002)
        .setVisible(false);
        // Create key number text with crisp rendering
      const keyText = this.scene.add.text(Math.round(x + 4), Math.round(y + 4), (i + 1).toString(), {
        fontSize: '12px',
        fill: '#ffffff',
        fontStyle: 'bold',
        resolution: 2
      })
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1003);
      
      // Store slot data
      this.skillSlots.push({
        index: i,
        background: slotBg,
        border: slotBorder,
        icon: skillIcon,
        keyText: keyText,
        spellName: null
      });
    }
  }  updateSkillSlots() {
    const spellNames = Object.keys(this.player.spells);
    
    this.skillSlots.forEach((slot, index) => {
      const spellName = spellNames[index];
      const spell = spellName ? this.player.spells[spellName] : null;
        if (spell && spell.unlocked) {
        // Show the skill
        slot.spellName = spellName;
        slot.icon.setVisible(true);
          // Set icon based on spell type
        switch(spellName) {
          case 'rock':
            slot.icon.setTexture('rock');
            break;
          case 'explosion':
            slot.icon.setTexture('BlueOval'); // Use same as reward system
            break;
          case 'explosionTwoColors':
            slot.icon.setTexture('ExplosionTwoColors'); // Two-color explosion asset
            break;
          // Add more spell icons here
          default:
            slot.icon.setTexture('rock'); // fallback
        }
        
        // Fit icon to square with more padding to avoid covering the number
        slot.icon.setDisplaySize(this.slotSize - 12, this.slotSize - 12);
        
        // Highlight if this is the current spell
        if (spellName === this.player.currentSpell) {
          slot.border.clear();
          slot.border.lineStyle(2, 0x00ff00, 1); // Thicker green border for active
          slot.border.strokeRect(Math.round(this.startX + (index * (this.slotSize + this.slotSpacing))) + 0.5, 
                                Math.round(this.startY) + 0.5, this.slotSize - 1, this.slotSize - 1);
          slot.background.setFillStyle(0x004400, 0.9); // Darker green background
        } else {
          slot.border.clear();
          slot.border.lineStyle(1, 0x666666, 1); // Default border
          slot.border.strokeRect(Math.round(this.startX + (index * (this.slotSize + this.slotSpacing))) + 0.5, 
                                Math.round(this.startY) + 0.5, this.slotSize - 1, this.slotSize - 1);
          slot.background.setFillStyle(0x333333, 0.8); // Default background
        }
      } else {
        // Hide the skill (not unlocked)
        slot.spellName = null;
        slot.icon.setVisible(false);
        slot.border.clear();
        slot.border.lineStyle(1, 0x444444, 1); // Darker border for locked
        slot.border.strokeRect(Math.round(this.startX + (index * (this.slotSize + this.slotSpacing))) + 0.5, 
                              Math.round(this.startY) + 0.5, this.slotSize - 1, this.slotSize - 1);
        slot.background.setFillStyle(0x222222, 0.6); // Darker background for locked
      }
    });
  }

  update() {
    // Update the skill bar (in case spells change or current spell changes)
    this.updateSkillSlots();
  }

  destroy() {
    this.skillSlots.forEach(slot => {
      slot.background.destroy();
      slot.border.destroy();
      slot.icon.destroy();
      slot.keyText.destroy();
    });
  }
}
