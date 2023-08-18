import "./index.css";
import { Playback } from "../../services/playback";
import { songService } from "../../services/songs";
import { getById, createEl, time } from "../../tools/html";
import { guitarEvent } from "../../tools/guitar-event";

let playback: Playback;
let elapsedTimer: number = window.setInterval(showElapsed, 1000);

/** MODE BAND */
const seekInput = getById<HTMLInputElement & { max: string }>("seek");
const buttonBandPlay = getById<HTMLButtonElement>("btn_band_play");
const buttonBandPause = getById<HTMLButtonElement>("btn_band_pause");
const buttonBandStop = getById<HTMLButtonElement>("btn_band_stop");

/** NOTES */
const divNoteGreen = getById<HTMLDivElement>("div_note_green");
const divNoteRed = getById<HTMLDivElement>("div_note_red");
const divNoteYellow = getById<HTMLDivElement>("div_note_yellow");
const divNoteBlue = getById<HTMLDivElement>("div_note_blue");
const divNoteOrange = getById<HTMLDivElement>("div_note_orange");
const divNoteStrum = getById<HTMLDivElement>("div_note_strum");

/** MISC */
const divCatalog = getById<HTMLDivElement>("div_catalog");
const divModeBand = getById<HTMLDivElement>("div_mode_band");
const divModeFree = getById<HTMLDivElement>("div_mode_free");

/** MODE FREE */
const divSamples = getById<HTMLDivElement>("div_samples");

/** EVENTS */
buttonBandPlay.addEventListener("click", bandPlay);
buttonBandStop.addEventListener("click", bandStop);
buttonBandPause.addEventListener("click", bandPause);
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

async function changeSong(folder: string, mode: "band" | "free") {
  setSongContainerStatus("none");
  setSongContainerStatus("loading", folder);
  if (playback) {
    playback.stop();
  }

  playback = new Playback(folder);
  await playback.init(mode);

  setSongContainerStatus("loaded", folder);

  divModeBand.classList.add("hidden");
  divModeFree.classList.add("hidden");

  if (mode === "band") {
    divModeBand.classList.remove("hidden");
    seekInput.value = "0";
    seekInput.max = playback.duration.toString();
  }

  if (mode === "free") {
    divModeFree.classList.remove("hidden");
    divSamples.textContent = "";

    playback.getFreeModeSamples().forEach((sample) => {
      const sampleDiv = createEl<HTMLDivElement>("div");
      sampleDiv.classList.add("div_sample");
      sampleDiv.id = sample;
      sampleDiv.textContent = sample;
      sampleDiv.addEventListener("click", () => selectSample(sample));

      divSamples.append(sampleDiv);
    });
  }
}

function selectSample(sample: string) {
  [...document.getElementsByClassName("div_sample")].forEach(
    (element, index) => {
      if (element.id === sample) {
        element.classList.add("selected");
      } else {
        element.classList.remove("selected");
      }
    }
  );

  playback.setSample(sample);
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

    const bandModeNode = createEl<HTMLButtonElement>("button");
    bandModeNode.textContent = "Band Mode";
    bandModeNode.classList.add("btn_mode");
    bandModeNode.disabled = !song.hasBandMode;

    bandModeNode.addEventListener("click", () => {
      changeSong(folder, "band");
    });

    songDiv.appendChild(bandModeNode);

    const freeModeNode = createEl<HTMLButtonElement>("button");
    freeModeNode.textContent = "Free Mode";
    freeModeNode.classList.add("btn_mode");
    freeModeNode.disabled = !song.hasFreeMode;

    freeModeNode.addEventListener("click", () => {
      changeSong(folder, "free");
    });

    songDiv.appendChild(freeModeNode);

    divCatalog.appendChild(songDiv);
  }
}

async function bandPlay() {
  playback.play();
}

async function bandPause() {
  playback.pause();
}

async function bandStop() {
  playback.stop();
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
  if (playback && pressed.length) {
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
