import { MdomNode } from "./MDOM";

/**
 * A message is a unit of information which should be sent to other peers.
 *
 * Any event modifying the shared state of the application or its data needs to be treated as a message.
 * Some UI-events might not need to be treated as messages, such as opening or closing the sidenav.
 *
 * Messages come in multiple forms, but all derive from the same base interface.
 */
export type Message = DemoTextMessage | TextBoxMessage;

/**
 * The base interface all Message interfaces derive from
 *
 * It's not exported; the "Message" type should be used instead.
 */
interface BaseMessage {
  /**
   * The UUID of the peer who is responsible for this message
   */
  authorUuid: string;

  /**
   * An ISO date representing the moment in time of this message's creation
   */
  creationDate: string;

  /**
   * The type of the message
   */
  messageType: "DemoTextMessage" | "TextBoxMessage";
}

export interface DemoTextMessage extends BaseMessage {
  messageType: "DemoTextMessage";
  text: string;
}

export interface TextBoxMessage extends BaseMessage {
  messageType: "TextBoxMessage";

  /**
   * The MarkDown Object Model representation of the text box content
   */
  mdom: MdomNode[];

  /**
   * The UUID of the text box this message applies to
   */
  uuid: string;
}
