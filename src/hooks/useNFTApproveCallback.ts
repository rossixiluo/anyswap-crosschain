// import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
// import { TokenAmount, CurrencyAmount, ETHER } from 'anyswap-sdk'
import { useCallback, useMemo } from 'react'
// import { useTokenAllowance } from '../data/Allowances'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useNFT721Contract } from './useContract'
import { useActiveWeb3React } from './index'

import config from '../config'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  // routerToken?: any,
  inputToken?: any,
  spender?: any,
  tokenid?: string,
): [ApprovalState, () => Promise<void>] {
  // const { account, chainId } = useActiveWeb3React()
  const { chainId } = useActiveWeb3React()
  // console.log(spender)
  // console.log(amountToApprove ? amountToApprove.raw.toString() : '')
  const contract = useNFT721Contract(inputToken)
  const pendingApproval = useHasPendingApproval(spender, spender)
  // console.log(currentAllowance)
  // check the current approval status

  const approved = useMemo(() => {
    if (tokenid && contract) {
      return contract.getApproved(tokenid)
    }
    return ''
  }, [contract, tokenid])
  console.log(approved)
  const approvalState: ApprovalState = useMemo(() => {
    if (!spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!contract) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return contract
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [contract, pendingApproval, spender])

  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!spender) {
      console.error('no token')
      return
    }

    if (!contract) {
      console.error('tokenContract is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    // let useExact = false
    const estimatedGas = await contract.estimateGas.approve(spender, tokenid).catch(() => {
      // general fallback for tokens who restrict approval amounts
      // useExact = true
      return contract.estimateGas.approve(spender, tokenid)
    })

    return contract
      .approve(spender, tokenid, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + config.getBaseCoin(tokenid, chainId),
          approval: { tokenAddress: spender, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, spender, contract, addTransaction])

  return [approvalState, approve]
}
