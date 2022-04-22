import nebulas from 'nebulas'

export const isNASAddress = function (addr:any) {
    return addr && nebulas.Account.isValidAddress(addr) ? addr : false
}