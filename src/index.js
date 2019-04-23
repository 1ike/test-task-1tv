const namespace = 'myCustomPlayer';

const players = document.getElementsByTagName('video');

const wrapElem = (element, wrapper) => {
  // eslint-disable-next-line no-param-reassign
  wrapper.className = namespace;
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

Array.from(players).forEach((video) => {
  // Hide the default controls
  // eslint-disable-next-line no-param-reassign
  video.controls = false;

  // Wrap element video
  const container = document.createElement('div');
  wrapElem(video, container);

  // Add controls
  const controlsBar = document.createElement('div');
  controlsBar.className = `${namespace}__controlsBar`;
  const progressBar = document.createElement('div');
  progressBar.className = `${namespace}__progressBar`;
  const muteBtn = document.createElement('div');
  muteBtn.className = `${namespace}__mute`;
  [progressBar, muteBtn].forEach((element) => {
    controlsBar.appendChild(element);
  });

  const playBtn = document.createElement('div');
  playBtn.className = `${namespace}__play`;
  const replayBtn = document.createElement('div');
  replayBtn.className = `${namespace}__replay`;

  [muteBtn, playBtn, replayBtn].forEach((element) => {
    element.setAttribute('role', 'button');
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('tabindex', '0');
  });

  [playBtn, replayBtn, controlsBar].forEach((element) => {
    container.appendChild(element);
  });
});
