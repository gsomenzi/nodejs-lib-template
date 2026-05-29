
Object.defineProperty(exports, "__esModule", { value: true });
const src1 = require("../src");
describe('sum', () => {
    it('should sum two numbers', () => {
        expect(src1.sum(1, 2)).toBe(3);
    });
});
