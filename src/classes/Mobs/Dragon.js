import Mob from "../Mob.js";

export default class Dragon extends Mob {

    constructor(scene, x, y) {        
        const dragonConfig = {
            maxHp: 500,
            speed: 40,
            attackDamage: 60,
            expValue: 50,
            attackRange: 3
        };

        super(scene, x, y, "dragon", dragonConfig);
    }
}
