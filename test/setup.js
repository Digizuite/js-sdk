// Run all the rests
console.log("in");
const testsContext = require.context('.', true, /\.spec$/);
testsContext.keys().forEach(testsContext);