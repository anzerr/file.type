
### `Intro`
get mime type for a file using 'minetype' and 'file' with a fallback if not present

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/file.type.git
```

### `Example`
``` javascript
const fileType = require('file.type');

fileType('./README.md').then((res) => {
    console.log(res);
})
```