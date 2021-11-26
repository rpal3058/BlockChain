import SHA256 from 'crypto-js/sha256';
export default class Block {
    timeStamp: any;
    lastHash: any;
    hash: any;
    data: any;

    constructor(_timeStamp:any, _lastHash:any, _hash:any, _data:any){
        this.timeStamp=_timeStamp;
        this.lastHash=_lastHash;
        this.hash=_hash;
        this.data=_data;
    }

    toString(){
        return (
        `Block Detail : 
         timeStamp = ${this.timeStamp},
         lastHash  = ${this.lastHash.substring(0,10)},
         currentHash  = ${this.hash.substring(0,10)},
         data  = ${this.data}`
        )
    }

    static genesisBlock(){
        return new Block('Genesis Time','---','f1r57-h45h',[])
    }

    static mineBlock(_lastBlock:Block, _data:any){
        let _timeStamp = Date.now()
        let _lastHash = _lastBlock.hash
        let _hash = SHA256(`${_timeStamp}${_lastHash}${_data}`).toString()//return the object and to get in the strng format we use JS toString function
        return new Block(_timeStamp, _lastHash, _hash,_data )
    }
    
    static hashGenerator(_block:Block ){
        const {timeStamp, lastHash, data} = _block
        let _hashGenerated = SHA256(`${timeStamp}${lastHash}${data}`).toString()//return the object and to get in the strng format we use JS toString function
        return _hashGenerated
    }
}