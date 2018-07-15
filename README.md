commands
- ganache-cli
- paste the mneumonic to metamask and go to localhost:8545
- truffle migrate --reset
- npm run start

Steps to Set up Uport Account So you Can Sign in
1. truffle unbox react-uport
2. go to https://appmanager.uport.me/
3. create uport account. Instead of signing in you, use your phone to authenticate requests

Locally Start
1. run > ganache in gui (or ganache-cli with port 7545). Copy mneumonic and paste it in metamask.
2. create a custom RPC in metamask with `http://localhost:7545` to match local ganache environment
3. paste the mneumonic to metamask and go to localhost:8545
4. run > truffle migrate --reset
5. npm run start

If you were to do deployment of contract to test network from scratch, there are a few initial steps:
1. Set up infura at https://infura.io/
2. Set up a metamask account. You need to downdload the metamask chrome extension, then create an account then save the mneumonic
3. You need to fill up your rinkeby account with fake ethereum. Go to https://faucet.rinkeby.io/ and follow the steps
4. Now that you have the infura rinkeby url and the mneumonic, update the turffle hd wallet in `truffle.js` file.
5. Follow the next steps below to deploy contract
- some of the steps where taken from the following doc: https://truffleframework.com/tutorials/using-infura-custom-provider

To Deploy Contract To Test Network:
 - Run `deploy:contracts-rinkeby`. This does 3 things:
 1. Compiles contract with `truffle compile`
 2. Deploys it to rinkeby test network and keep tracks of account # with `truffle migrate --network rinkeby`
 3. copies over the contract json file into `/src..` folder `npm run contracts:sync-src`
 - to check your deployed contract:
    1. Go to http://remix.ethereum.org/
    2. (Environment should be Injected Web3) and paste in address of deployed contract and click "at Address"
    3. You should be able to work with your contract as you normally would
 - You can then deploy the app to heroku using heroku cli and it will point to the account on test network. Make sure you have the properly

Other interesting contracts with explainations:
- https://medium.com/@merunasgrincalaitis/the-ultimate-end-to-end-tutorial-to-create-and-deploy-a-fully-descentralized-dapp-in-ethereum-18f0cf6d7e0e


Note About Functions:
- The functions in solidity always return transaction hash. You can use constant functions to return values. The constant functions can not change the state of contract.
- If you need to change state of contract in a function and aslo want to return some value, Events are best possible solution AFAIK.


 To deploy a web app to heroku
 1. Install heroku if you don't have it available `brew install heroku/brew/heroku`
 2. Login with heroku credentials by entering `heroku login`
 3. Create a heroku environment `heroku create __app_name__`
 4. Add a remote heroku branch with the git url you created in previous step. (It's the second link.) `git remote add heroku __name_of_heroku_git_link__`
 - before deploying make sure your contract json files are up to date in `src/contracts` and are pointing to rinkeby test network
 5. Deploy to heroku by entering `git push origin heroku master`
 6. If you want to deploy a local brach instead of local master, enter `git push origin heroku your_branch:master`

HEROKU commands:
- `git push heroku-dev branch:master`

Security Holes:
- We are using test networks so real ethereum is not currently at stake as this is a sample app
- *** Because we want the sample app to work with little set up work once the repo is cloned, however, there are some security holes that MUST be addresses in a real production setting. Improvements to Be Made are as follows:
1. uport credentials are not secure. (Uses rinkeby test network). Make sure these credentials are not discoverable by public in the future
2. truffle.js credentials are not secure. (Currently using a mneumonic created by metamask)


This repo was built from react-uport truffle scaffold. These were the initial order of operations To Start the app:
1. truffle unbox react
2. change truffle.js and getWeb3.js (line 24) files as indicated
3. run > ganache-cli and copy mneumoic
4. paste the mneumonic to metamask and go to localhost:8545
5. run > truffle migrate --reset
6. npm run start


Biggest frustation so far:
- figuring out all configs when deploying the application either locally or to a test network
- sometimes local deployment would work on initial contract method call, but then when I was trying to update the contract, the contract seems to have succeeded



Getting account balances:
- https://stackoverflow.com/questions/32312884/how-do-i-get-the-balance-of-an-account-in-ethereum
```
web3.eth.defaultAccount = user.ethAddress
web3.eth.coinbase = user.ethAddress

web3.eth.getAccounts((err, acc) => {
  console.log('acc -->', acc)
  each(acc, (e) => {
    web3.eth.getBalance(e, (error, result) => {
      if (!error) {
        console.log(e + ': ' + result)
        console.log('Result from web3', result)
      }
    })
  })
})
```


Limitations of solidity:
- cannot send back objects
- cannot send arrays of uknown length
-  there is no optional parameters in Solidity
