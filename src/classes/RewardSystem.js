export default class RewardSystem {
  constructor(player) {
    this.player = player;
    this.rewardTypes = this.initializeRewardTypes();  }
  
  initializeRewardTypes() {
    return {      // Stat rewards
      health: {
        label: "Max HP +20",
        icon: "Health", // UI asset
        type: "stat",
        apply: (player) => {
          player.maxHp += 20;
          player.hp = Math.min(player.hp + 20, player.maxHp); // Also heal current HP
        }
      },
      
      speed: {
        label: "Move Speed +50",
        icon: "MovementSpeed", // UI asset
        type: "stat",
        apply: (player) => {
          player.speed += 50;
        }
      },
      
      damage: {
        label: "Damage +5",
        icon: "Damage", // UI asset
        type: "stat",
        apply: (player) => {
          player.baseDamage += 5;
        }
      },      
      magnet:{
        label: "Magnet Range +20",
        icon: "Magnet", // UI asset
        type: "stat",
        apply: (player) => {
          player.pickupRange += 20;
        }
      },
      // Spell rewards
      explosion: {
        label: "Unlock Explosion Spell",
        icon: "BlueOval", // Abilities asset
        type: "spell",
        spellName: "explosion",
        unlockLevel: 2,
        apply: (player) => {
          player.unlockSpell("explosion");
          player.currentSpell = "explosion"; // Auto-switch to new spell
        }
      },
        explosionTwoColors: {
        label: "Unlock Two-Color Explosion",
        icon: "ExplosionTwoColors", // Two-color explosion asset
        type: "spell",
        spellName: "explosionTwoColors",
        unlockLevel: 4,
        apply: (player) => {
          player.unlockSpell("explosionTwoColors");
          player.currentSpell = "explosionTwoColors"; 
        }
      },
        nuclearexplosion: {
        label: "Unlock Nuclear Explosion Spell",
        icon: "NuclearExplosion", 
        type: "spell",
        spellName: "nuclearexplosion",
        unlockLevel: 6,
        apply: (player) => {
          player.unlockSpell("nuclearexplosion");
          player.currentSpell = "nuclearexplosion"; 
        }
      }
    };
  }

  getAvailableRewards(maxRewards = 3) {
    const available = [];
    
    // Always include basic stat rewards
    available.push({ key: 'health', ...this.rewardTypes.health });
    available.push({ key: 'speed', ...this.rewardTypes.speed });
    available.push({ key: 'damage', ...this.rewardTypes.damage });
    available.push({ key: 'magnet', ...this.rewardTypes.magnet });

    if (this.player.level >= 2 && !this.player.spells.explosion?.unlocked) {
      available.push({ key: 'explosion', ...this.rewardTypes.explosion });
    }
    
    if (this.player.level >= 4 && !this.player.spells.explosionTwoColors?.unlocked) {
      available.push({ key: 'explosionTwoColors', ...this.rewardTypes.explosionTwoColors });
    }

    if (this.player.level >= 6 && !this.player.spells.nuclearexplosion?.unlocked) {
      available.push({ key: 'nuclearexplosion', ...this.rewardTypes.nuclearexplosion });
    }

    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxRewards);
  }

  applyReward(rewardKey) {
    const reward = this.rewardTypes[rewardKey];
    if (reward && reward.apply) {
      reward.apply(this.player);
      return true;
    }
    return false;
  }

  // Method to add new reward types dynamically
  addRewardType(key, rewardData) {
    this.rewardTypes[key] = rewardData;
  }

  // Method to check if a reward is available
  isRewardAvailable(rewardKey) {
    const reward = this.rewardTypes[rewardKey];
    if (!reward) return false;

    // Check level requirements
    if (reward.unlockLevel && this.player.level < reward.unlockLevel) {
      return false;
    }

    // Check if spell is already unlocked
    if (reward.type === "spell" && this.player.spells[reward.spellName]?.unlocked) {
      return false;
    }

    return true;
  }

  // Get reward by type
  getRewardsByType(type) {
    return Object.entries(this.rewardTypes)
      .filter(([key, reward]) => reward.type === type)
      .map(([key, reward]) => ({ key, ...reward }));
  }
}
