//P2p Server will be using websockets to connect my computer to nodes
import WebSocket, {Server} from 'ws'
import BlockChain from '../blockchain/block_chain'
import Wallet from '../transaction/wallet'
import TransactionPool from '../transaction/transactionPool'
import Miners from '../transaction/miner'

const P2P_port = process.env.P2P_PORT || 5000
const peerServer = process.env.PEER_SERVERS ? process.env.PEER_SERVERS.split(',') : []

export default  class P2pServer{
    bc : BlockChain
    peers:any
    wallet: Wallet
    pool: TransactionPool
    miner: Miners
    constructor(_bc: BlockChain, _pool:TransactionPool){
        this.bc = _bc 
        this.peers =[]
        this.pool = _pool
        this.wallet=new Wallet(_pool,_bc)
        this.miner= new Miners(this.pool, this.wallet, this.bc)
    }

    launchingServer(){   
        this.openSeperateInstanceOfPeerServers()
        let server = new Server({port: +(P2P_port)}, ()=> console.log("Backend : new node at port " + P2P_port))

        //connecting to clients whose connections were opened in function ()
        server.on("connection",(peersToServerSocket)=>{  
            /*
            The array below stores all the peers connected to this server
            Eg: if a new server is created at 3000 and connections are extablished to 3001 & 3002
            this array will store 3001 and 3002 like
            3000 = [3001,3002]
            */ 
            this.peers.push(peersToServerSocket)
            this.interact(peersToServerSocket)
        })
    }

    openSeperateInstanceOfPeerServers(){
        peerServer.forEach((peerServer)=>{
            let _seperateInstanceOfPeerServers = new WebSocket(peerServer)
            _seperateInstanceOfPeerServers.on('open',()=>{          
                console.log("Opening connections with peers")  
                /*
                The array below stores all the OTHER peers connected to this peers currently open by the For Each Loop
                so if there are 2 peers mentioned while launching 3000 lets say 3001 and 3002 
                then 2 seperate arrays will be created one each for 3001 and 3002 and details of the other peers connected will be
                stored in each array like
                3001 = [3002,3000]
                3002 = [3001,3000]                
                */ 
                this.peers.push(_seperateInstanceOfPeerServers) 
                this.interact(_seperateInstanceOfPeerServers) //
            })
        })
    }

    /************************************* */
    
    //setting up a 2 way communication between all the peers
    interact(allPeers:any,dataType?: string, data?: any){
        this.sendMessage(allPeers, dataType, data)
        this.messageHandler(allPeers)
    }

    sendMessage(allPeers:any, dataType?: string, data?: any){
        //IMP NOTE : here this.bc refer to the blockchain of the port who is initiating the GET or POST operation
        switch(dataType){
            case("chain"):
                allPeers.send(JSON.stringify({
                    type:dataType,
                    data:this.bc,
                }))
                break
        //IMP NOTE : here this.pool refer to the blockchain of the port who is initiating the GET or POST operation
            case("transaction"):
                allPeers.send(JSON.stringify({
                    type: dataType,
                    data: this.pool,
                }))
                break
            case("clear"):
                allPeers.send(JSON.stringify({
                    type: dataType,
                    list: data
                }))
                data.forEach((element: any) => {
                    this.pool.transactionPool.splice(element,1)
                });
                break    
        }
    }

    messageHandler(allPeers:any){
        allPeers.on("message",(message:any)=>{            
            let input = JSON.parse(message)
            switch(input.type){
                case("chain"):
                //IMP NOTE : here this.bc refers to the blockchain of the PEERS of the port initiating the GET or POST operation
                this.bc.replaceChain(input.data.chain)
                break
                    
                case("transaction"):
                //IMP NOTE : here this.pool refers to the pool of the PEERS of the port initiating the GET or POST operation
                this.pool.transactionPool.length=0  
                let arr = input.data.transactionPool
                arr.forEach((element:any) => {
                    this.pool.addToPool(element)
                })
                break

                case("clear"):
                //IMP NOTE : here this.pool refers to the pool of the PEERS of the port initiating the GET or POST operation
                input.list.forEach((element: any) => {
                    this.pool.transactionPool.splice(element,1)
                });
                break
            }
        })
    }

    /*************************************** */

    syncData(_type?:string, _data?: any){
        this.peers.forEach((peers:any) => {
            this.interact(peers, _type,_data)
        });
    }


}