const CONTRACT_ADDRESS = '0x2B6Ed92910f96126DA76ca0e3dF35e3427028A68'

export const PolygonMumbai = {
    chainId: 80001,
    rpc: 'https://rpc-mumbai.maticvigil.com/'
  }

export const PROPOSE = {
    [PolygonMumbai.chainId]: CONTRACT_ADDRESS
}

export const POST_ADDRESS = '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0'

// const ABI = ['function mint(address,uint) public', 'function transfer(address, uint256) public']
export const ABI = ['function propose(address[] targets,uint256[] values, bytes[] calldatas, string description) public']
// export const Lens_ABI = ['function post(struct DataTypes.PostData components) public']
// export const Lens_ABI = ['function post(uint256 , string , address , bytes , address, bytes) public']
export const Lens_ABI = [{"inputs":[
  {"components":[
    {"internalType":"uint256","name":"profileId","type":"uint256"},
    {"internalType":"string","name":"contentURI","type":"string"},
    {"internalType":"address","name":"collectModule","type":"address"},
    {"internalType":"bytes","name":"collectModuleData","type":"bytes"},
    {"internalType":"address","name":"referenceModule","type":"address"},
    {"internalType":"bytes","name":"referenceModuleData","type":"bytes"}
  ],
  "internalType":"struct DataTypes.PostData",
  "name":"vars",
  "type":"tuple"
}
],
"name":"post",
"outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
"stateMutability":"nonpayable",
"type":"function"
}
];


// {"types":1,"values":6},
// value={
//   "types":[
//     {"name":"vars","type":"tuple","indexed":null,"components":[{"name":"profileId","type":"uint256","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"uint256","_isParamType":true},{"name":"contentURI","type":"string","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"string","_isParamType":true},{"name":"collectModule","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"collectModuleData","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true},{"name":"referenceModule","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"referenceModuleData","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true}],"values":[1533,"https://gateway.pinata.cloud/ipfs/[object Object]","0x6027B03c00aCC750D55FFC6b6381bB748A9C8590",[],"0x0000000000000000000000000000000000000000",[]]}
