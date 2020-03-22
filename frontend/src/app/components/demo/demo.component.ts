import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { v4 } from "uuid";
import Peer, { DataConnection } from "peerjs";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"]
})
export class DemoComponent implements OnInit {
  peer: Peer;

  /**
   * The ID of the (other) peer
   */
  peerId: string;

  /**
   * ~my~ OUR message (soviet anthem starts playing)
   */
  private _peerMessage: string;

  get peerMessage(): string {
    return this._peerMessage;
  }

  set peerMessage(message: string) {
    this._peerMessage = message;
    this.connection.send(message);
  }

  connection: DataConnection;

  constructor(private cdr: ChangeDetectorRef) {}

  height = 100;
  width = 200;

  ngOnInit(): void {
    // Create a peer for myself
    this.peer = new Peer(v4());

    // Listen for incoming connections
    this.peer.on("connection", conn => {
      this.connection = conn;
      this.initListening();
    });
  }

  /**
   * Sets up a listener for incoming data
   */
  private initListening() {
    this.connection.on("data", (data: string) => {
      this._peerMessage = data;
      this.cdr.detectChanges();
    });
  }

  /**
   * Initiates a connection
   */
  connectToPeer() {
    this.connection = this.peer.connect(this.peerId);

    // When the outgoing connection is established
    this.connection.on("open", () => {
      this.initListening();
    });
  }
}
