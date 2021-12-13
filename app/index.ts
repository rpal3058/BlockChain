import express from 'express';
import BlockChain from '../blockchain/block_chain';
import P2pServer from './p2pServer';
const app = express();
const port = process.env.HTTP_PORT || 3000; // will take the enviroment varible or default port to 3000


//SECTION 1:  My computer connecting to the network/other nodes
let newChain = new BlockChain()
let newP2P_network = new P2pServer(newChain)

//launching the new peer node to the network
newP2P_network.launchingServer()

//SECTION 2: Front end app connecting to my Conputer
app.use(express.json());

app.get( "/block", ( req, res ) => {
    res.json(newChain.chain)
} );

//add a new block and communicate the block to the network
app.post("/mine",(req,res)=>{
    let block = newChain.addBlock(req.body.data)
    newP2P_network.syncData(newChain.chain)
    res.redirect("/block")
    // newP2P_network.server()
})

// start the Express server
app.listen( port, () => {
    console.log( `Frontend : http started at http://localhost:${ port }` );
} );



 