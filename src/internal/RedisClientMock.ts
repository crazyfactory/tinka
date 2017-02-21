import {MemoryCache} from "../cache/MemoryCache";

export class RedisClientMock {
    protected dummy: MemoryCache = new MemoryCache();

    public set(key: string, value: string, ttl: number): void {
        this.dummy.setItem(key, value, ttl);
    }

    public get(key: string, callback: Function): void {
        callback(null, this.dummy.getItem(key));
    }

    public expire(key: string, ttl: number): void {
        setTimeout(() => this.dummy.removeItem(key), ttl * 1000);
    }

    public del(key: string): void {
        this.dummy.removeItem(key);
    }
}
