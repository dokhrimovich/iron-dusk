export const move = (distance) => {
    return {
        type: 'MOVE',
        distance
    };
};

export const swordSwing = ({
    dmg,
    shock,
    spd,
    area
}) => {
    return {
        type: 'ATTACK',
        dmg,
        shock,
        spd,
        area
    };
};
