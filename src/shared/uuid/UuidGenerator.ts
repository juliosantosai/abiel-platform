const { randomUUID } =require('crypto');

class UuidGenerator {
    generate() {
        return randomUUID();
    }
}

module.exports = UuidGenerator;