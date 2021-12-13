import BlockChain from "./blockchain/block_chain";
runTest()
function runTest(){
    let bc:BlockChain
    bc = new BlockChain
    for(let i=0; i<10; i++){
        console.log(bc.addBlock(`Test ${i}`).toString())
    }
}
