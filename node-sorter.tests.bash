source $NVM_DIR/nvm.sh

NODE_VERSION=$1

if [[ -z $GITHUB_ACTIONS ]]; then
  if ! nvm use $NODE_VERSION; then
    if ! nvm install $NODE_VERSION; then
      exit 1
    fi
  fi
fi

node test/runner.js

if [[ -z $GITHUB_ACTIONS ]]; then
  nvm use system
fi
