const ButtonOffset = {
  GREEN: 1,
  RED: 3,
  YELLOW: 5,
  BLUE: 7,
  ORANGE: 9,
  STRUMUP: 11,
};

class GuitarEvent {
  btnGREEN = new GuitarButton(ButtonOffset.GREEN);
  btnRED = new GuitarButton(ButtonOffset.RED);
  btnYELLOW = new GuitarButton(ButtonOffset.YELLOW);
  btnBLUE = new GuitarButton(ButtonOffset.BLUE);
  btnORANGE = new GuitarButton(ButtonOffset.ORANGE);
  btnSTRUMUP = new GuitarButton(ButtonOffset.STRUMUP);

  demultiplex(trame: string) {
    // shape G0R0Y0B0O0S0

    const pressed: (keyof typeof ButtonOffset)[] = [];

    if (this.btnGREEN.consume(trame)) {
      pressed.push("GREEN");
    }

    if (this.btnRED.consume(trame)) {
      pressed.push("RED");
    }

    if (this.btnYELLOW.consume(trame)) {
      pressed.push("YELLOW");
    }

    if (this.btnBLUE.consume(trame)) {
      pressed.push("BLUE");
    }

    if (this.btnORANGE.consume(trame)) {
      pressed.push("ORANGE");
    }

    if (this.btnSTRUMUP.consume(trame)) {
      pressed.push("STRUMUP");
    }

    return pressed;
  }
}

class GuitarButton {
  #isPressed: boolean;
  #changed: boolean;

  constructor(private offset: number) {}

  consume(trame: string): boolean {
    const isPressed = trame.charAt(this.offset) === "1";

    this.#changed = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;

    return this.#changed && this.#isPressed;
  }

  get hasChanged() {
    return this.#changed;
  }

  get isPressed() {
    return this.#isPressed;
  }
}

export const guitarEvent = new GuitarEvent();
