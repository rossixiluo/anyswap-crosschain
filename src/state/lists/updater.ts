import { getVersionUpgrade, minVersionBump, VersionUpgrade } from '@uniswap/token-lists'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useFetchTokenListCallback, useFetchMergeTokenListCallback } from '../../hooks/useFetchListCallback'
// import { useFetchListCallback, useFetchTokenListCallback } from '../../hooks/useFetchListCallback'
import useInterval from '../../hooks/useInterval'
// import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { addPopup } from '../application/actions'
import { AppDispatch, AppState } from '../index'
import { acceptListUpdate } from './actions'
import { getStorageWithCache, setStorageWithCache, STORAGE_CACHE_MINUTE } from '../../utils/storage'

// import config from '../../config'

export default function Updater(): null {
  const { library, chainId: activeChainId, active } = useActiveWeb3React()
  const chainId = useMemo(() => {
    if (activeChainId) {
      active && setStorageWithCache('chainId', activeChainId)
      return activeChainId
    }
    else {
      const cacheChainId = getStorageWithCache('chainId', STORAGE_CACHE_MINUTE * 30)
      return cacheChainId || activeChainId;
    }
  }, [activeChainId, active])
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  

  // const isWindowVisible = useIsWindowVisible()

  // const fetchList = useFetchListCallback()
  const fetchTokenList = useFetchTokenListCallback()
  const fetchMergeTokenList = useFetchMergeTokenListCallback()

  // console.log(fetchTokenList)
  // console.log(lists)

  // const fetchAllListsCallback = useCallback(() => {
  //   if (!isWindowVisible) return
  //   Object.keys(lists).forEach(url =>
  //     fetchList(url).catch(error => console.debug('interval list fetching error', error))
  //   )
  // }, [fetchList, isWindowVisible, lists])

  const fetchAllTokenListsCallback = useCallback(() => {
    if (chainId) {
      fetchTokenList().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchTokenList, chainId])

  const fetchMergeTokenListsCallback = useCallback(() => {
    if (chainId) {
      fetchMergeTokenList().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchMergeTokenList, chainId])

  // 每 10 分钟获取所有列表，但仅在我们初始化库之后
  // useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)
  useInterval(fetchAllTokenListsCallback, library ? 1000 * 60 * 10 : null)
  useInterval(fetchMergeTokenListsCallback, library ? 1000 * 60 * 10 : null)
  // useInterval(fetchMergeTokenListsCallback, library ? 1000 * 60 : null)

  // whenever a list is not loaded and not loading, try again to load it
  // useEffect(() => {
  //   Object.keys(lists).forEach(listUrl => {
  //     const list = lists[listUrl]

  //     if (!list.current && !list.loadingRequestId && !list.error) {
  //       fetchList(listUrl).catch(error => console.debug('list added fetching error', error))
  //     }
  //   })
  // }, [dispatch, fetchList, library, lists])

  useEffect(() => {
    fetchAllTokenListsCallback()
  }, [dispatch, fetchTokenList, chainId])

  useEffect(() => {
    fetchMergeTokenListsCallback()
  }, [dispatch, fetchMergeTokenList, chainId])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    // console.log(library)
    if (library) {
      const startTime = Date.now()
      library.getBlockNumber().then(res => {
        console.log(Date.now() - startTime)
        console.log(res)
      })
    }
    Object.keys(lists).forEach(listUrl => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump')
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
            const min = minVersionBump(list.current.tokens, list.pendingUpdate.tokens)
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(acceptListUpdate(listUrl))
              dispatch(
                addPopup({
                  key: listUrl,
                  content: {
                    listUpdate: {
                      listUrl,
                      oldList: list.current,
                      newList: list.pendingUpdate,
                      auto: true
                    }
                  }
                })
              )
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`
              )
            }
            break

          case VersionUpgrade.MAJOR:
            dispatch(
              addPopup({
                key: listUrl,
                content: {
                  listUpdate: {
                    listUrl,
                    auto: false,
                    oldList: list.current,
                    newList: list.pendingUpdate
                  }
                },
                removeAfterMs: null
              })
            )
        }
      }
    })
  }, [dispatch, lists])

  return null
}
