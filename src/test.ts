import Unisender from './index';

(async () => {
	const unisender = new Unisender('61gj6guizeoegkpswz3urh1gfgiesb5ocqsbe51o');

	// const importContacts = await unisender.importContacts(['email', 'Name'], [['andr5109@yandex.ru', 'Елена'], ['andr5100@yandex.ru', 'Даня']]);
	// const subscribe = await unisender.subscribe('679', 'andr5100@yandex.ru', 'Андрей', {}, {double_optin: 0, overwrite: 2});
	// const exclude = await unisender.exclude('email', 'andr5100@yandex.ru', '679');
	// const unsubscribe = await unisender.unsubscribe('email', 'andr5100@yandex.ru', '679');
	// const exportContact = await unisender.exportContacts({}, ['email', 'Name']);
	// const getTotalContactsCount = await unisender.getTotalContactsCount('ID4417237');
	// const getContactCount = await unisender.getContactCount('679', {type: 'address'});
	const getContact = await unisender.getContact('andr5100@yandex.ru', {include_lists: 1, include_fields: 1, include_details: 1});

	console.log(getContact);
})()