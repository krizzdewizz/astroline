import { EOL } from 'os';
import { astroline } from './astroline';

describe('astroline', () => {

  let exitCode;

  function setup(...args: string[]) {
    const out = [];
    let line;

    astroline({
      args: [, , ...args],
      printOut: s => out.push(s),
      createReadline: () => ({
        on: (_, lineCallback) => line = lineCallback
      }),
      processExit: code => exitCode = code
    });

    return { out, line };
  }

  it('should print usage', () => {
    const { out, line } = setup();

    expect(line).toBeUndefined();
    expect(out[0].startsWith('usage:')).toBe(true);
    expect(out[0].endsWith(EOL)).toBe(true);
    expect(exitCode).toBe(1);
  });

  it('should output whole line', () => {
    const { out, line } = setup('.*');

    line('hello');
    line('world');

    expect(out).toEqual(['hello', EOL, 'world']);
  });

  it('should output groups', () => {
    const { out, line } = setup('(.{2})(.{2})');

    line('hello');
    line('world');

    expect(out).toEqual(['hell', EOL, 'worl']);
  });

  it('should output template', () => {
    const { out, line } = setup('(.{2})(.{2})', '$1x$2');

    line('hello');
    line('world');

    expect(out).toEqual(['hexll', EOL, 'woxrl']);
  });

  it('should output only matching lines', () => {
    const { out, line } = setup('hello');

    line('hello');
    line('world');

    expect(out).toEqual(['hello']);
  });

  it('should output only lines by index', () => {
    const { out, line } = setup('^h.*', '-1', '-2');

    line('hello0');
    line('world');
    line('hello1');
    line('bye');
    line('hello2');

    expect(out).toEqual(['hello1', EOL, 'hello2']);
  });
});
