export type EmptyObject = {
	[K in any] : never
}

export interface List {
	id: number;
	title: string;
}

export interface ResultResponse<T> {
	result: T;
}

export interface CreateListOptions {
	before_subscribe_url?: string;
	after_subscribe_url?: string;
}