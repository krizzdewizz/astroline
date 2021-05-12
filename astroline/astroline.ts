import * as readline from 'readline';
import { spawn } from 'child_process';
import { EOL } from 'os';
import { parseArgs, replaceAll } from './util';

function xargs(cmd: string) {
  spawn(cmd, {
    stdio: 'inherit',
    shell: true,
  });
}

function fmt(match: RegExpMatchArray, format: string): string {
  let out = format;
  for (let i = 0; i < match.length; i++) {
    out = replaceAll(out, `\$${i}`, match[i]);
  }
  return out;
}

export function astroline({ args, printOut, createReadline, processExit, }: {
  args: string[],
  printOut: (s: string) => void,
  createReadline: () => any,
  processExit: (code) => void
} = {
  args: process.argv.slice(2),
  printOut: s => process.stdout.write(s),
  createReadline: () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  }),
  processExit: code => process.exit(code),
}) {

  const { args: newArgs, lineIndices, exec } = parseArgs(args);
  args = newArgs;

  const [regex, format = ''] = args;

  if (!regex) {
    printOut(
        `usage: regex [output line containing $1, $2 etc] [-x to execute] [-0, -1... to output line with that index]${EOL}`);
    processExit(1);
    return;
  }

  const print: (s: string) => void = exec
      ? xargs
      : printOut;

  const re = new RegExp(regex);

  let hadLine = false;
  let lineIndex = -1;
  const filterByLineIndex = Object.keys(lineIndices).length > 0;

  const rl = createReadline();

  rl.on('line', (line: string) => {

    const match = line.match(re);
    if (!match) {
      return;
    }

    lineIndex++;

    if (filterByLineIndex && !lineIndices[lineIndex]) {
      return;
    }

    if (hadLine) {
      print(EOL);
    } else {
      hadLine = true;
    }

    if (format) {
      print(fmt(match, format));
    } else {
      if (match.length === 1) {
        print(line);
      } else {
        let s = '';
        for (let i = 1; i < match.length; i++) {
          s += match[i];
        }
        print(s);
      }
    }
  });
}
