pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ../motion/ts
/usr/lib/nodejs/node-v9.4.0/bin/node dist/app.js 
popd

