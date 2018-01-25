pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ../motion/ts
#node dist/app.js -i > ../../logs/talk.log 2>&1 &
node dist/app.js -i
popd

