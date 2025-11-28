import {
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IExecuteFunctions,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request-promise-native';

export class SupervaizeApiClient {
	constructor(
		private node: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	) {}

	async request(method: string, endpoint: string, body: any = {}, qs: any = {}) {
		const credentials = await this.node.getCredentials('supervaizeApi');
		const baseUrl = credentials.baseUrl as string;
		const apiKey = credentials.apiKey as string;
		const workspaceSlug = credentials.workspaceSlug as string;

		// Auto-prepend workspace path if endpoint starts with /api/
		if (endpoint.startsWith('/api/')) {
			endpoint = `/w/${workspaceSlug}${endpoint}`;
		}

		const options: OptionsWithUri = {
			method,
			uri: `${baseUrl}${endpoint}`,
			body,
			qs,
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			json: true,
		};

		// @ts-ignore
		return this.node.helpers.request(options);
	}
	
	async getWorkspaceSlug(): Promise<string> {
		const credentials = await this.node.getCredentials('supervaizeApi');
		return credentials.workspaceSlug as string;
	}
}
