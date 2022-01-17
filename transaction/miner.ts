import BlockChain from '../blockchain/block_chain'
import TransactionPool from './transactionPool'
import Wallet from './wallet'


export default class Miners{
    pool: TransactionPool
    miner: Wallet
    chain : BlockChain
    constructor(_pool: TransactionPool, _minerWallet: Wallet, _chain: BlockChain){
        this.pool = _pool
        this.chain = _chain
        this.miner = _minerWallet
    }
    
    mineTransaction(transactionSelected: Array<number>){
        let array = this.createListToMine(transactionSelected)
        this.chain.addBlock(array)
        return true
    }

    createListToMine(transactionSelected: Array<number>){
        let txArray : Array<any>
        txArray = []        
        
        transactionSelected.forEach((txSelected: any)=>{
            let tx = this.pool.transactionPool[txSelected]
            txArray.push(tx)
        })
        return txArray
    }

    

}  