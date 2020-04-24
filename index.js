
const {spawn} = require('child_process'),
	mime = require('mime.util'),
	is = require('type.util'),
	path = require('path'),
	fs = require('fs.promisify'),
	map = require('./src/map');

class Type {

	constructor(file, pad = '') {
		this.file = file;
		this.pad = pad;
		this.default = 'text/plain';
		if (!is.string(this.file)) {
			throw new Error('file path should be a string');
		}
		if (!is.string(this.pad)) {
			throw new Error('pad should be a string');
		}
	}

	isValid() {
		return fs.stat(this.file).then((res) => {
			if (!res.isFile()) {
				throw new Error('not a file');
			}
		});
	}

	exec(...arg) {
		return new Promise((resolve, reject) => {
			try {
				const cmd = spawn(...arg);
				let data = [];
				cmd.stdout.on('data', (d) => data.push(d));
				cmd.stderr.on('data', (d) => {});
				cmd.on('error', (e) => {
					reject(e);
				});
				cmd.on('close', () => {
					resolve(Buffer.concat(data).toString().trim());
				});
			} catch(e) {
				reject(e);
			}
		});
	}

	getType() {
		return this.exec('mimetype', ['-b', this.file]).catch(() => {
			return this.exec('file', ['-b', '--mime-type', this.file]);
		});
	}

	lookup() {
		const {ext} = path.parse(`${this.file}${this.pad || ''}`);
		if (ext) {
			return mime.lookup(ext);
		}
		return null;
	}

	get() {
		return this.isValid().then(() => {
			return this.getType().then((res) => {
				if (map.blacklist.includes(res) || res.match(this.default)) {
					return this.lookup() || res;
				}
				return res;
			}).catch(() => this.lookup()).then((res) => {
				const out = res || this.default;
				return map.ref[out] || out;
			});
		});
	}

}

const get = (file, pad) => {
	return new Type(file, pad).get();
};

module.exports = get;
module.exports.default = get;
