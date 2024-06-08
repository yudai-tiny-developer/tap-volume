export const storage = [
    'v1', 'v1_enabled',
    'v2', 'v2_enabled',
    'v3', 'v3_enabled',
    'v4', 'v4_enabled',
    'v5', 'v5_enabled',
    'hide_slider',
];

export const default_v1 = 1;
export const default_v2 = 25;
export const default_v3 = 50;
export const default_v4 = 75;
export const default_v5 = 100;

export const min_volume = 0;
export const max_volume = 100;
export const step_volume = 1;

export const default_v1_enabled = false;
export const default_v2_enabled = true;
export const default_v3_enabled = true;
export const default_v4_enabled = true;
export const default_v5_enabled = true;

export const default_hide_slider = false;

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
