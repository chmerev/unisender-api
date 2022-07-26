export const methods = {
	contactLists: {
		getLists: 'getLists',
		createList: 'createList',
		updateList: 'updateList',
		deleteList: 'deleteList',
		subscribe: 'subscribe',
		exclude: 'exclude',
		unsubscribe: 'unsubscribe',
		importContacts: 'importContacts',
		exportContacts: 'exportContacts',
		getTotalContactsCount: 'getTotalContactsCount',
		getContactCount: 'getContactCount',
		getContact : 'getContact '
	},
	additionalFieldsAndLabels: {
		getFields: 'getFields',
		createField: 'createField',
		updateField: 'updateField',
		deleteField: 'deleteField',
		getTags: 'getTags',
		deleteTag: 'deleteTag',
	},
	createAndSendMessage: {
		createEmailMessage: 'createEmailMessage',
		createSmsMessage: 'createSmsMessage',
		createCampaign: 'createCampaign',
		cancelCampaign: 'cancelCampaign',
		getActualMessageVersion: 'getActualMessageVersion',
		sendSms: 'sendSms',
		checkSms: 'checkSms',
		sendEmail: 'sendEmail',
		sendTestEmail: 'sendTestEmail',
		checkEmail: 'checkEmail',
		updateOptInEmail: 'updateOptInEmail',
		getWebVersion: 'getWebVersion',
		deleteMessage: 'deleteMessage',
		updateEmailMessage: 'updateEmailMessage'
	},
	templates: {
		createEmailTemplate: 'createEmailTemplate',
		updateEmailTemplate: 'updateEmailTemplate',
		deleteTemplate: 'deleteTemplate',
		getTemplate: 'getTemplate',
		getTemplates: 'getTemplates',
		listTemplates: 'listTemplates'
	},
	statistics: {
		getCampaignDeliveryStats: 'getCampaignDeliveryStats',
		getCampaignCommonStats: 'getCampaignCommonStats',
		getVisitedLinks: 'getVisitedLinks',
		getCampaigns: 'getCampaigns',
		getCampaignStatus: 'getCampaignStatus',
		getMessages: 'getMessages',
		getMessage: 'getMessage',
		listMessages: 'listMessages'
	},
	partners: {
		getCheckedEmail: 'getCheckedEmail',
		validateSender: 'validateSender',
		register: 'register',
		checkUserExists: 'checkUserExists',
		getUserInfo: 'getUserInfo',
		getUsers: 'getUsers',
		transferMoney: 'transferMoney',
		setSenderDomain: 'setSenderDomain'
	}
}