import axios from 'axios';
import { CreateListOptions, ResultResponse, List, EmptyObject, ImportContactsOptions, ImportContactsResult, SubscribeOptions, exportContactsOptions, exportContactsResult, getContactCountParameters, getContactCountResult, getContactOptions, getContactResult } from './interfaces/types';
import { delay } from './utils/delay';
import { methods } from './utils/methods';

/** Initiate your Unisender account. */
class Unisender {
	apiKey: string;
	readonly apiUrl = 'https://api.unisender.com/ru/api/';

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async sendRequest(method: string, params?: string) {

		const url = new URL(`${this.apiUrl}${method}?format=json&api_key=${this.apiKey}${params ? params : ''}`);

		try {
			const {data} = await axios.post(url.href);
			return data;
		} catch(e) {
			return new Error(e?.response?.data);
		}
	}

	private parameterСollection(params: {[key: string]: string}[]): string {
		let paramsString = '';

		params.forEach((param) => {
			paramsString += `&${Object.keys(param)[0]}=${Object.values(param)[0]}`;
		})

		return paramsString;
	}

	/** 
	 * A method for get contact lists.
	 * [More information](https://www.unisender.com/ru/support/api/contacts/getlists/)
	*/
	async getLists(): Promise<ResultResponse<List[]>> {
		const request = await this.sendRequest(methods.contactLists.getLists);
		return request;
	}

	/** 
	 * A method for creating a new contact list.
	 * [More information](https://www.unisender.com/ru/support/api/contacts/createlist/)
	 * @param title name of contact list
	 * @param options additional fields for create contact list
	*/
	async createList(title: string, options?: CreateListOptions): Promise<ResultResponse<{id: number}>> {
		const params = [];

		params.push({title: title});

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.createList, paramsString);

