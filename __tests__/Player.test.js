import Player from '../src/Player';
import { namespace } from '../src/constants';

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

  test('play/pause', () => {
    const playBtn = document.getElementsByClassName(`${namespace}__playBtn`)[0];
    expect(getComputedStyle(playBtn).display).not.toBe('none');
    expect(video.paused).toBeTruthy();

    // playBtn.click();
    // expect(getComputedStyle(playBtn).display).toBe('none');
    // expect(video.paused).toBeFalsy();

    video.click();
    expect(getComputedStyle(playBtn).display).not.toBe('none');
    expect(video.paused).toBeTruthy();
  });
});
