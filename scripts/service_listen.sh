pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
./activate_bluetooth.sh
cd ../server
/usr/lib/nodejs/node-v9.4.0/bin/node dist/app.js listen
/bin/echo "listen service exited"
popd

