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

export interface getWebVersionResult {
	letter_id: number;
	web_letter_link: string;
}

export interface updateEmailMessageOptions {
	sender_name?: string;
	sender_email?: string;
	subject?: string;
	body?: string;
	list_id?: number;
	text_body?: string;
	lang?: string;
	categories?: string;
}

export interface createEmailTemplateOptions {
	description?: string;
	text_body?: string;
	lang?: string;
}

export interface updateEmailTemplateOptions extends createEmailTemplateOptions {
	title?: string;
	subject?: string;
	body?: string;
}

export interface getTemplateOptions {
	system_template_id?: number;
	format?: 'html' | 'json';
}

export interface listTemplatesResult {
	id: string;
	sub_user_login: string;
	title: string;
	description: string;
	lang_code: string;
	subject: string;
	attachments: string;
	screenshot_url: string;
	fullsize_screenshot_url: string;
	created: string;
	updated: string;
	message_format: string;
	type: string;
	raw_body: string;
}

export interface getTemplateResult extends listTemplatesResult {
	body: string;
}

export interface getTemplatesOptions { 
	type?: 'system' | 'user';
	date_from?: string;
	date_to?: string;
	format?: 'html' | 'json';
	limit?: number;
	offset?: number;
}

export interface getCampaignDeliveryStatsOptions {
	notify_url?: string;
	changed_since?: string;
	field_ids?: string[];
}

export interface getCampaignDeliveryStatsResult {
	total: number;
	sent: number;
	delivered: number;
	read_unique: number;
	read_all: number;
	clicked_unique: number;
	clicked_all: number;
	unsubscribed: number;
	spam: number;
}

export interface getVisitedLinksResult {
	fields: string[];
	data: string[][];
}

export interface getCampaignsOptions {
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
}

export interface getCampaignsResult {
	id: number;
	start_time: string;
	status: string;
	message_id: number;
	list_id: number;
	subject: string;
	sender_name: string;
	sender_email: string;
	stats_url: string;
}

export interface getCampaignStatusResult {
	status: string;
	status_comment: string;
	creation_time: string;
	start_time: string;
}

export interface getMessagesOptions {
	format?: 'html' | 'json';
	limit?: number;
	offset?: number;
}

interface Attachments {
	isInline: boolean;
    name: string,
    size: number,
    url: string,
}

export interface listMessagesResult {
	id: number;
	sub_user_login: string;
	list_id: number;
	segment_id?: any;
	created: string;
	updated: string;
	service_type: string;
	active_version_id?: any;
	lang_code: string;
	sender_email: string;
	sender_name: string;
	subject: string;
	message_format: string;
}

export interface getMessagesResult extends listMessagesResult {
	body: string;
	attachments: Attachments[];
}

export interface getMessageResult {
	id: string;
	sub_user_login?: string | null;
	list_id: string;
	created: string;
	last_update: string;
	service_type: 'email' | 'sms';
	lang_code: string;
	active_version_id?: any;
	message_format: string;
	wrap_type: string;
	images_behavior: string;
	sender_email: string;
	sender_name: string;
	subject: string;
	body: string;
	text_body: string;
}