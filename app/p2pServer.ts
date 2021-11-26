//P2p Server will be using websockets to connect my computer to nodes
import { SSL_OP_EPHEMERAL_RSA } from 'constants'
import { json } from 'express'
import { connect } from 'http2'
import { resolve } from 'path/posix'
import WebSocket, {Server} from 'ws'
import Block from '../blockchain/block'
import BlockChain from '../blockchain/block_chain'


const P2P_port = process.env.P2P_PORT || 5000
const peerServer = process.env.PEER_SERVERS ? process.env.PEER_SERVERS.split(',') : []

export default class P2pServer{
    bc : BlockChain
    peers:any

    constructor(_bc: BlockChain){
        this.bc = _bc 
    }
    
    /*
    Steps followed:
    a) Open all the existing peer connections
    b) Start a peer server
    c) Setup a 2 way communication where all peers send and receive data freely
    */


    launchingServer(){   
        this.openSeperateInstanceOfPeerServers()
        let server = new Server({port: +(P2P_port)}, ()=> console.log("Backend : new node at port " + P2P_port))

        //connecting to clients whose connections were opened in function ()
        server.on("connection",(peersToServerSocket)=>{         
            this.interact(peersToServerSocket)
        })
    }

    openSeperateInstanceOfPeerServers(){
        peerServer.forEach((peerServer)=>{
            let _seperateInstanceOfPeerServers = new WebSocket(peerServer)
            _seperateInstanceOfPeerServers.on('open',()=>{          
                console.log("Opening connections with peers")  
                this.interact(_seperateInstanceOfPeerServers) 
            })
        })
    }

    /************************************* */
    //setting up a 2 way communication between all the peers
    interact(allPeers:any){
        this.sendMessage(allPeers)
        this.messageHandler(allPeers)
    }

    sendMessage(allPeers:any){
        //IMP NOTE : here this.bc refer to the blockchain of the peer who is sending the message
        allPeers.send(JSON.stringify(this.bc))
    }

    messageHandler(allPeers:any){
        allPeers.on("message",(message:any)=>{
            //IMP NOTE : here is this.bc refers to the blocks of the peer receiving the message
            let data : BlockChain
            data = JSON.parse(message)
            let temp = this.bc.replaceChain(data.chain)
            console.log(this.bc)
        })
    }
    /*************************************** */

    syncData(_chain:any){
        console.log(this.peers.length)
        this.peers.forEach((peers:any) => {
            this.sendMessage(peers)
        });
    }

}
 