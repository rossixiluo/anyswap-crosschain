export class TaskQueueService {
  waitList: any[] = [];
  resultHash: any = {};
  resultKey: string[] = [];
  cb: any = null;
  cancel: any = null;
  isBatch = 0;
  outData = false;

  addTask(task: any) {
    this.waitList.push(task);
  }

  start<T = any[]>(threads = 5) {
    this.next(threads);
    if (!this.isBatch) {
      return new Promise<T>((resolve, reject) => {
        this.cb = resolve;
        this.cancel = reject;
      })
    }
    else {
      return null;
    }
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

  stop() {
    const { cancel, cb, resultHash, isBatch } = this;
    this.cb = null;
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

  startBatch(batch: number, threads: number, cb: Function) {
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
}
