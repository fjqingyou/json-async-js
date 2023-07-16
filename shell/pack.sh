#!/bin/bash

export dirPath='./dict/';
# export fileName='json-async-js.gz';

tsc;

cp package.json $dirPath
cp index.d.ts $dirPath
cp readme.md $dirPath
cp readme-cn.md $dirPath

cd $dirPath

# tar -zcf "../local/"$fileName ./;
