/* eslint-disable no-param-reassign */
import {
  playIcon,
  replayIcon,
  muteOnIcon,
  muteOffIcon,
} from './icons';
import { namespace } from './constants';
import {
  wrapElem, setAttributes, show, hide,
} from './utils';


export default class {
  constructor(video) {
    this.video = video;
    this.container = document.createElement('div');
    wrapElem(video, this.container);
  }

  setCustomControls() {
    const { video } = this;

    // Remove native controls
    video.controls = false;

    // Add controls
    const controlsBar = document.createElement('div');
    controlsBar.className = `${namespace}__controlsBar`;

    const progressBar = document.createElement('div');
    progressBar.className = `${namespace}__progressBar`;
    video.addEventListener('timeupdate', () => {
      // progressBar.value = video.currentTime;
      progressBar.style.width = `${Math.floor((video.currentTime / video.duration) * 100)}%`;
    });

    const muteBtn = document.createElement('div');
    muteBtn.className = `${namespace}__mute`;
    muteBtn.appendChild(muteOnIcon);
    muteBtn.appendChild(muteOffIcon);
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
    });

    [progressBar, muteBtn].forEach((element) => {
      controlsBar.appendChild(element);
    });


    const playBtn = document.createElement('div');
    playBtn.className = `${namespace}__play`;
    playBtn.appendChild(playIcon);
    playBtn.addEventListener('click', () => {
      hide(playBtn);
      video.play();
    });
    show(playBtn);

    const replayBtn = document.createElement('div');
    replayBtn.className = `${namespace}__replay`;
    replayBtn.appendChild(replayIcon);
    replayBtn.addEventListener('click', () => {
      video.muted = !video.muted;
    });
    video.addEventListener('ended', () => {
      hide(playBtn);
      show(replayBtn);
    });
    replayBtn.addEventListener('click', () => {
      video.play();
    });
    video.addEventListener('play', () => {
      hide(replayBtn);
    });

    [muteBtn, playBtn, replayBtn].forEach((element) => {
      setAttributes(element, {
        role: 'button',
        'aria-live': 'polite',
        tabindex: '0',
      });
    });

    [playBtn, replayBtn, controlsBar].forEach((element) => {
      this.container.appendChild(element);
    });

    video.addEventListener('click', () => {
      if (video.ended) return;
      if (!video.paused) video.pause();
      show(playBtn);
    });
  }

  play() {
    this.video.play();
  }
}
