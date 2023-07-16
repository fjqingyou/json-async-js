#!/bin/bash

export dirPath='./dict/';
# export fileName='json-async-js.gz';


if [ -d $dirPath ] ; then
    echo "remove old directory";
    rm -rf $dirPath;
fi

tsc;

cp package.json $dirPath
cp index.d.ts $dirPath
cp readme.md $dirPath
cp readme-cn.md $dirPath

cd $dirPath

# tar -zcf "../local/"$fileName ./;

echo "finished"
