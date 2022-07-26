import Unisender from '.';

(async () => {
	const unisender = new Unisender('61gj6guizeoegkpswz3urh1gfgiesb5ocqsbe51o');

	const request = await unisender.deleteList(713);

	console.log(request);
})()