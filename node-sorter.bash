set -e
source $NVM_DIR/nvm.sh

NODE_VERSION=$1
ELEMENT_COUNT=$2

if ! nvm use $NODE_VERSION; then
  if ! nvm install $NODE_VERSION; then
    exit 1
  fi
fi

node sorter.js ELEMENT_COUNT

nvm use system
