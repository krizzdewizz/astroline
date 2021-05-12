export function replaceAll(s: string, a: string, b: string): string {
  return s.split(a).join(b);
}

const INDEX_ARG = /^-(\d*)$/;

export function indexArg(arg: string): number {
  const match = arg.match(INDEX_ARG);
  return match ? Number(match[1]) : undefined;
}

export function parseArgs(inputArgs: string[]): { args: string[], lineIndices: Record<number, true>, exec: boolean } {

  const args = [];
  const lineIndices = {};
  let exec = false;

  inputArgs.forEach(a => {
    if (a === '-x') {
      exec = true;
      return;
    }

    const idx = indexArg(a);
    if (idx === undefined) {
      args.push(a);
    } else {
      lineIndices[idx] = true;
    }
  });

  return { args, lineIndices, exec };
}
