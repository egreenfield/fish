pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
./activate_bluetooth.sh
cd ../ptt/ts
/usr/lib/nodejs/node-v9.4.0/bin/node dist/las.js listen
popd

