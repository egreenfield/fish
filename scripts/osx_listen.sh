pushd .
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ../server
node dist/app.js listen
echo "listen service exited"
popd

