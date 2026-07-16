class TimeoutPolicy {
    constructor({ timeoutMs = 5000 } = {}) {
        this.timeoutMs = timeoutMs;
    }

    async execute(fn) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                const timeoutError = new Error(`Execution timed out after ${this.timeoutMs}ms`);
                timeoutError.code = "TIMEOUT";
                reject(timeoutError);
            }, this.timeoutMs);

            Promise.resolve()
                .then(() => fn())
                .then(result => {
                    clearTimeout(timer);
                    resolve(result);
                })
                .catch(error => {
                    clearTimeout(timer);
                    reject(error);
                });
        });
    }
}

module.exports = TimeoutPolicy;