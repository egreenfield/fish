pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ../motion/ts
node dist/app.js > ../../logs/talk.log 2>&1 &
popd

