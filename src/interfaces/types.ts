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

type EmailStatus = 'new' | 'invited' | 'active' | 'inactive' | 'unsubscribed' | 'blocked' | 'activation_requested';

type PhoneStatus = 'new' | 'active' | 'inactive' | 'unsubscribed' | 'blocked';

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

export interface getFieldsResult {
	id: number;
	name: string;
	type: string;
	is_visible: number;
	view_pos: number;
}

export type FieldType = 'string' | 'text' | 'number' | 'date' | 'bool' ;

export interface createFieldOptions {
	public_name?: string;
}

export interface createEmailMessageOptions {
	subject?: string;
	body?: string;
	text_body?: string;
	generate_text?: 0 | 1;
	tag?: string;
	lang?: string;
	template_id?: number;
	system_template_id?: number;
	wrap_type?: 'skip' | 'right' | 'left' | 'center';
}

export interface createCampaignOptions {
	start_time?: string;
	timezone?: string;
	track_read?: 0 | 1;
	track_links?: 0 | 1;
	contacts?: 'string'
	contacts_url?: string;
	track_ga?: 0 | 1;
	payment_limit?: number;
	payment_currency?: string;
	ga_medium?: string;
	ga_source?: string;
	ga_campaign?: string;
	ga_content?: string;
	ga_term?: string;
}

export interface createCampaignResult {
	campaign_id: number;
	status: 'scheduled' | 'waits_censor';
	count: number;
}

export interface sendSmsResult {
	currency: string;
	price: number;
	sms_id: number;
}

export interface SendEmailOptions {
	lang?: string;
	track_read?: 0 | 1;
	track_links?: 0 | 1;
	cc?: string;
	headers?: string;
	images_as?: 'attachments' | 'only_links' | 'user_default';
	ref_key?: string;
	error_checking?: 0 | 1;
	attachments?: {name: string, content: string}[];
	metadata?: {name: string, value: string}[];
}

export interface checkEmailResult {
	statuses: { id: string; status: string;}[];
	failed_email_id: {[key: string]: string}[];
}