		return request;
	}

	/** 
	 * A method for update contact list. 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/updatelist/)
	 * @param id id of contact list
	 * @param title name of contact list
	 * @param options additional fields for update contact list
	*/
	async updateList(id: number, title: string, options?: CreateListOptions): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({list_id: id});
		params.push({title: title});

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.updateList, paramsString);

		return request;
	}

	/** A method for delete contact list. 
	 * @param id - id of contact list
	*/
	async deleteList(id: number): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({list_id: id});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.deleteList, paramsString);

		return request;
	}

	/** 
	 * This method adds contacts (email address and/or cell phone number) to one or more lists and allows you to add/change values to additional fields and labels.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/subscribe/)
	 * 
	 * @param listIds Comma-separated list codes to add a contact to. Example: 1,2,3.
	 * @param email The email address of the contact
	 * @param name The name of the contact
	 * @param fields additional contact fields. Example: {UTM: 'store'}
	 * @param options additional options
	*/
	async subscribe(listIds: string, email: string, name?: string, fields?: {[key: string]: string}, options?: SubscribeOptions): Promise<ResultResponse<{person_id: number}>> {

		const params = [];

		params.push({list_ids: listIds});

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		let filedsString = '';

		Object.entries(fields).forEach(([key, value]) => {
			filedsString += `&fields[${key}]=${value}`;
		})

		const emailSubscriber = `&fields[email]=${email}`;
		const nameSubscriber = name ? `&fields[Name]=${name}` : '';

		const request = await this.sendRequest(methods.contactLists.subscribe, paramsString + emailSubscriber + nameSubscriber + filedsString);

		return request;
	}

	/** 
	 * The method excludes a contact's e-mail or phone number from one or more lists.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/exclude/)
	 * 
	 * @param contactType 'email' or 'phone'
	 * @param contact The contact e-mail or phone number. Example: andrey@chmerev.com or 89091234567
	 * @param listIds Comma-separated list codes from which we exclude a contact.
	*/
	async exclude(contactType: 'email' | 'phone', contact: string, listIds?: string): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({contact_type: contactType});
		params.push({contact: contact});

		listIds && params.push({list_ids: listIds});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.exclude, paramsString);

		return request;
	}

	/** 
	 * The method unsubscribes a contact's e-mail or phone number from one or more lists.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/exclude/)
	 * 
	 * @param contactType 'email' or 'phone'
	 * @param contact The contact e-mail or phone number. Example: andrey@chmerev.com or 89091234567
	 * @param listIds Comma-separated list codes from which we exclude a contact.
	*/
	async unsubscribe(contactType: 'email' | 'phone', contact: string, listIds?: string): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({contact_type: contactType});
		params.push({contact: contact});

		listIds && params.push({list_ids: listIds});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.unsubscribe, paramsString);

		return request;
	}

	/** A method for import contacts. 
	 * 
	 * Example import fileds and Data:
	 * 
	 * Fields: ['email', 'Name']
	 * 
	 * Data: [['andrey@chmerev.com', 'Andrey'], ['test@unisender.com', 'Test']]
	 * 
	 * The number of fields must be equal to the number of fields of each contact
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/importcontacts/)
	 * 
	 * @param fieldNames Array of field names
	 * @param data Contact array
	 * @param options additional options
	*/
	async importContacts(fieldNames: string[], data: string[][], options?: ImportContactsOptions): Promise<ResultResponse<ImportContactsResult>>{

		const params = [];

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		let filedsString = '';

		fieldNames.forEach((field, i) => {
			filedsString += `&field_names[${i}]=${field}`;
		})

		let dataString = '';

		data.forEach((contact, i) => {
			contact.forEach((field, j) => {
				dataString += `&data[${i}][${j}]=${field}`;
			})
		})

		const request = await this.sendRequest(methods.contactLists.importContacts, filedsString + dataString + paramsString);

		return request;
	}

	/** 
	 * Exporting contact data from UniSender. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/exportcontacts/)
	 * 
	 * @param options additional options
	 * @param fieldNames Array of field names. Example: ['email', 'Name']
	 * @returns A link for download to the exported file.
	*/
	async exportContacts(options?: exportContactsOptions, fieldNames?: string[]): Promise<string>{

		let filedsString = '';

		fieldNames.forEach(field => {
			filedsString += `&field_names[]=${field}`;
		})

		const params = [];

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		const request: ResultResponse<exportContactsResult> = await this.sendRequest(methods.contactLists.exportContacts, filedsString + paramsString);

		if (request?.result.status !== 'new') {
			throw new Error('An error occurred when creating a task for export.');
		}

		let completed = false;
		let urlForDownload = '';

		while (!completed) {
			const checkStatus: ResultResponse<exportContactsResult> = await this.sendRequest(methods.contactLists.getTaskResult, `&task_uuid=${request.result.task_uuid}`);

			if (checkStatus.result.status === 'completed') {
				completed = true;
				urlForDownload = checkStatus.result.file_to_download;
			}

			const workStatuses = ['completed', 'processing'];

			if (!workStatuses.includes(checkStatus.result.status)) {
				throw new Error('An error occurred while waiting for a file link.');
			}

			await delay(10);
		}

		return urlForDownload;

	}

	/** 
	 * The method returns the size of the contact database by user login. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/gettotalcontactscount/)
	 * 
	 * @param login User login in the system. Example: ID4417233
	*/
	async getTotalContactsCount(login: string): Promise<ResultResponse<{total: number}>>{
		const request = await this.sendRequest(methods.contactLists.getTotalContactsCount, `&login=${login}`);

		return request;
	}

	/** 
	 * The method allows you to get the number of contacts in the list. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/getcontactcount/)
	 * 
	 * @param listId The id of the list to be searched.
	 * @param options A list of parameters to search for (at least one parameter). tagId / type / search
	*/
	async getContactCount(listId: string, options: getContactCountParameters): Promise<ResultResponse<getContactCountResult>>{

		const params = [];
		params.push({list_id: listId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&params[${key}]=${value}`;
		})

		const request = await this.sendRequest(methods.contactLists.getContactCount, paramsString + optionsString);

		return request;
	}

	/** 
	 * Getting information about a single contact. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/contacts/getcontact/)
	 * 
	 * @param email email of the contact
	 * @param options additional options
	*/
	async getContact(email: string, options?: getContactOptions): Promise<ResultResponse<getContactResult>> {
		const params = [];
		params.push({email: email});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.contactLists.getContact, paramsString + optionsString);

		return request;
	}
}

export default Unisender;