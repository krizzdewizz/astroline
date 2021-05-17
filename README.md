# astroline

filter/parse/massage lines from stdin.

## build
```
npm i
npm run build
```

## usage
```
usage: regex [template] [-x] [-c] [-0, -1...]

  regex       Regular expression. All matching lines are printed
  template    Output line containing $0, $1...
              If missing, all regex groups are printed or the whole line if there are no groups
  -x          Execute line instead of printing it
  -c          Print line count
  -0, -1...   Print line with that index
```

## examples

parse a file's date
```
dir | al "^(.{10}).*" "$1"

12.05.2021
12.05.2021
01.02.2021
12.05.2021
09.04.2021
```

replace a file's extension
```
dir /b | al "^(.*)\.json" "copy $0 $1.json.backup"

copy package-lock.json package-lock.json.backup
copy package.json package.json.backup
copy tsconfig.json tsconfig.json.backup
```
