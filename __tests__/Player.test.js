import Player from '../src/Player';

let video;

let player;

describe.skip('Player', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <video id='test' src="http://v1-rtc.1internet.tv/video/multibitrate/video/2018/12/13/3c7a1fae-88d5-48cb-a451-17fa7f8082ef_20180511_Dekabristi_new_950.mp4" controls></video>
  `;

    video = document.getElementById('test');

    player = new Player(video);
    player.setCustomControls();
  });

  test('mute', () => {
    expect(video.muted).toBeFalsy();

    const muteBtn = document.getElementsByClassName(player.muteBtnClassName)[0];

    muteBtn.click();
    expect(video.muted).toBeTruthy();

    muteBtn.click();
    expect(video.muted).toBeFalsy();
  });
});
