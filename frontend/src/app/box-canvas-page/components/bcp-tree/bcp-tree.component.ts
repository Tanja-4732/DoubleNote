import { Component, OnInit, Input } from "@angular/core";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";

@Component({
  selector: "app-bcp-tree",
  templateUrl: "./bcp-tree.component.html",
  styleUrls: ["./bcp-tree.component.scss"],
})
export class BcpTreeComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

  constructor() {}

  ngOnInit(): void {}
}
