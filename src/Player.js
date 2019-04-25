/* eslint-disable no-param-reassign */

import {
  playIcon,
  replayIcon,
  muteOnIcon,
  muteOffIcon,
} from './icons';
import { namespace } from './constants';
import {
  wrapElem, setAttributes, show, hide, toggle,
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
      progressBar.style.width = `${Math.floor((video.currentTime / video.duration) * 100)}%`;
    });

    const muteBtn = document.createElement('div');
    const muteBtnClassName = `${namespace}__muteBtn`;
    muteBtn.className = muteBtnClassName;
    muteBtn.appendChild(muteOffIcon.cloneNode(true));
    muteBtn.appendChild(muteOnIcon.cloneNode(true));
    muteBtn.addEventListener('click', () => {
      this.toggleMute();
    });
    this.muteBtn = muteBtn;
    this.muteBtnClassName = muteBtnClassName;

    const playBtn = document.createElement('div');
    playBtn.className = `${namespace}__playBtn`;
    playBtn.appendChild(playIcon.cloneNode(true));
    playBtn.addEventListener('click', () => {
      this.play();
    });
    show(playBtn);
    this.playBtn = playBtn;

    const replayBtn = document.createElement('div');
    replayBtn.className = `${namespace}__replayBtn`;
    replayBtn.appendChild(replayIcon.cloneNode(true));
    replayBtn.addEventListener('click', () => {
      this.play();
    });
    this.replayBtn = replayBtn;


    [muteBtn, playBtn, replayBtn].forEach((element) => {
      setAttributes(element, {
        role: 'button',
        'aria-live': 'polite',
        tabindex: '0',
      });
    });


    [progressBar, muteBtn].forEach((element) => {
      controlsBar.appendChild(element);
    });

    [playBtn, replayBtn, controlsBar].forEach((element) => {
      this.container.appendChild(element);
    });


    video.addEventListener('click', () => {
      if (video.ended) return;
      if (!video.paused) this.pause();
    });

    video.addEventListener('play', () => {
      hide(playBtn);
      hide(replayBtn);
    });

    video.addEventListener('ended', () => {
      hide(playBtn);
      show(replayBtn);
    });
  }


  play() {
    const { video, playBtn, replayBtn } = this;

    hide(playBtn);
    hide(replayBtn);
    video.play();
  }

  pause() {
    this.video.pause();
    show(this.playBtn);
  }

  toggleMute() {
    toggle(this.muteBtn, `${this.muteBtnClassName}--off`);
    this.video.muted = !this.video.muted;
  }
}
