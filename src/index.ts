import axios from 'axios';
import { CreateListOptions, ResultResponse, List, EmptyObject, ImportContactsOptions, ImportContactsResult, SubscribeOptions, exportContactsOptions, exportContactsResult, getContactCountParameters, getContactCountResult, getContactOptions, getContactResult, getFieldsResult, createFieldOptions, FieldType, createEmailMessageOptions, createCampaignOptions, createCampaignResult, sendSmsResult, SendEmailOptions, checkEmailResult } from './interfaces/types';
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
			const {data} = await axios.post(url.href, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
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

	/** 
	 * A method to get a list of custom fields. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/inputs/getfields/)
	*/
	async getFields(): Promise<ResultResponse<getFieldsResult[]>>{
		const request = await this.sendRequest(methods.additionalFieldsAndLabels.getFields);

		return request;
	}

	/** 
	 * A method for creating a new custom field, the value of which can be set for each recipient and it can then be substituted in the email. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/inputs/createfield/)
	 * 
	 * @param name Variable for substitution. Must be unique, case-sensitive. It's also not recommended to create a field with a name that matches one of the names of standard fields (tags, email, phone, email_status, phone_status, etc.)..
	 * @param type Type of the field. Possible values: string, text, number, date, bool.
	 * @param options additional options. public_name
	*/
	async createField(name: string, type: FieldType, options?: createFieldOptions): Promise<ResultResponse<{id: number}>>{
		const params = [];
		params.push({name: name});
		params.push({type: type});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.additionalFieldsAndLabels.createField, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for changing the parameters of a custom field. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/inputs/updatefield/)
	 * 
	 * @param id The id of the field to be changed.
	 * @param name Variable for substitution. Must be unique, case-sensitive. It's also not recommended to create a field with a name that matches one of the names of standard fields (tags, email, phone, email_status, phone_status, etc.)..
	 * @param options additional options. public_name
	*/
	async updateField(id: number, name: string, options?: createFieldOptions): Promise<ResultResponse<{id: number}>>{
		const params = [];
		params.push({id: id});
		params.push({name: name});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.additionalFieldsAndLabels.updateField, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for delete field. 
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/inputs/deletefield/)
	 * 
	 * @param id The id of the field to be changed.
	*/
	async deleteField(id: number): Promise<ResultResponse<EmptyObject>> {
		const params = [];
		params.push({id: id});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.additionalFieldsAndLabels.deleteField, paramsString);

		return request;
	}

	/** 
	 * A method for creating an e-mail message without sending it.
	 * Note that the maximum size of an e-mail message is 8mb.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/createemailmessage/)
	 * 
	 * @param senderName Sender name. Example: "Andrey Chmerev".
	 * @param senderEmail Sender e-mail. Example: "andrey@chmerev.com".
	 * @param listId The code of the list, which will be used to send the mailing list.
	 * @param options additional options.
	 * @param attachments A list of attachments. {name: "file.pdf", content: "the binary content of the file."}
	 * 
	*/
	async createEmailMessage(senderName: string, senderEmail: string, listId: number, options: createEmailMessageOptions, attachments?: {name: string, content: string}[]): Promise<ResultResponse<{message_id: number}>>{
		const params = [];
		params.push({sender_name: senderName});
		params.push({sender_email: senderEmail});
		params.push({list_id: listId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		let attachmentsString = '';

		attachments && attachments.forEach(() => {
			Object.entries(attachments).forEach(([, value]) => {
				attachmentsString += `&attachments[${value.name}]=${value.content}`;
			})
		})

		const request = await this.sendRequest(methods.createAndSendMessage.createEmailMessage, paramsString + optionsString + attachmentsString);

		return request;
	}

	/** 
	 * A method for creating an SMS message without sending it.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/createsmsmessage/)
	 * 
	 * @param senderName The sender's name is from 3 to 11 Latin letters and numbers. The name must be registered with the support service.
	 * @param body Message text with the ability to add wildcard fields.
	 * @param listId The code of the list on which the SMS will be sent. The codes of all lists can be obtained by calling getLists.
	 * @param tag Label. If set, the message will not be sent to the entire list, but only to those recipients who are assigned the label. 
	*/
	async createSmsMessage(senderName: string, body: string, listId: number, tag?: string): Promise<ResultResponse<{message_id: number}>> {
		const params = [];
		params.push({sender: senderName});
		params.push({body: body});
		params.push({list_id: listId});
		tag && params.push({tag: tag});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.createSmsMessage, paramsString);
		
		return request;
	}

	/** 
	 * Schedule or start sending an e-mail or SMS message immediately.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/createcampaign/)
	 * 
	 * @param messageId The code of the message to send. The code returned by createEmailMessage or createSmsMessage method should be passed.
	 * @param options additional options.
	*/
	async createCampaign(messageId: number, options?: createCampaignOptions): Promise<ResultResponse<createCampaignResult>> {

		const params = [];
		params.push({message_id: messageId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.createAndSendMessage.createCampaign, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for cancelling a scheduled mailing.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/cancel-campaign/)
	 * 
	 * @param campaignId The id of the mailing that you want to cancel.
	*/
	async cancelCampaign(campaignId: number): Promise<ResultResponse<EmptyObject>> {
		const params = [];
		params.push({campaign_id: campaignId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.cancelCampaign, paramsString);

		return request;
	}

	/** 
	 * Method returns the id of the current version of the specified message.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/get-actual-message-version/)
	 * 
	 * @param messageId The identifier of the message for which you want to get the id of the current version of the letter.
	*/
	async getActualMessageVersion(messageId: number): Promise<ResultResponse<{message_id: number, actual_version_id: number}>> {
		const params = [];
		params.push({message_id: messageId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.getActualMessageVersion, paramsString);

		return request;
	}

	/** 
	 * A method for simply sending one SMS message to one or more recipients.
	 * 
	 * Maximum number of numbers to send SMS: 150 per call.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/sendsms/)
	 * 
	 * @param phones The recipient's phone number in international format with a country code (you can omit the leading "+"). Example: "79031234567, 79031234567".
	 * @param sender Sender - the registered name of the sender (alpha name). The string can contain from 3 to 11 Latin letters or numbers with letters. Special characters are also possible - dot, hyphen, dash and some others.
	 * @param text Message text, up to 1000 characters. Type substitution characters are ignored.
	*/
	async sendSms(phones: string, sender: string, text: string) : Promise<ResultResponse<sendSmsResult>> {
		const params = [];
		params.push({phone: phones});
		params.push({sender: sender});
		params.push({text: text});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.sendSms, paramsString);

		return request;
	}

	/** 
	 * Returns a string - the status of sending an SMS message.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/check-sms/)
	 * 
	 * @param smsId The message code returned by the sendSms method.
	*/
	async checkSms(smsId: number): Promise<ResultResponse<{status: string}>> {
		const params = [];
		params.push({sms_id: smsId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.checkSms, paramsString);

		return request;
	}

	/** 
	 * A method for sending one individual email without using personalization and with limited statistical capabilities.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/sendemail/)
	 * 
	 * @param email The address of the recipient of the message.
	 * @param senderName The sender's name. An arbitrary string, displayed in the "From whom" field of the email client.
	 * @param senderEmail E-mail address of the sender.
	 * @param subject The subject line of the email.
	 * @param body The text of the email is in HTML format as a string.
	 * @param listId The list code from which the recipient will be prompted to unsubscribe if he or she clicks the unsubscribe link.
	 * @param options additional options.
	*/
	async sendEmail(email: string, senderName: string, senderEmail: string, subject: string, body: string, listId: number, options?: SendEmailOptions): Promise<ResultResponse<{email_id: string}>>{
		const params = [];
		params.push({email: email});
		params.push({sender_name: senderName});
		params.push({sender_email: senderEmail});
		params.push({subject: subject});
		params.push({body: body});
		params.push({list_id: listId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			const paramsForAdditionalProcessing = ['attachments', 'metadata'];
			if (!paramsForAdditionalProcessing.includes(key)) {
				optionsString += `&${key}=${value}`;
			}
		})

		let attachmentsString = '';

		options?.attachments && options.attachments.forEach(() => {
			Object.entries(options.attachments).forEach(([, value]) => {
				attachmentsString += `&attachments[${value.name}]=${value.content}`;
			})
		})

		let metadataString = '';

		options?.metadata && options.metadata.forEach(() => {
			Object.entries(options.metadata).forEach(([, value]) => {
				metadataString += `&metadata[${value.name}]=${value.value}`;
			})
		})

		const request = await this.sendRequest(methods.createAndSendMessage.sendEmail, paramsString + optionsString + attachmentsString + metadataString);

		return request;
	}

	/** 
	 * A method for sending a test email. You can only send an already created email.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/sendtestemail/)
	 * 
	 * @param email The address of the recipient of the message. You can send to multiple comma-separated addresses.
	 * @param idMail The identifier of an email message created earlier. (For example, using the createEmailMessage method).
	*/
	async sendTestEmail(email: string, idMail: number): Promise<ResultResponse<{ [key: string]: { success: boolean } }>>{
		const params = [];
		params.push({email: email});
		params.push({id: idMail});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.sendTestEmail, paramsString);

		return request;
	}

	/** 
	 * The method allows you to check the delivery status of emails sent by the sendEmail method.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/check-email/)
	 * 
	 * @param emailId The message code returned by the sendEmail method. You can specify up to 500 comma-separated email codes.
	*/
	async checkEmail(emailId: string): Promise<ResultResponse<checkEmailResult>> {
		const params = [];
		params.push({email_id: emailId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.checkEmail, paramsString);

		return request;
	}
}

export default Unisender;