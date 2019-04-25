import './main.scss';

import Player from './Player';


const players = document.getElementsByTagName('video');

Array.from(players).forEach((video, index) => {
  const player = new Player(video);

  player.setCustomControls();

  if (index === 0) player.play();
});
