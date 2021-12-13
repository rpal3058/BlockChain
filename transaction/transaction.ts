import crypto, {generateKeyPair} from 'crypto';
import TransactionPool from './transactionPool';
import Wallet from './wallet';

export default class TransactionReceipt{
    input: Object
    output: Array<any>
    constructor(){
        this.input={}
        this.output=[]
    }

    toString(){
        return (
            `New Transaction Receipt : 
             Input = ${this.input},
             Output  = ${this.output}`
        )            
    }

    static createNewTransactionReceipt(sender:Wallet, recipient: Wallet, amountToTransfer: any,signature: any){
        const transaction = new TransactionReceipt() //creating a new instance of class so that we cna access the input and output variable 
        transaction.input = {
            timeStamp: Date.now(),
            senderBalance: sender.balance,
            transactionSignatureFromSender: signature
        }
        transaction.output.push(
            {amount:amountToTransfer,address:recipient},
            {amount:sender.balance-amountToTransfer, address:sender}
        )
        return transaction
    }
}