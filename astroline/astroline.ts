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

export function astroline({ inputArgs, printOut, createReadline, processExit }: {
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
    const delim = process.platform === "win32" ? '"' : '\'';
    const example = replaceAll('echo "hello world" | al "(hello).*" "$1 astroline"', '"', delim);
    printOut(`usage: regex [template] [-x] [-c] [-0, -1...]

  regex       Regular expression. All matching lines are printed
  template    Output line containing $0, $1...
              If missing, all regex groups are printed or the whole line if there are no groups
  -x          Execute line instead of printing it
  -c          Print line count
  -0, -1...   Print line with that index
  
example:
  ${example}  
`);
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
