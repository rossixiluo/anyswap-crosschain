// 存储时间
export const STORAGE_CACHE_MINUTE = 60 * 1000;
export const STORAGE_CACHE_HOUR = 60 * STORAGE_CACHE_MINUTE;
export const STORAGE_CACHE_DAY = 24 * STORAGE_CACHE_HOUR;
export const STORAGE_CACHE_WEEK = 7 * STORAGE_CACHE_DAY;

// 获取本地存储
export const getStorage = <T = any>(key: string) => {
  let result: any;
  if (typeof localStorage == 'object') {
    result = localStorage.getItem(key);
  }
  return result as T;
}
// 设置本地存储
export const setStorage = (key: string, data: any) => {
  let result;
  let storageData = data;
  if (typeof storageData != 'string') {
    storageData = JSON.stringify(data);
  }
  if (typeof localStorage == 'object') {
    localStorage.setItem(key, storageData);
    result = data;
  }
  return result;
}
// 移除storage
export const removeStorage = (key: string) => {
  if (typeof localStorage == 'object') {
    localStorage.removeItem(key);
  }
  return true;
}
// 设置带缓存时间的存储项
export const setStorageWithCache = (key: string, data: any, cacheTime = 0) => {
  if (data != null) {
    const saveData: any = {
      data,
      time: +new Date()
    };
    if (cacheTime) {
      saveData.cache = cacheTime;
    }
    const storageDataStr = JSON.stringify(saveData);
    setStorage(key, storageDataStr);
  } else {
    removeStorage(key);
  }
}
// 取出存储项，计算缓存时间规则返回存储项或空值
export const getStorageWithCache = (key: string, cacheTime = 0) => {
  let result = null;
  let storageData: any = getStorage(key);
  if (storageData) {
    try {
      storageData = JSON.parse(storageData);
      const cacheCheck = cacheTime || storageData.cache;
      if (cacheCheck) {
        const now = +new Date();
        if (now - cacheCheck > storageData.time) {
          setStorageWithCache(key, null);
        } else {
          result = storageData.data;
        }
      } else {
        result = storageData.data;
      }
    } catch (e) {}
  }
  return result;
}