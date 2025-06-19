import Mob from "../Mob.js";

export default class Golem extends Mob {

    constructor(scene, x, y) {        
        const golemConfig = {
            maxHp: 300,
            speed: 35,
            attackDamage: 40,
            expValue: 40,
            attackRange: 1.5
        };

        super(scene, x, y, "golem", golemConfig);
    }
}
