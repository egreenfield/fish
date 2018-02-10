cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
sudo systemctl stop cloudtalk
cd ../client
yarn install
#yarn build
cd ../server
npm install
npm run build
sudo systemctl start cloudtalk

