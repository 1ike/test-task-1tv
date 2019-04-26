import './main.scss';

import Player from './Player';


const players = document.getElementsByTagName('video');

Array.from(players).forEach((video, index) => {
  const player = new Player(video);

  player.setCustomControls();

  // eslint-disable-next-line no-param-reassign
  if (index === 0) video.autoplay = true;

  // if (index === 0) {
  //   video.addEventListener('canplay', () => {
  //     player.play();
  //   });
  // }
});
