#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;
int inPinGREEN = 5;    // D1
int inPinRED = 4;      // D2
int inPinYELLOW = 0;   // D3
int inPinBLUE = 2;     // D4
int inPinORANGE = 14;  // D5

int inPinSTRUMUP = 12;  //d6
// int inStrumDown = 13; //d7

int pressedGREEN = 0;
int pressedRED = 0;
int pressedYELLOW = 0;
int pressedBLUE = 0;
int pressedORANGE = 0;

int pressedSTRUMUP = 0;

std::array<int, 6> state;
// char state[6];

//Test

void setup() {
  Serial.begin(115200);
  Serial.println();

  pinMode(inPinGREEN, INPUT_PULLUP);
  pinMode(inPinRED, INPUT_PULLUP);
  pinMode(inPinYELLOW, INPUT_PULLUP);
  pinMode(inPinBLUE, INPUT_PULLUP);
  pinMode(inPinORANGE, INPUT_PULLUP);

  pinMode(inPinSTRUMUP, INPUT);
  // pinMode(inStrumDown, INPUT);

  WiFi.begin("ozome6", "@0z0m3_izimoni");

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  pressedGREEN = !digitalRead(inPinGREEN);
  pressedRED = !digitalRead(inPinRED);
  pressedYELLOW = !digitalRead(inPinYELLOW);
  pressedBLUE = !digitalRead(inPinBLUE);
  pressedORANGE = !digitalRead(inPinORANGE);
  pressedSTRUMUP = digitalRead(inPinSTRUMUP);
  // isStrumDown = digitalRead(inStrumDown);

  std::array<int, 6> loopState = { pressedGREEN,
                                   pressedRED,
                                   pressedYELLOW,
                                   pressedBLUE,
                                   pressedORANGE,
                                   pressedSTRUMUP };

  if (loopState != state) {
    state = loopState;

    char str[12];
    sprintf(str, "G%iR%iY%iB%iO%iS%i", loopState[0],loopState[1],loopState[2],loopState[3],loopState[4],loopState[5]);

    Serial.println(str);
    udp.beginPacket("192.168.1.28", 2222);
    udp.write(str);
    udp.endPacket();
  }

  delay(50);
}
