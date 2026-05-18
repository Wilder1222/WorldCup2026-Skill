'use strict';

/**
 * Short-Term Memory — Session-scoped in-memory store.
 */

class ShortTermMemory {
    constructor() {
        this._store = new Map();
        this._maxSize = 1000;
    }

    set(key, value) {
        if (this._store.size >= this._maxSize) {
            // Evict oldest entry
            const firstKey = this._store.keys().next().value;
            this._store.delete(firstKey);
        }
        this._store.set(key, { value, timestamp: Date.now() });
    }

    get(key) {
        const entry = this._store.get(key);
        return entry ? entry.value : null;
    }

    has(key) {
        return this._store.has(key);
    }

    delete(key) {
        return this._store.delete(key);
    }

    clear() {
        this._store.clear();
    }

    size() {
        return this._store.size;
    }
}

module.exports = ShortTermMemory;
