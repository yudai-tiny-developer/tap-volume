export const storage = ['v1', 'v2', 'v3', 'v4'];

export const default_v1 = 25;
export const default_v2 = 50;
export const default_v3 = 75;
export const default_v4 = 100;
export const min_volume = 0;
export const max_volume = 100;
export const step_volume = 1;

export function value(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

export function limitValue(value, defaultValue, minValue, maxValue, stepValue) {
    return step(range(normalize(value, defaultValue), minValue, maxValue), stepValue);
}

function isNumber(value) {
    return Number.isFinite(parseFloat(value));
}

function normalize(value, defaultValue) {
    return isNumber(value) ? value : defaultValue;
}

function range(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
}

function step(value, stepValue) {
    const step = 1.0 / stepValue;
    return Math.round(value * step) / step;
}
