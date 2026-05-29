"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('sum', () => {
    it('should sum two numbers', () => {
        expect((0, src_1.sum)(1, 2)).toBe(3);
    });
});
