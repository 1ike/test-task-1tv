/* eslint-disable no-param-reassign */
import './main.scss';

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

    this.muted = false;
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
      progressBar.style.width = `${Math.floor((video.currentTime / video.duration) * 100)}%`;
    });

    const muteBtn = document.createElement('div');
    const muteBtnClassName = `${namespace}__muteBtn`;
    muteBtn.className = muteBtnClassName;
    muteBtn.appendChild(muteOnIcon);
    muteBtn.appendChild(muteOffIcon);
    muteBtn.addEventListener('click', () => {
      muteBtn.classList.toggle(`${muteBtnClassName}--off`);

      this.muted = !this.muted;
      video.muted = this.muted;
    });

    [progressBar, muteBtn].forEach((element) => {
      controlsBar.appendChild(element);
    });


    const playBtn = document.createElement('div');
    playBtn.className = `${namespace}__playBtn`;
    playBtn.appendChild(playIcon);
    playBtn.addEventListener('click', () => {
      hide(playBtn);
      video.play();
    });
    show(playBtn);

    const replayBtn = document.createElement('div');
    replayBtn.className = `${namespace}__replayBtn`;
    replayBtn.appendChild(replayIcon);
    replayBtn.addEventListener('click', () => {
      hide(replayBtn);
      video.play();
    });
    video.addEventListener('ended', () => {
      hide(playBtn);
      show(replayBtn);
    });
    replayBtn.addEventListener('click', () => {
      video.play();
    });
    video.addEventListener('play', () => {
      video.muted = this.muted;
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
