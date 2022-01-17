import {ec} from 'elliptic'; //importing a class of ec  
const EC = new ec('secp256k1'); //new instance of class of ec
import { SHA256 } from 'crypto-js'
import Wallet from './transaction/wallet';
import { v1 as uuidv1} from 'uuid'

export default class Chain_Utils{
    static pool: any

    static keyPairGenerator(){
        let key = EC.genKeyPair()
        return key
    }

    static encodeSHA256(sender:Wallet,recipientAddress:any, amountToTransfer: any ){
        let data = SHA256(`${sender}${recipientAddress}${amountToTransfer}`).toString()
        return data
    }

    static uniquId(){
        return uuidv1()
    }

}
