import BlockChain from '../blockchain/block_chain'
import TransactionPool from './transactionPool'
import Wallet from './wallet'


export default class Miners{
    pool: TransactionPool
    miner: Wallet
    chain : BlockChain
    constructor(_pool: TransactionPool, _minerWallet: Wallet, _chain: BlockChain){
        this.pool = _pool
        this.miner = _minerWallet
        this.chain = _chain
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

            
            Next steps for My Chain	
            
            
            
            
            
            
            How to access and update all the wallets available in the network and 




            // for (let outputs of tx.output){
            //     Wallet.updateBalance(outputs)
            // }
        })

        return txArray
    }

}  