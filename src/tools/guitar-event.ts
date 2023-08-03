const ButtonOffset = {
  GREEN: 1,
  RED: 3,
  STRUMUP: 11,
};

class GuitarEvent {
  #btnRED: GuitarButton;
  #btnGREEN: GuitarButton;
  #btnSTRUMUP: GuitarButton;

  demultiplex(trame: string) {
    // shape G0R0Y0B0O0S0
    this.#btnRED.consume(trame.charAt(ButtonOffset.RED) === "1");
    this.#btnGREEN.consume(trame.charAt(ButtonOffset.GREEN) === "1");
    this.#btnSTRUMUP.consume(trame.charAt(ButtonOffset.STRUMUP) === "1");
  }
}

export const guitarEvent = new GuitarEvent();

class GuitarButton {
  #isPressed: boolean;
  #changed: boolean;

  consume(isPressed: boolean) {
    if (this.#isPressed !== isPressed) {
      this.#changed = true;
      this.#isPressed = isPressed;
    }
  }

  get hasChanged() {
    return this.#changed;
  }
}
