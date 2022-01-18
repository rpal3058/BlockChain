import Wallet from './wallet';
import Chain_Utils from '../chainUtils';

export default class TransactionReceipt{
    id: any
    input: any
    output: Array<any>
    constructor(){
        this.id = Chain_Utils.uniquId() 
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

    static createNewTransactionReceipt(sender:Wallet, recipientAddress: any, amountToTransfer: any,awardAmount: any,signature: any){
        const transaction = new TransactionReceipt() //creating a new instance of class so that we cna access the input and output variable 
        
        transaction.input = {
            timeStamp: Date.now(),
            senderBalance: sender.balance,
            transactionSignatureFromSender: signature
        }
        transaction.output.push(...[
            {wallet:"sender",amount:sender.balance-amountToTransfer-awardAmount, address:sender.publicKey},
            {wallet:"receiver",amount:amountToTransfer,address:recipientAddress},
            {wallet:"Miners award", amount:awardAmount}
        ])

        return {id:transaction.id, input: transaction.input, output: transaction.output}
    }
}