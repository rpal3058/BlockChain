import TransactionReceipt from "./transaction"
import Chain_Utils from "../chainUtils"
import Wallet from "./wallet"

export default class TransactionPool{
    transactionPool: Array<TransactionReceipt>
    constructor(){
        this.transactionPool=[]
    }

    verify(sender: Wallet,recipientAddress: any,amountTransfered: number,signature:any){
        let msg = Chain_Utils.encodeSHA256(sender,recipientAddress,amountTransfered)
        let verification = sender.key.verify(msg,signature)
        return verification
    }

    addToPool(newTransactionReceived:any){
        this.transactionPool.push(newTransactionReceived) 
        return true
    }
    
    clearPool(){
        this.transactionPool.length=0
    }

}




