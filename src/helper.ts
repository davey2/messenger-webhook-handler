import { MessageType } from "./MessageType";
import { Message } from "./Message";

export function GetMessageType(message: Message): MessageType {
	if ("message" in message) {
		if ("attachments" in message.message) return MessageType.ATTACHMENT;
		else if ("quick_reply" in message.message) return MessageType.QUICK_REPLY;
		else if ("text" in message.message) return MessageType.TEXT;
		else return MessageType.UNKNOWN;
	} else if ("postback" in message && "payload" in message.postback)
		return MessageType.POSTBACK;
	else return MessageType.UNKNOWN;
}
