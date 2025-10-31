const { calculateSum } = require('../../src/utils/math');

describe('Utility Function Tests', () => {
  it('should calculate the sum of two numbers', () => {
    expect(calculateSum(2, 3)).toBe(5);
  });

  it('should return 0 for empty input', () => {
    expect(calculateSum()).toBe(0);
  });
});
