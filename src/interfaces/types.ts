export type EmptyObject = {
	[K in any] : never
}

export interface List {
	id: number;
	title: string;
}

interface ImportContactsLog {
	index: number;
	code: string;
	message: string;
}

export interface ImportContactsResult {
	total: number;
	inserted: number;
	updated: number;
	deleted: number;
	new_emails: number;
	invalid: number;
	log: ImportContactsLog[];
}

export interface ResultResponse<T> {
	result: T;
}

export interface CreateListOptions {
	before_subscribe_url?: string;
	after_subscribe_url?: string;
}

export interface ImportContactsOptions {
	overwrite_tags?: 0 | 1;
	overwrite_lists?: 0 | 1;
}

export interface SubscribeOptions {
	tags?: string;
	double_optin?: 0 | 3 | 4;
	overwrite?: 0 | 1 | 2;
}

enum EmailStatus {
	new,
	invited,
	active,
	inactive,
	unsubscribed,
	blocked,
	activation_requested
}

enum PhoneStatus {
	new,
	active,
	inactive,
	unsubscribed,
	blocked
}

export interface exportContactsOptions {
	notify_url?: string;
	list_id?: string;
	email?: string;
	phone?: string;
	tag?: string;
	email_status?: EmailStatus;
	phone_status?: PhoneStatus;
}

export interface exportContactsResult {
	task_uuid: string;
	status: 'new' | 'processing' | 'completed';
	task_type: string;
	file_to_download: string;
}

export interface getContactCountParameters {
	tagId?: string;
	type?: 'address' | 'phone';
	search?: string;
}
export interface getContactCountResult {
	listId: number;
	searchParams: getContactCountParameters;
	count: number;
}

export interface getContactOptions {
	include_lists?: 1 | 0;
	include_fields?: 1 | 0;
	include_details?: 1 | 0;
}

interface Email {
	email: string;
	added_at: Date;
	status: string;
	availability: string;
	last_send_datetime: Date;
	last_delivery_datetime: Date;
	last_read_datetime: Date;
	last_click_datetime: Date;
	rating: number;
}

interface ListContact {
	id: string;
	status: string;
	added_at: Date;
}

export interface getContactResult {
	email: Email;
	fields: {[key: string]: string};
	lists: ListContact[];
}