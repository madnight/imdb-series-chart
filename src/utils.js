const memoize = require('fast-memoize')

export const pad = (number, digits) =>
    Array(Math.max(digits - String(number).length + 1, 0))
        .join(0) + number

/* eslint-disable no-unused-vars */
export const randomColor = memoize((i) =>
    `#${Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, 0)}`)

export const query = str => str.replace(/ /g, "+")
