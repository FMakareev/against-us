import { Schema, type } from "@colyseus/schema";


export class MessageBaseActionSchema extends Schema {
    @type('string')
    sessionId: string;
}