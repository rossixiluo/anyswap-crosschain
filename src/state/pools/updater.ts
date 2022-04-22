import { useCallback } from 'react'
import useInterval from '../../hooks/useInterval'
// import { useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import config from '../../config'
import {poolLiquidity} from './actions'
import { getStorageWithCache, setStorageWithCache, STORAGE_CACHE_MINUTE } from '../../utils/storage'

function dispatchPoolListWithCache(dispatch: any) {
  const key = 'poolListData'
  const cacheList = getStorageWithCache(key, STORAGE_CACHE_MINUTE * 2)
  if (cacheList) {
    dispatch(poolLiquidity({poolLiquidity: cacheList}))
    return true
  }
  return false
}

function flushPoolListCache(data: any) {
  const key = 'poolListData'
  setStorageWithCache(key, data)
}

export default function Updater(): null {
  const dispatch = useDispatch()
  const getPools = useCallback(() => {
    axios.get(`${config.bridgeApi}/data/router/pools`).then(res => {
      const {status, data} = res
      if (status === 200) {
        flushPoolListCache(data)
        dispatch(poolLiquidity({poolLiquidity: data}))
      }
    })
  }, [dispatch])

  const hasCache = dispatchPoolListWithCache(dispatch)

  useInterval(getPools, 1000 * 30, !hasCache)
  return null
}
