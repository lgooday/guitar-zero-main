import "./index.css";
import { Playback } from "../../services/playback";
import { songService } from "../../services/songs";
import { getById, createEl, time } from "../../tools/html";
import { guitarEvent } from "../../tools/guitar-event";

let playback: Playback;
let elapsedTimer: number = window.setInterval(showElapsed, 1000);

/** MODE BAND */
const seekInput = getById<HTMLInputElement & { max: string }>("seek");
const buttonPlay = getById<HTMLButtonElement>("btn_play");
const buttonPause = getById<HTMLButtonElement>("btn_pause");
const buttonStop = getById<HTMLButtonElement>("btn_stop");

/** NOTES */
const divNoteGreen = getById<HTMLDivElement>("div_note_green");
const divNoteRed = getById<HTMLDivElement>("div_note_red");
const divNoteYellow = getById<HTMLDivElement>("div_note_yellow");
const divNoteBlue = getById<HTMLDivElement>("div_note_blue");
const divNoteOrange = getById<HTMLDivElement>("div_note_orange");
const divNoteStrum = getById<HTMLDivElement>("div_note_strum");

/** MODE FREE */
const divSamples = getById<HTMLDivElement>("div_samples");

/** EVENTS */
buttonPlay.addEventListener("click", play);
buttonStop.addEventListener("click", stop);
buttonPause.addEventListener("click", pause);
seekInput.addEventListener("click", seek);
window.addEventListener("load", windowLoaded);

function seek() {
  playback.seek(+seekInput.value);
}

function showElapsed() {
  if (playback) {
    const seekLabel = getById<HTMLLabelElement>("label_seek");
    seekLabel.innerText = `${time(playback.elapsed)} / ${time(
      playback.duration
    )}`;

    seekInput.value = playback.elapsed.toString();
  }
}

async function changeSong(folder: string) {
  const divModes = document.getElementsByClassName("div_modes")[0];

  divModes.classList.add("hidden");

  setSongContainerStatus("none");
  setSongContainerStatus("loading", folder);
  if (playback) {
    playback.stop();
  }

  playback = new Playback(folder);

  await playback.init();

  setSongContainerStatus("loaded", folder);

  divModes.classList.remove("hidden");

  const divModeBand = getById<HTMLDivElement>("mode_song");
  if (playback.hasMode("band")) {
    divModeBand.classList.remove("hidden");

    buttonStop.classList.add("hidden");
    buttonPause.classList.add("hidden");
    buttonPlay.classList.remove("hidden");
    seekInput.value = "0";
    seekInput.max = playback.duration.toString();
  } else {
    divModeBand.classList.remove("add");
  }

  const divModeFree = getById<HTMLDivElement>("mode_free");
  if (playback.hasMode("free")) {
    divModeFree.classList.remove("hidden");

    playback.getFreeModeSamples().forEach((sample) => {
      const startButton = createEl<HTMLButtonElement>("button");
      startButton.textContent = sample;
      startButton.addEventListener("click", () => playSample(sample));

      const sampleContainer = createEl<HTMLDivElement>("div");
      const sampleName = createEl<HTMLSpanElement>("span");
      sampleContainer.append(sampleName);
      sampleContainer.append(startButton);

      divSamples.append(sampleContainer);
    });
  } else {
    divModeFree.classList.remove("add");
  }
}

async function setSongContainerStatus(
  status: "loading" | "loaded" | "none",
  folder?: string
) {
  [...document.getElementsByClassName("songContainer")].forEach((element) => {
    element.classList.remove("loading", "loaded");
    element.classList.add("blur");
  });

  if (folder) {
    const targetContainer = getById<HTMLDivElement>(folder);
    targetContainer.classList.remove("blur");
    targetContainer.classList.add(status);
  }
}

async function windowLoaded() {
  const catalog = await songService.getCatalog();

  const songsDiv = getById("div_songs");

  for (const [folder, song] of Object.entries(catalog)) {
    const songDiv = createEl<HTMLDivElement>("div");
    songDiv.className = "songContainer";
    songDiv.id = folder;

    const bandNode = createEl<HTMLTitleElement>("h4");
    bandNode.textContent = song.band;
    songDiv.appendChild(bandNode);

    const imgNode = createEl<HTMLImageElement>("img");
    imgNode.src = songService.getArtUri(folder);
    imgNode.className = "bandImg";
    songDiv.appendChild(imgNode);

    const titleNode = createEl<HTMLTitleElement>("h5");
    titleNode.textContent = song.title;
    songDiv.appendChild(titleNode);

    songDiv.addEventListener("click", async () => {
      await changeSong(folder);
    });

    songsDiv.appendChild(songDiv);
  }
}

async function playSample(sample: string) {
  playback.playSample(sample);
}

async function play() {
  playback.play();
  buttonStop.classList.remove("hidden");
  buttonPause.classList.remove("hidden");
  buttonPlay.classList.add("hidden");
}

async function pause() {
  playback.pause();
  buttonStop.classList.add("hidden");
  buttonPause.classList.remove("hidden");
  buttonPlay.classList.remove("hidden");
}

async function stop() {
  playback.stop();
  buttonStop.classList.add("hidden");
  buttonPause.classList.add("hidden");
  buttonPlay.classList.remove("hidden");
}

function blinkNote(
  color: "ORANGE" | "BLUE" | "RED" | "YELLOW" | "GREEN" | "STRUMUP",
  div: HTMLDivElement
) {
  if (guitarEvent[`btn${color}`].hasChanged) {
    if (guitarEvent[`btn${color}`].isPressed) {
      div.classList.add("pressed");
    } else {
      div.classList.remove("pressed");
    }
  }
}

ipcRenderer.on("playback:note", (trame: string) => {
  const pressed = guitarEvent.demultiplex(trame);
  blinkNote("ORANGE", divNoteOrange);
  blinkNote("BLUE", divNoteBlue);
  blinkNote("YELLOW", divNoteYellow);
  blinkNote("RED", divNoteRed);
  blinkNote("GREEN", divNoteGreen);
  blinkNote("STRUMUP", divNoteStrum);
  if (playback) {
    playback.rock(pressed);
  }
});

// function showRock(data: any) {
//   [...document.getElementsByClassName("track")].forEach((element, index) => {
//     if (index === data.index) {
//       (
//         element.getElementsByClassName("dynamic")[0] as any
//       ).style = `width: ${data.val}%`;
//     }
//   });
// }
