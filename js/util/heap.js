class Heap {

    constructor(cmp) {
        this.cmp = cmp;
        this.heap = [];
    }

    front() {
        return this.heap[0];
    }

    size() {
        return this.heap.length;
    }

    empty() {
        return this.heap.length === 0;
    }

    insert(node) {
        if (!node)
            return;
        this.heap.push(node);

        if (this.heap.length > 1) {
            let cur = this.heap.length - 1;
            while (cur > 0 && this.cmp(this.heap[cur], this.heap[Math.floor((cur - 1)/2)])) {
                [this.heap[Math.floor((cur - 1) / 2)], this.heap[cur]] = [this.heap[cur], this.heap[Math.floor((cur - 1) / 2)]];
                cur = Math.floor((cur - 1) / 2);
            }
        }
    }

    pop() {
        let front = this.heap[0];
        if (this.heap.length > 1) {
            this.heap[0] = this.heap[this.heap.length - 1];
            this.heap.pop();

            if (this.heap.length === 2) {
                if (this.cmp(this.heap[1], this.heap[0])) {
                    [this.heap[0], this.heap[1]] = [this.heap[1], this.heap[0]];
                }
                return front;
            }

            let cur = 0;
            let left = 2 * cur + 1;
            let right = 2 * cur + 2;

            while (this.heap[left] && this.heap[right] &&
                  (this.cmp(this.heap[cur], this.heap[left]) || 
                   this.cmp(this.heap[cur], this.heap[right]))) {
                    if (this.cmp(this.heap[left], this.heap[right])) {
                        [this.heap[cur], this.heap[left]] = [this.heap[left], this.heap[cur]];
                        cur = left;
                    } else {
                        [this.heap[cur], this.heap[right]] = [this.heap[right], this.heap[cur]];
                        cur = right;
                    }
                    left = 2 * cur + 1;
                    right = 2 * cur + 2;
                }
        } else if (this.heap.length === 1) {
            this.heap.pop();
        } else {
            return null;
        }
        return front;
    }

}