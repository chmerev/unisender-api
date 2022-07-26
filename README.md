
# Unisender API

Package for working with the service [Unisender](https://www.unisender.com/).

[API documentation from the Unisender service.](https://www.unisender.com/support/api/common/bulk-email/)

## Install package

To deploy this project run

```bash
  npm i unisender-api
```

## Usage/Examples

```javascript
import Unisender from 'unisender-api';

const unisender = new Unisender('YOUR_API_KEY');

const subscribe = await unisender.subscribe('541', 'andrey@chmerev.com', 'Andrey', {}, {double_optin: 0, overwrite: 2});
```

## License

[MIT](https://choosealicense.com/licenses/mit/)