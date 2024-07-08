export function Clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
}
export const formatNum = (num: number, digits: number = 0) => {
    const lookup = [
        {value: 1, symbol: ''},
        {value: 1e3, symbol: 'k'},
        {value: 1e6, symbol: 'M'},
        {value: 1e9, symbol: 'G'},
        {value: 1e12, symbol: 'T'},
        {value: 1e15, symbol: 'P'},
        {value: 1e18, symbol: 'E'},
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find(item => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
};
// n >= 1000 ? `${(n / 1000).toFixed(toFixedCount)}К` : `${n}`;

export const replaceRegexByArray = function (text: string, replacements: (string | number)[]) {
    const regex = /(\%s)/g;
    const _text = text.replace(regex, () => replacements.shift());
    return _text;
};

export const getObjectId = (id: string) => {
    return id === '000000000000000000000000' ? '0' : id;
};

const RAD_PER_DEG = Math.PI / 180;

function toRad(deg: number) {
    return deg * RAD_PER_DEG;
}

function toDeg(rad: number) {
    return rad / RAD_PER_DEG;
}

export function compassHeading({alpha, beta, gamma}: {alpha: number; beta: number; gamma: number}) {
    if (typeof alpha !== 'number' || typeof beta !== 'number' || typeof gamma !== 'number') {
        return;
    }

    const _x = toRad(beta);
    const _y = toRad(gamma);
    const _z = toRad(alpha);

    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    // const cX = Math.cos(_x);
    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);

    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let heading = Math.atan(Vx / Vy);

    // Convert from half unit circle to whole unit circle
    if (Vy < 0) {
        heading += Math.PI;
    } else if (Vx < 0) {
        heading += 2 * Math.PI;
    }

    return toDeg(heading);
}
