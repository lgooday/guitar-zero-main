import { IpcMainEvent } from "electron";

export interface IpcRequest {
  responseChannel?: string;
  params?: string[];
}

export interface IpcChannelInterface {
  getName(): string;
  handle(event: IpcMainEvent, request: IpcRequest): void;
}

import { execSync } from "child_process";

export class SystemInfoChannel implements IpcChannelInterface {
  getName(): string {
    return "system-info";
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    event.sender.send(request.responseChannel, {
      kernel: execSync("uname -a").toString(),
    });
  }
}
