import puppeteer from 'puppeteer';
import os from 'os';
import dotenv from 'dotenv';

import { namespace } from '../src/constants';

dotenv.config();

const pathToChromeDefault = os.platform() === 'win32'
  ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  : '/usr/bin/google-chrome-stable';
const pathToChrome = process.env.PATH_TO_CHROME
  ? process.env.PATH_TO_CHROME
  : pathToChromeDefault;

const url = 'http://localhost:8080/';
const headless = true;
const timeout = 30000;

let page;
let browser;

let video;
let muteBtn;
let playBtn;
let replayBtn;
let progressBar;

const videoSelector = 'video';
const muteBtnSelector = `.${namespace}__muteBtn`;
const playBtnSelector = `.${namespace}__playBtn`;
const replayBtnSelector = `.${namespace}__replayBtn`;
const progressBarSelector = `.${namespace}__progressBar`;


const getProperty = async (element, property) => {
  const value = await (await element.getProperty(property)).jsonValue();
  return value;
};

const getComputedStyleProperty = async (element, property) => {
  // property must be named in js style: not class but className etc.
  const fn = (el, prop) => getComputedStyle(el)[prop];
  const value = await page.evaluateHandle(fn, element, property);
  return value.jsonValue();
};

const getComputedWidth = async (element) => {
  const value = await getComputedStyleProperty(element, 'width');
  return value;
};

const appointFlagToEvent = async (flag, event, element = video) => {
  await page.evaluate((flagName, eventName, elem) => {
    elem.addEventListener(eventName, () => { window[flagName] = true; });
  }, flag, event, element);
};

const isVisible = async element => (await element.boxModel() !== null);


describe('E2E browser testing', () => {
  beforeAll(async () => {
    jest.setTimeout(timeout);
    browser = await puppeteer.launch({
      headless,
      args: ['--no-sandbox'],
      executablePath: pathToChrome,
    });
    page = await browser.newPage();

    await page.goto(url);

    video = await page.$(videoSelector);
    muteBtn = await page.$(muteBtnSelector);
    playBtn = await page.$(playBtnSelector);
    replayBtn = await page.$(replayBtnSelector);
    progressBar = await page.$(progressBarSelector);

    await page.waitForFunction(`document.querySelector("${videoSelector}").readyState >= 2`);
  });

  it(
    'mute',
    async () => {
      const muted = await getProperty(video, 'muted');
      if (muted) await muteBtn.click();

      expect(await getProperty(video, 'muted')).toBeFalsy();

      await muteBtn.click();

      expect(await getProperty(video, 'muted')).toBeTruthy();

      await muteBtn.click();

      expect(await getProperty(video, 'muted')).toBeFalsy();
    },
  );

  it(
    'autoplay',
    async () => {
      expect(await getProperty(video, 'paused')).toBeFalsy();
      expect(await isVisible(playBtn)).toBeFalsy();
      expect(await isVisible(replayBtn)).toBeFalsy();
    },
  );

  it(
    'play/pause',
    async () => {
      // pause
      const pause = async () => {
        await video.click();

        expect(await getProperty(video, 'paused')).toBeTruthy();

        expect(await isVisible(playBtn)).toBeTruthy();
      };

      await pause();

      // play
      await playBtn.click();

      expect(await isVisible(playBtn)).toBeFalsy();

      expect(await getProperty(video, 'paused')).toBeFalsy();

      // pause again
      await pause();
    },
  );

  it(
    'replay and progressBar',
    async () => {
      await video.click();

      expect(await isVisible(replayBtn)).toBeFalsy();

      // ended
      const playerEndedFlag = 'playerEnded';
      await appointFlagToEvent(playerEndedFlag, 'ended', video);

      await page.evaluate((videoElem) => {
        // eslint-disable-next-line no-param-reassign
        videoElem.currentTime = videoElem.duration;
      }, video);

      await page.waitForFunction(`window.${playerEndedFlag}`);

      expect(await getProperty(video, 'ended')).toBeTruthy();

      expect(await isVisible(playBtn)).toBeFalsy();

      expect(await isVisible(replayBtn)).toBeTruthy();

      expect(await getComputedWidth(progressBar))
        .toBe(await getComputedWidth(video));

      // replay
      const playerPlayedFlag = 'playerPlayed';
      await appointFlagToEvent(playerPlayedFlag, 'timeupdate');

      await replayBtn.click();

      await page.waitForFunction(`window.${playerPlayedFlag}`);

      expect(await getProperty(video, 'paused')).toBeFalsy();

      expect(await getComputedWidth(progressBar))
        .not.toBe(await getComputedWidth(video));
    },
  );

  afterAll(() => {
    browser.close();
  });
});
