import express from 'express';
import BlockChain from '../blockchain/block_chain';
import Chain_Utils from '../chainUtils';
import TransactionPool from '../transaction/transactionPool';
import Wallet from '../transaction/wallet';
import P2pServer from './p2pServer';
import Miners from '../transaction/miner';

const app = express();
const port = process.env.HTTP_PORT || 3000; // will take the enviroment varible or default port to 3000

//SECTION 1:  My computer connecting to the network/other nodes
let newChain = new BlockChain()
let pool = new TransactionPool()
let newP2P_network = new P2pServer(newChain, pool)

//launching the new peer node to the network
newP2P_network.launchingServer()

//SECTION 2: Front end app connecting to my Conputer
app.use(express.json());

app.get( "/block", ( req, res ) => {
    res.json(newChain.chain)
} );

app.get("/wallet-details",(req,res)=>{
    res.json({
        "Address" : newP2P_network.wallet.publicKey,
        "Balance" : newP2P_network.wallet.balance,
        "Pool" : newP2P_network.wallet.pool.transactionPool
    })
})

app.post("/send",(req,res)=>{
    let senderWallet = newP2P_network.wallet
    let {recipient, amount,award} = req.body
    if (award==null) award=0 
    senderWallet.sendTransaction(recipient, amount,award)
    newP2P_network.syncData("transaction")
    res.redirect("/wallet-details")
})

//add a new block and communicate the block to the network
app.post("/mine",(req,res)=>{
    if(newP2P_network.wallet.pool.transactionPool!=null){
        let tx = req.body.tx
        Miners.mineTransaction(tx,pool, newP2P_network.wallet, newChain) 
        newP2P_network.syncData("chain", tx)
        newP2P_network.syncData("clear", tx)  
        res.redirect("/block")             
    }else{
        console.log("Error : Selected node couldnt mine")
    }    
})

// start the Express server
app.listen( port, () => {
    console.log( `Frontend : http started at http://localhost:${ port }` );
});




 