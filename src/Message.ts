export interface Message {
	sender: {
		id: string;
	};
	recipient: {
		id: string;
	};
	timesent: number;
	message: {
		mid: string;
		text: string;
		attachments: Attachment[];
		quick_reply: {
			payload: string;
		};
	};
	postback: {
		payload: string;
		mid: string;
		title: string;
	};
}

export interface Attachment {
	type: string;
	payload: {
		url: string;
	};
}
