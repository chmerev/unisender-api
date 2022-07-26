import axios from 'axios';
import { CreateListOptions, ResultResponse, List, EmptyObject } from './interfaces/types';
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

	async getLists(): Promise<ResultResponse<List[]>> {
		const request = await this.sendRequest(methods.contactLists.getLists);
		return request;
	}

	/** A method for creating a new contact list. */
	async createList(title: string, options?: CreateListOptions): Promise<ResultResponse<{id: number}>> {
		const params = [];

		params.push({title: title});
		options?.after_subscribe_url && params.push({after_subscribe_url: options.after_subscribe_url});
		options?.before_subscribe_url && params.push({before_subscribe_url: options.before_subscribe_url});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.createList, paramsString);

		return request;
	}

	/** A method for update contact list. */
	async updateList(id:number, title: string, options?: CreateListOptions): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({list_id: id});
		params.push({title: title});
		options?.after_subscribe_url && params.push({after_subscribe_url: options.after_subscribe_url});
		options?.before_subscribe_url && params.push({before_subscribe_url: options.before_subscribe_url});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.updateList, paramsString);

		return request;
	}

	async deleteList(id:number): Promise<ResultResponse<EmptyObject>> {
		const params = [];

		params.push({list_id: id});

		const paramsString = this.parameterСollection(params);

		const request = await this.sendRequest(methods.contactLists.deleteList, paramsString);

		return request;
	}
}

export default Unisender;