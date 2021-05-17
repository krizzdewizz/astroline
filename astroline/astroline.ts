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
  return match.reduce((s, curr, i) => replaceAll(s, `\$${i}`, curr), format);
}

export function astroline({ inputArgs, printOut, createReadline, processExit, }: {
  inputArgs: string[],
  printOut: (s: string) => void,
  createReadline: () => any,
  processExit: (code: number) => void
} = {
  inputArgs: process.argv.slice(2),
  printOut: s => process.stdout.write(s),
  createReadline: () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  }),
  processExit: code => process.exit(code),
}) {

  const { args, lineIndices, exec, count } = parseArgs(inputArgs);
  const [regex, format = ''] = args;

  if (!regex) {
    printOut(
        `usage: regex [output line containing $1, $2 etc] [-x to execute] [-c to return count lines] [-0, -1... to output line with that index]${EOL}`);
    processExit(1);
    return;
  }

  const print: (s: string) => void = exec ? xargs : printOut;

  const re = new RegExp(regex);

  let hadLine = false;
  let lineIndex = -1;
  let terminate = false;
  const filterByLineIndex = Object.keys(lineIndices).length > 0;

  const rl = createReadline();

  process.on('SIGINT', () => {
    terminate = true;
    rl.close();
  });

  rl.on('close', () => {
    if (terminate) {
      return;
    }
    if (count) {
      print(String(lineIndex + 1));
    }
    print(EOL);
  });

  rl.on('line', (line: string) => {
    if (terminate) {
      return;
    }

    const match = line.match(re);
    if (!match) {
      return;
    }

    lineIndex++;

    if (count || filterByLineIndex && !lineIndices[lineIndex]) {
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
      print(match.length === 1 ? match[0] : match.slice(1).join(''));
    }
  });
}
