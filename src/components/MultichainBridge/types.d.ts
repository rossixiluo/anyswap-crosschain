declare module '*.json' {
  const value: any;
  export default value;
}

declare interface Window {
  ethereum: any,
  tronWeb: any
}

// declare interface cryptoUtils {
//   secp256k1: any,
//   keccak: any,
//   sha3: any,
//   ripemd160: any,
//   crypto: any,
//   scrypt: any,
//   uuid: any,

//   zeros: any,
//   isHexPrefixed: any,
//   padToBigEndian: any,
//   toBuffer: any,
//   bufferToHex: any,
//   privateToPublic: any,
//   isValidPublic: any,
//   sign: any,
//   verify: any,
//   recover: any
// }