export const move = () => {
    return {
        type: 'MOVE'
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
