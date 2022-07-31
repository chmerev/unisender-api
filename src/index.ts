import axios from 'axios';
import { CreateListOptions, ResultResponse, List, EmptyObject, ImportContactsOptions, ImportContactsResult, SubscribeOptions, exportContactsOptions, exportContactsResult, getContactCountParameters, getContactCountResult, getContactOptions, getContactResult, getFieldsResult, createFieldOptions, FieldType, createEmailMessageOptions, createCampaignOptions, createCampaignResult, sendSmsResult, SendEmailOptions, checkEmailResult, getWebVersionResult, updateEmailMessageOptions, createEmailTemplateOptions, updateEmailTemplateOptions, getTemplateOptions, getTemplateResult, getTemplatesOptions, listTemplatesResult, getCampaignDeliveryStatsOptions, getCampaignDeliveryStatsResult, getVisitedLinksResult, getCampaignsOptions, getCampaignsResult, getCampaignStatusResult, getMessagesOptions, getMessagesResult, getMessageResult, listMessagesResult } from './interfaces/types';
import { delay } from './utils/delay';
import { methods } from './utils/methods';

/** Initiate your Unisender account. */
class Unisender {
	private apiKey: string;
	private apiUrl = 'https://api.unisender.com/ru/api/';

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

	/** 
	 * You can use the updateOptInEmail method to change the text of the email. The text must include at least one link with the href="{{ConfirmUrl}}".
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/updateoptinemail/)
	 * 
	 * @param senderName Sender's name.
	 * @param senderEmail Sender's email.
	 * @param subject A string with the subject of the email. May include wildcard fields.
	 * @param body HTML-formatted email text with the ability to add wildcard fields.
	 * @param listId The code of the list to which this email will be sent when subscribed. The codes of all lists can be obtained by calling getLists.
	*/
	async updateOptInEmail(senderName: string, senderEmail: string, subject: string, body: string, listId: number): Promise<ResultResponse<EmptyObject>>{
		const params = [];
		params.push({sender_name: senderName});
		params.push({sender_email: senderEmail});
		params.push({subject: subject});
		params.push({body: body});
		params.push({list_id: listId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.updateOptInEmail, paramsString);

		return request;
	}

	/** 
	 * A method for getting a link to the web version of an email.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/getwebversion/)
	 * 
	 * @param campaignId The identifier of an existing campaign.
	 * @param format The output format takes the values html | json, by default json (html format is intended only for visual viewing of the result, the parser in this format will not work).
	*/
	async getWebVersion(campaignId: number, format?: 'json' | 'html'): Promise<ResultResponse<getWebVersionResult>>{
		const params = [];
		params.push({campaign_id: campaignId});
		format&& params.push({format: format});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.getWebVersion, paramsString);

		return request;
	}

