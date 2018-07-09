conduct leaf wall visit acid ask trumpet win country vault pig security


Next Goals:
- Create a few more elaborate contract
- figure out how to properly store admins (potentially ask on the admin)
- Test deploying the web app and make sure it points to the deployed contract

commands
- ganache-cli
- truffle migrate --reset
- npm run start


Order of operations
1. truffle unbox react
2. change truffle.js and getWeb3.js (line 24) files as indicated
3. run > ganache-cli and copy mneumoic
4. paste the mneumonic to metamask and go to localhost:8545
5. run > truffle migrate --reset
6. npm run start


-------- Steps I took
1. truffle unbox react-uport
2. go to appmanger.uport.me
3. create uport account. Instead of signing in you, use your phone to authenticate requests


Need to Figure out how to:
- https://ethereum.stackexchange.com/questions/38865/how-to-deploy-a-truffle-app-in-heroku
- For the connect uport, make sure to put in on the server somewhere in a lambda function
- Persist uPort Login in local storage


Locally Start
1. run > ganache-cli and copy mneumoic
2. paste the mneumonic to metamask and go to localhost:8545
3. run > truffle migrate --reset
4. npm run start

Notes
- deploying with Infura and Truffle: https://truffleframework.com/tutorials/using-infura-custom-provider
    1. `truffle compile`
    2. `truffle migrate --network rinkeby`
    3. `npm run contracts:sync-src`
- to check your deployed contract:
    1. Go to remix, (Environment should be Injected Web3) and paste in address and click "at Address"




Casino Contract:
- https://medium.com/@merunasgrincalaitis/the-ultimate-end-to-end-tutorial-to-create-and-deploy-a-fully-descentralized-dapp-in-ethereum-18f0cf6d7e0e


Note About Functions:
The functions in solidity always return transaction hash. You can use constant functions to return values. The constant functions can not change the state of contract.

If you need to change state of contract in a function and aslo want to return some value, Events are best possible solution AFAIK.




Ganache-CLI:
- ramp blind chair various dog awake evil mouse melt brother cactus tape


HEROKU:
git push heroku-dev ak-adjust-4: master