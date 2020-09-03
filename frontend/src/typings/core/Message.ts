import { MdomNode } from "../markdown/MDOM";

/**
 * A message is a unit of information which should be sent to other peers.
 *
 * Any event modifying the shared state of the application or its data needs to be treated as a message.
 * Some UI-events might not need to be treated as messages, such as opening or closing the sidenav.
 *
 * Messages come in multiple forms, but all derive from the same base interface.
 */
export type Message =
  | DemoTextMessage
  | TextBoxMessage
  | BcpMessage
  | SessionMessage;

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
  messageType:
    | "DemoTextMessage"
    | "TextBoxMessage"
    | "BcpMessage"
    | "SessionMessage";
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

  /**
   * The selections (and carets) of the users
   */
  selections: {
    [userUuid: string]: Selection;
  };
}

export interface BcpMessage extends BaseMessage {
  messageType: "BcpMessage";

  /**
   * The UUID of the Box Canvas Page this message applies to
   */
  uuid: string;

  /**
   * The type of operation to perform on the box
   */
  operation: "create" | "update" | "delete";

  /**
   * The box to be affected by this message
   */
  box: {
    /**
     * The UUID of the box
     */
    uuid: string;

    /**
     * The state of the box
     */
    state?: "both" | "markdown" | "wysiwyg";

    /**
     * The x coordinate of the box
     */
    x?: number;

    /**
     * The y coordinate of the box
     */
    y?: number;

    /**
     * The width of the box
     */
    width?: number;

    /**
     * The height of the box
     */
    height?: number;

    /**
     * This field must always be undefined.
     *
     * Use TextBoxMessage instead
     */
    mdom: undefined;
  };
}

export interface SessionMessage extends BaseMessage {
  messageType: "SessionMessage";

  /**
   * The type of this request from the perspective of the sender
   */
  requestType: SessionRequestType;

  joinCode?: string;
}

export enum SessionRequestType {
  JoinRemote = "JoinRemote",
  LeaveRemote = "LeaveRemote",
  RevokeInvite = "RevokeInvite",
  JoinConfirmation = "JoinConfirmation",
  InviteAcceptConfirm = "InviteAcceptConfirm",
}
