# Messenger Webhook Handler

## Example

```ts
import Messenger, { MessageType } from "messenger-webhook-handler";

const messenger = new Messenger("HELLO_WORLD" /* verify token */);

messenger.on("message", (value, type: MessageType, sender) => {
	console.log("VALUE", value); // VALUE: GET_STARTED
	console.log("TYPE", type); // TYPE: postback
	console.log("SENDER", sender); // SENDER: 112233445566778899
});

messenger.listen();
```
