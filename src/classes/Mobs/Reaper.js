import Mob from "../Mob.js";

export default class Reaper extends Mob {

    constructor(scene, x, y) {        
        const reaperConfig = {
            maxHp: 200,
            speed: 55,
            attackDamage: 45,
            expValue: 30,
            attackRange: 2.5
        };

        super(scene, x, y, "reaper", reaperConfig);
    }
}
