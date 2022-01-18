import BlockChain from '../blockchain/block_chain'
import TransactionPool from './transactionPool'
import Wallet from './wallet'


export default class Miners{

    static mineTransaction(transactionSelected: Array<number>,_pool: TransactionPool, _miner: Wallet, _chain: BlockChain){
        let array = Miners.createListToMine(transactionSelected,_pool, _miner)
        _chain.addBlock(array)
        return true
    }

    static createListToMine(transactionSelected: Array<number>, _pool: TransactionPool, _miner: Wallet){
        let txArray : Array<any>
        txArray = []        
        
        
        transactionSelected.forEach((txSelected: any)=>{
            let tx = _pool.transactionPool[txSelected]
            txArray.push(tx)
            _miner.balance+=_pool.transactionPool[txSelected].output[2].amount //adding the award amount to miners wallet
        })

        return txArray
    }

}  