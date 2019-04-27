import puppeteer from 'puppeteer';

import { namespace } from '../src/constants';

const pathToChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const url = 'http://localhost:8080/';
// const headless = true;
const headless = false;
const slowMo = headless ? 100 : 100;
const timeout = 30000;

let page;
let browser;

let video;
let playBtn;
let replayBtn;
let progressBar;

const videoSelector = 'video';
const muteBtnSelector = `.${namespace}__muteBtn`;
const playBtnSelector = `.${namespace}__playBtn`;
const replayBtnSelector = `.${namespace}__replayBtn`;
const progressBarSelector = `.${namespace}__progressBar`;

// const width = 1920;
// const height = 1080;


const getProperty = async (element, property) => {
  const value = await (await element.getProperty(property)).jsonValue();
  return value;
};

const getComputedStyleProperty = async (element, property) => {
  // property must be named in js style: not class but className etc.
  const value = await page.evaluateHandle((el, prop) => getComputedStyle(el)[prop], element, property);
  return value.jsonValue();
};

const getComputedWidth = async (element) => {
  const value = await getComputedStyleProperty(element, 'width');
  return value;
};

const isVisible = async element => (await element.boxModel() !== null);


describe('E2E browser testing', () => {
  beforeAll(async () => {
    jest.setTimeout(timeout);
    browser = await puppeteer.launch({
      headless,
      slowMo,
      args: ['--no-sandbox'],
      // args: [`--window-size=${width},${height}`]
      executablePath: pathToChrome,
    });
    page = await browser.newPage();
    // await page.setViewport({ width, height });

    await page.goto(url);

    video = await page.$(videoSelector);
    playBtn = await page.$(playBtnSelector);
    replayBtn = await page.$(replayBtnSelector);
    progressBar = await page.$(progressBarSelector);

    await page.waitForFunction(`document.querySelector("${videoSelector}").readyState >= 2`);
  });

  it(
    'mute',
    async () => {
      expect(await getProperty(video, 'muted')).toBeFalsy();

      const muteBtn = await page.$(muteBtnSelector);
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
      await page.evaluate((videoElem) => {
        videoElem.addEventListener('ended', () => { window.playerEnded = true; });
        // eslint-disable-next-line no-param-reassign
        videoElem.currentTime = videoElem.duration;
      }, video);

      await page.waitForFunction('window.playerEnded');
      expect(await getProperty(video, 'ended')).toBeTruthy();

      expect(await isVisible(playBtn)).toBeFalsy();

      expect(await isVisible(replayBtn)).toBeTruthy();

      expect(await getComputedWidth(progressBar))
        .toBe(await getComputedWidth(video));

      // replay
      await replayBtn.click();

      expect(await getProperty(video, 'paused')).toBeFalsy();
      expect(await getComputedWidth(progressBar))
        .not.toBe(await getComputedWidth(video));
    },
  );

  // await page.waitFor(3000);

  afterAll(() => {
    browser.close();
  });
});