const Web3 = require('web3');
const Erc20Test = require('./abis/Erc20Test.json');

const express = require('express')
const app = express();
const port = 8000;

const ERC20_CONTRACT_ADDRESS = "0x9AF558ab88f9c2e55477dBf04F531b40E0189689";
const abi =  Erc20Test.abi;

//Infura node api key
const NODE_API_KEY = "f90b953e99bd4713a2da81a827eda2b5";

//Ropsten chain
const ROPSTEN_NETWORK_WSS = "wss://ropsten.infura.io/ws/v3/" + NODE_API_KEY;
const ROPSTEN_NETWORK_HTTPS = "https://ropsten.infura.io/v3/" + NODE_API_KEY;

//Deployment block
const START_BLOCK = 10303080

let erc20Contract = (web3) => {
    if(web3 != undefined && web3.eth != undefined){
        return new web3.eth.Contract(abi, ERC20_CONTRACT_ADDRESS);
    }else{
        return null;
    }
}

let initWebSocketProvider = () => {
      return new Web3(new Web3.providers.WebsocketProvider(ROPSTEN_NETWORK_WSS));
}

let initHttpProvider = () => {
    return new Web3(new Web3.providers.HttpProvider(ROPSTEN_NETWORK_HTTPS));
}

app.listen(port, () => {
    const webSocketProvider = initWebSocketProvider()
    const webHttpProvider = initHttpProvider()
    erc20Contract(webHttpProvider).getPastEvents("SoftbinatorTokMint",
    {                               
        fromBlock: START_BLOCK, 
        toBlock: 'latest'
    })                              
    .then(events => console.log(events))
    .catch((err) => console.error(err));

    erc20Contract(webSocketProvider).events.Transfer({
        fromBlock: START_BLOCK
    }).on('data', event => {
        console.log(event); // same results as the optional callback above
    })
});