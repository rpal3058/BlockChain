import TransactionReceipt from "./transaction"
import Chain_Utils from "../chainUtils"
import Wallet from "./wallet"
import BlockChain from "../blockchain/block_chain"

import { error } from "console"

export default class TransactionPool{
    transactionPool: Array<TransactionReceipt>
    constructor(){
        this.transactionPool=[]
    }

    static add(newTransactionReceived: TransactionReceipt,sender: Wallet,recipient: Wallet,amountTransfered: number,signature:any){
        let msg = Chain_Utils.encodeSHA256(sender,recipient,amountTransfered)
        let verification = sender.key.verify(msg,signature)
        if(verification) {
            let transactionPool = new TransactionPool()
            transactionPool.transactionPool.push(newTransactionReceived)
            return transactionPool.transactionPool.length
        } else {
            return error("The Transaction is not valid to add to pool")
        }
    }
}