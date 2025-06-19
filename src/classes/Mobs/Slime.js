import Mob from "../Mob.js";

export default class Slime extends Mob {

    constructor(scene, x, y) {        
        const slimeConfig = {
            maxHp: 100,
            speed: 50,
            attackDamage: 10,
            expValue: 10,
            attackRange: 1
        };

        super(scene, x, y, "slime", slimeConfig);
    }}