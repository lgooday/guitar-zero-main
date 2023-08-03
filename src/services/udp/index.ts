import udp, { Socket } from "dgram";
import { EventEmitter } from "events";
import { guitarEvent } from "../../tools/guitar-event";

const port = 2222;

class UdpServer {
  #socket: Socket = udp.createSocket("udp4");
  eventEmitter: EventEmitter = new EventEmitter();

  init() {
    this.#socket.on("listening", this.listening);
    this.#socket.on("message", (...args) => this.message(args[0]));
    this.#socket.bind(port);
  }

  listening() {
    console.log("Server is listening at port " + port);
  }

  message(msg: Buffer) {
    this.eventEmitter.emit("remote-input", msg.toString());
  }
}

export const server = new UdpServer();
