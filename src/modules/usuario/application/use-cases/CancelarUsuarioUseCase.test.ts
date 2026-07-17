// TypeScript migration bridge: re-exports JS test suite so ts-jest can pick it up.
// Replace this file with native TS tests progressively.
export {};
const suite = require('./CancelarUsuarioUseCase.test.js');
export default suite;
