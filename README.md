# astroline

filter/parse/massage lines from stdin

## usage
```
astroline regex [output line containing $1, $2 etc] [-x to execute] [-0, -1... to output line with that index]
```

## examples

parse a file's date
```
dir | al "^(\d{2}\.\d{2}\.\d{4}).*" "$1"

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
