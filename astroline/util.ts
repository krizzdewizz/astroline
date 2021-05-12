export function replaceAll(s: string, a: string, b: string): string {
  return s.split(a).join(b);
}

const INDEX_ARG = /^-(\d*)$/;

export function indexArg(arg: string): number {
  const match = arg.match(INDEX_ARG);
  return match ? Number(match[1]) : undefined;
}

export function parseArgs(args: string[]): { args: string[], lineIndices: Record<number, true>, exec: boolean } {

  const newArgs = [];
  const lineIndices = {};
  let exec = false;

  args.forEach(a => {
    if (a === '-x') {
      exec = true;
      return;
    }

    const idx = indexArg(a);
    if (idx === undefined) {
      newArgs.push(a);
    } else {
      lineIndices[idx] = true;
    }
  });

  return { args: newArgs, lineIndices, exec };
}
