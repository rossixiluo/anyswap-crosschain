type TaskItem = {
  id: string | number;
  task: () => Promise<any>;
}

export class TaskQueueService {
  waitList: any[] = [];
  resultHash: any = {};
  resultKey: string[] = [];
  cb: any = null;
  cancel: any = null;
  isBatch = 0;
  // task is stop
  outData = false;
  isTask = false;

  addTask(task: TaskItem) {
    this.waitList.push(task);
  }
  start<T = any>(threads = 5) {
    this.next(threads);
    // batch task no return promise
    if (this.isBatch) {
      return null;
    }
    return new Promise<T>((resolve, reject) => {
      this.cb = resolve;
      this.cancel = reject;
    });
  }
  next(threads: number) {
    const tasks: any[] = [];
    const ids: any[] = [];
    for(let i =0; i<threads; i++) {
      if (!this.waitList.length) break;
      const item = this.waitList.shift();
      tasks.push(item.task());
      ids.push(item.id);
    }
    Promise.all(tasks).then((result: any[]) => {
      if (!this.outData) {
        ids.map((key: string, index: number) => {
          this.resultKey.push(key);
          this.resultHash[key] = result[index];
        })
        const { isBatch, resultKey } = this;
        if (isBatch) {
          if (resultKey.length > 0 && resultKey.length % isBatch === 0) {
            return this.nextBatch(threads);
          }
        }
        if (this.waitList.length) {
          setTimeout(() => {
            this.next(threads);
          })
        }
        else {
          this.done();
        }
      }
      else {
        this.outData = false;
      }
    });
  }
  // call success
  done() {
    const { cb, resultHash, isBatch } = this;
    this.cb = null;
    this.resultHash = {};
    this.resultKey = [];
    if (isBatch) {
      this.isBatch = 0;
      cb && cb('done', resultHash);
    }
    else {
      cb && cb(resultHash);
    }
    return resultHash;
  }
  // call failure
  stop() {
    const { cancel, cb, resultHash, isBatch } = this;
    this.cb = null;
    if (this.isTask) {
      Object.keys(resultHash).map(
        (key) => resultHash[key].reject(new Error("stop"))
      );
    }
    this.resultHash = {};
    this.resultKey = [];
    if (isBatch) {
      this.isBatch = 0;
      cb && cb('stop', resultHash);
    }
    else {
      cancel && cancel(resultHash);
    }
    this.outData = true;
    this.waitList = [];
    return resultHash;
  }
  startBatch<T = any>(batch: number, threads: number, cb: (status: string, data: T)=> void) {
    this.isBatch = batch;
    this.cb = cb;
    this.start(threads);
  }
  nextBatch(threads: number) {
    const { waitList } = this;
    if (waitList.length) {
      this.cb('process', this.resultHash);
      setTimeout(() => {
        this.start(threads);
      })
    }
    else {
      this.done();
    }
  }
  runTask(task: () => Promise<any>, mark?: any) {
    const id: any = mark || parseInt((Math.random() * 100) as any);
    this.isTask = true;
    return new Promise((resolve: Function, reject: Function) => {
      this.resultHash[id] = { resolve, reject };
      task().then((res: any) => {
        if (!this.outData) {
          delete this.resultHash[id];
          resolve(res);
        }
      }).catch((e) => {
        if (!this.outData) {
          delete this.resultHash[id];
          reject(e);
        }
      })
    })
  }
}
