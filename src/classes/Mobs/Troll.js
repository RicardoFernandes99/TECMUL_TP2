import Mob from "../Mob.js";

export default class Troll extends Mob {

    constructor(scene, x, y) {        
        const trollConfig = {
            maxHp: 250,
            speed: 30,
            attackDamage: 35,
            expValue: 25,
            attackRange: 2
        };

        super(scene, x, y, "troll", trollConfig);
    }
}
