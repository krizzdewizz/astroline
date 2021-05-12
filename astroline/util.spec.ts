import { indexArg } from './util';

describe('util', () => {

  describe('indexArg', () => {
    it('should parse index', () => {
      expect(indexArg('')).toBeUndefined();
      expect(indexArg('x')).toBeUndefined();
      expect(indexArg('-x')).toBeUndefined();
      expect(indexArg('--1')).toBeUndefined();
      expect(indexArg('-1')).toBe(1);
      expect(indexArg('-99')).toBe(99);
    });
  });
});