	/** 
	 * A method for deleting a message.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/deletemessage/)
	 * 
	 * @param messageId Message code.
	*/
	async deleteMessage(messageId: number): Promise<ResultResponse<EmptyObject>>{
		const params = [];
		params.push({message_id: messageId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.createAndSendMessage.deleteMessage, paramsString);

		return request;
	}

	/** 
	 * A method for editing an existing email message (without sending it). You can create a new email message using the createEmailMessage method.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/messages/updateemailmessage/)
	 * 
	 * @param messageId Message code.
	 * @param options additional options.
	*/
	async updateEmailMessage(messageId: number, options?: updateEmailMessageOptions): Promise<ResultResponse<{message_id: number}>> {
		const params = [];
		params.push({message_id: messageId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.createAndSendMessage.updateEmailMessage, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for creating an email template for a mass mailing. You can use the updateEmailTemplate method to edit an existing template.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/createemailtemplate/)
	 * 
	 * @param title Template name.
	 * @param subject A string with the subject of the email. May include wildcard fields.
	 * @param body The text of the email template in HTML format with the ability to add wildcard fields.
	 * @param options additional options.
	*/
	async createEmailTemplate(title: string, subject: string, body: string, options?: createEmailTemplateOptions): Promise<ResultResponse<{template_id: number, warnings: {[key: string]: string}[]}>> {
		const params = [];
		params.push({title: title});
		params.push({subject: subject});
		params.push({body: body});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.templates.createEmailTemplate, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for editing an email template for a mass mailing created using the createEmailTemplate method.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/updateemailtemplate/)
	 * 
	 * @param templateId Template ID, can be obtained by calling the createEmailTemplate, getTemplate, getTemplates, listTemplates methods.
	 * @param options additional options.
	*/
	async updateEmailTemplate(templateId: number, options?: updateEmailTemplateOptions): Promise<ResultResponse<{warnings: {[key: string]: string}[]}>> {
		const params = [];
		params.push({template_id: templateId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.templates.updateEmailTemplate, paramsString + optionsString);

		return request;
	}

	/** 
	 * A method for removing a template.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/deletetemplate/)
	 * 
	 * @param templateId Template ID, can be obtained by calling the createEmailTemplate, getTemplate, getTemplates, listTemplates methods.
	*/
	async deleteTemplate(templateId: number): Promise<ResultResponse<EmptyObject>> {
		const params = [];
		params.push({template_id: templateId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.templates.deleteTemplate, paramsString);

		return request;
	}

	/** 
	 * The method returns information about the specified template.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/gettemplate/)
	 * 
	 * @param templateId Template ID, can be obtained by calling the createEmailTemplate, getTemplate, getTemplates, listTemplates methods.
	 * @param options additional options.
	*/
	async getTemplate(templateId: number, options?: getTemplateOptions): Promise<ResultResponse<getTemplateResult>> {
		const params = [];
		params.push({template_id: templateId});

		const paramsString = this.parameterСollection(params);

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.templates.getTemplate, paramsString + optionsString);

		return request;
	}

	/** 
	 * This method is used to get the list of all templates created both through the personal UniSender account and through API.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/gettemplates/)
	 * 
	 * @param options additional options.
	*/
	async getTemplates(options?: getTemplatesOptions): Promise<ResultResponse<getTemplateResult[]>> {

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.templates.getTemplates, optionsString);

		return request;
	}

	/** 
	 * This method is used to get the list of all templates created both through personal UniSender account and through API. The method works like getTemplates, the only difference is that listTemplates does not return body parameter. To get the body use getTemplate method.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/templates/listtemplates/)
	 * 
	 * @param options additional options.
	*/
	async listTemplates(options?: getTemplatesOptions): Promise<ResultResponse<listTemplatesResult[]>> {

		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.templates.listTemplates, optionsString);

		return request;
	}

	/** 
	 * Get a report on the results of message delivery in the specified mailing list.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getcampaigndeliverystats/)
	 * 
	 * @param campaignId The identifier of the campaign obtained by calling the createCampaign method.
	 * @param options additional options
	 * @returns A link for download to the exported file.
	*/
	async getCampaignDeliveryStats(campaignId: number, options?:getCampaignDeliveryStatsOptions): Promise<string>{

		let filedsString = '';

		options?.field_ids && options.field_ids.forEach(field => {
			filedsString += `&field_ids[]=${field}`;
		})

		const params = [];
		params.push({campaign_id: campaignId});

		options && Object.entries(options).forEach(([key, value]) => {
			const paramsForAdditionalProcessing = ['field_ids'];
			if (!paramsForAdditionalProcessing.includes(key)) {
				params.push({[key]: value});
			}
		})

		const paramsString = this.parameterСollection(params);

		const request: ResultResponse<exportContactsResult> = await this.sendRequest(methods.statistics.getCampaignDeliveryStats, filedsString + paramsString);

		if (request?.result.status !== 'new') {
			throw new Error('An error occurred when creating a task for export. Please try again later.');
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
	 * Get general information about message delivery results of the specified mailing. The method returns statistics similar to "Newsletters" - "Sent reports" of UniSender cabinet.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/get-campaign-common-stats/)
	 * 
	 * @param campaignId The identifier of the campaign obtained by calling the createCampaign method.
	*/
	async getCampaignCommonStats(campaignId: number): Promise<ResultResponse<getCampaignDeliveryStatsResult>>{
		const params = [];
		params.push({campaign_id: campaignId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.getCampaignCommonStats, paramsString);

		return request;
	}

	/** 
	 * Get a report on the links visited by users in the specified email newsletter.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getvisitedlinks/)
	 * 
	 * @param campaignId The identifier of the campaign obtained by calling the createCampaign method.
	*/
	async getVisitedLinks(campaignId: number, group?:string): Promise<ResultResponse<getVisitedLinksResult>>{
		const params = [];
		params.push({campaign_id: campaignId});
		group && params.push({group: group});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.getVisitedLinks, paramsString);

		return request;
	}

	/** 
	 * A method for getting a list of all available mailings. The number of mailings you can receive at a time is limited to 10000. To get the full list of mailings if their number is more than 10000, use parameters from and to.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getcampaigns/)
	 * 
	 * @param options additional options.
	*/
	async getCampaigns(options?: getCampaignsOptions): Promise<ResultResponse<getCampaignsResult[]>> {
		
		let optionsString = '';

		options && Object.entries(options).forEach(([key, value]) => {
			optionsString += `&${key}=${value}`;
		})

		const request = await this.sendRequest(methods.statistics.getCampaigns, optionsString);

		return request;
	}

	/** 
	 * Find out the status of the mailing list created by the createCampaign method.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getcampaignstatus/)
	 * 
	 * @param campaignId The distribution code obtained by the createCampaign method.
	*/
	async getCampaignStatus(campaignId: number): Promise<ResultResponse<getCampaignStatusResult>> {
		const params = [];
		params.push({campaign_id: campaignId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.getCampaignStatus, paramsString);

		return request;
	}

	/** 
	 * This method is used to get the list of mails created both through the personal UniSender cabinet and through API (createEmailMessage + createCampaign etc.)
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getmessages/)
	 * 
	 * @param dateFrom the creation date is greater than, the format is yyyyy-mm-dd hh:mm UTC.
	 * @param dateTo the creation date is less than, the format is yyyyy-mm-dd hh:mm UTC.
	 * @param options additional options.
	*/
	async getMessages(dateFrom: string, dateTo: string, options?: getMessagesOptions): Promise<ResultResponse<getMessagesResult[]>> {
		const params = [];
		params.push({date_from: dateFrom});
		params.push({date_to: dateTo});

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.getMessages, paramsString);

		return request;
	}

	/** 
	 * A method for getting information about an SMS or email message.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/getmessages/)
	 * 
	 * @param messageId message identifier.
	*/
	async getMessage(messageId: number): Promise<ResultResponse<getMessageResult[]>> {
		const params = [];
		params.push({id: messageId});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.getMessage, paramsString);

		return request;
	}

	/** 
	 * This method is used to get a list of all messages created both through personal UniSender account and through API. The method works like getMessages, unlike listMessages - it doesn't return message body and attachments, but it returns user login.
	 * 
	 * [More information](https://www.unisender.com/ru/support/api/statistics/listmessages/)
	 * 
	 * @param dateFrom the creation date is greater than, the format is yyyyy-mm-dd hh:mm UTC.
	 * @param dateTo the creation date is less than, the format is yyyyy-mm-dd hh:mm UTC.
	 * @param options additional options.
	*/
	async listMessages(dateFrom: string, dateTo: string, options?: getMessagesOptions): Promise<ResultResponse<listMessagesResult[]>> {
		const params = [];
		params.push({date_from: dateFrom});
		params.push({date_to: dateTo});

		options && Object.entries(options).forEach(([key, value]) => {
			params.push({[key]: value});
		})

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.statistics.listMessages, paramsString);

		return request;
	}
}

export default Unisender;