import express, { Express, Request, Response, json } from "express";
import { EventEmitter } from "events";
import { MessageType } from "./MessageType";
import { GetMessageType } from "./helper";
import { Attachment, Message } from "./Message";

declare interface Messenger {
	on(
		event: "message",
		listener: (
			value: string | string[],
			type: MessageType,
			sender: string
		) => void
	): this;
	on(event: string, listener: () => void): this;
}

class Messenger extends EventEmitter {
	private express: Express = express();

	constructor(private verifyToken: string) {
		super();

		this.express.use(json());

		this.addRoutes();
	}

	private addRoutes() {
		this.express.get("/", (request: Request, response: Response) => {
			if (request.query["hub.verify_token"] === this.verifyToken) {
				response.send(request.query["hub.challenge"]);
			} else response.sendStatus(400);
		});

		this.express.post("/", (request: Request, response: Response) => {
			//console.log(request.body);
			request.body.entry.forEach((entry: any) => {
				//console.log(entry);
				entry.messaging.forEach((message: Message) => {
					//console.log(message);
					const type: MessageType = GetMessageType(message);

					if (type === MessageType.TEXT)
						this.emit("message", message.message.text, type, message.sender.id);
					else if (type === MessageType.ATTACHMENT) {
						const urls: string[] = [];

						message.message.attachments.forEach((attachment: Attachment) => {
							urls.push(attachment.payload.url);
						});

						this.emit("message", urls, type, message.sender.id);
					} else if (type === MessageType.POSTBACK)
						this.emit(
							"message",
							message.postback.payload,
							type,
							message.sender.id
						);
					else if (type === MessageType.QUICK_REPLY)
						this.emit(
							"message",
							message.message.quick_reply.payload,
							type,
							message.sender.id
						);
				});
			});

			response.sendStatus(200);
		});
	}

	public listen(port: number = 3000): void {
		this.express.listen(port, () => {
			console.log("Messenger Webhook Handler is listening on port", port);
		});
	}
}

export default Messenger;
