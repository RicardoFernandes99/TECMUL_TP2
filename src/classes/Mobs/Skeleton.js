import Mob from "../Mob.js";

export default class Skeleton extends Mob {

    constructor(scene, x, y) {        
        const skeletonConfig = {
            maxHp: 120,
            speed: 45,
            attackDamage: 15,
            expValue: 15,
            attackRange: 1.2
        };

        super(scene, x, y, "skeleton", skeletonConfig);
    }
}
