import "./index.css";
import { Playback } from "../../services/playback";
import { songService } from "../../services/songs";
import type { Song } from "../../types";
import { getById, createSelectOption, createEl } from "../../tools/html";

let songs: Song[];
let playback: Playback;

const selectSong = getById<HTMLSelectElement>("slc_songs");
const divTracks = getById<HTMLDivElement>("div_tracks");

getById<HTMLButtonElement>("btn_play").addEventListener("click", play);
getById<HTMLButtonElement>("btn_stop").addEventListener("click", stop);
getById<HTMLButtonElement>("btn_pause").addEventListener("click", pause);
selectSong.addEventListener("change", changeSong);

window.addEventListener("load", loaded);

async function changeSong(e: Event & { target: HTMLInputElement }) {
  const selectedSong = e.target.value;

  playback = new Playback(selectedSong);

  playback.eventEmitter.on("volume:change", showRock);

  showTracks(await playback.init());
}

async function loaded() {
  songs = await songService.getAll();

  const options = selectSong.querySelectorAll("option");
  options.forEach((o) => o.remove());

  selectSong.add(createSelectOption("choose..."));

  songs.forEach((song) => {
    selectSong.add(createSelectOption(song.folder));
  });
}

async function play() {
  playback.play();
}

async function pause() {
  if (playback) {
    playback.pause();
  }
}

async function stop() {
  if (playback) {
    playback.stop();
  }
}

function showTracks(tracks: any[]) {
  divTracks.innerHTML = "";

  tracks.forEach((t, index) => {
    const trackDiv = createEl<HTMLDivElement>("div");
    trackDiv.classList.add("track");

    const volumeDiv = createEl<HTMLDivElement>("div");

    if (!t.rockable) {
      const volumeSlider = createEl<HTMLInputElement>("input");
      volumeSlider.id = "volume";
      volumeSlider.type = "range";
      volumeSlider.min = "0";
      volumeSlider.max = "1";
      volumeSlider.value = t.rockable ? "0" : "1";
      volumeSlider.step = "0.1";

      volumeSlider.addEventListener(
        "change",
        (e: Event & { target: HTMLInputElement }) => {
          playback.volume(index, +e.target.value);
        }
      );

      volumeDiv.appendChild(volumeSlider);
    } else {
      const dynamicDiv = createEl<HTMLDivElement>("div");
      dynamicDiv.classList.add("dynamic");
      volumeDiv.appendChild(dynamicDiv);
    }

    const volumeLabel = createEl<HTMLLabelElement>("label");
    volumeLabel.innerHTML = t.key;
    volumeDiv.appendChild(volumeLabel);
    trackDiv.appendChild(volumeDiv);
    divTracks.appendChild(trackDiv);
  });
}

ipcRenderer.on("playback:note", (val: string) => {
  getById<HTMLTextAreaElement>("debug").append(val);

  // if (val === "STRUM") {
  playback.rock();
  // }
});

function showRock(data: any) {
  [...document.getElementsByClassName("track")].forEach((element, index) => {
    if (index === data.index) {
      (
        element.getElementsByClassName("dynamic")[0] as any
      ).style = `width: ${data.val}%`;
    }
  });
}
