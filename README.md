
# Unisender API

Package for working with the service [Unisender](https://www.unisender.com/).

[API documentation from the Unisender service.](https://www.unisender.com/support/api/common/bulk-email/)

## Install package

To deploy this project run

```bash
  npm i unisender-api
```

## Usage/Examples

### Import
```javascript
import Unisender from 'unisender-api';

const unisender = new Unisender('YOUR_API_KEY');

const subscribe = await unisender.subscribe('541', 'andrey@chmerev.com', 'Andrey', {}, {double_optin: 0, overwrite: 2});
```

## Available methods now

- [x]  getLists
- [x]  createList
- [x]  updateList
- [x]  deleteList
- [x]  subscribe
- [x]  exclude
- [x]  unsubscribe
- [x]  importContacts
- [x]  exportContacts
- [x]  getTotalContactsCount
- [x]  getContactCount
- [x]  getContact
- [x]  getFields
- [x]  createField
- [x]  updateField
- [x]  deleteField
- [x]  getTags
- [x]  deleteTag
- [x]  createEmailMessage
- [x]  createSmsMessage
- [x]  createCampaign
- [x]  cancelCampaign
- [x]  getActualMessageVersion
- [x]  sendSms
- [x]  checkSms
- [x]  sendEmail
- [x]  sendTestEmail
- [x]  checkEmail
- [ ]  updateOptInEmail
- [ ]  getWebVersion
- [ ]  deleteMessage
- [ ]  updateEmailMessage
- [ ]  createEmailTemplate
- [ ]  updateEmailTemplate
- [ ]  deleteTemplate
- [ ]  getTemplate
- [ ]  getTemplates
- [ ]  listTemplates
- [ ]  getCampaignDeliveryStats
- [ ]  getCampaignCommonStats
- [ ]  getVisitedLinks
- [ ]  getCampaigns
- [ ]  getCampaignStatus
- [ ]  getMessages
- [ ]  getMessage
- [ ]  listMessages

## License

[MIT](https://choosealicense.com/licenses/mit/)