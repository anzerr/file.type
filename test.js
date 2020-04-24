
const fileType = require('./index.js'),
	assert = require('assert');

Promise.all([
	fileType('./index.js').then((res) => {
		assert.equal(res, 'application/javascript');
	}),
	fileType('./package.json').then((res) => {
		assert.equal(res, 'application/json');
	}),
	fileType('./README.md').then((res) => {
		assert.equal(['text/x-markdown', 'text/markdown'].includes(res), true);
	})
]).catch((err) => {
	console.log(err);
	process.exit(1);
});
