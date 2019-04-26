import puppeteer from 'puppeteer';

import { JestEnvironment } from '@jest/environment';
import { namespace } from '../src/constants';

const pathToChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const url = 'http://localhost:8080/';
// const headless = true;
const headless = false;
const slowMo = headless ? 0 : 100;
const timeout = 30000;

let page;
let browser;

let video;

const videoSelector = 'video';
const muteBtnSelector = `.${namespace}__muteBtn`;
const playBtnSelector = `.${namespace}__playBtn`;
const replayBtnSelector = `.${namespace}__replayBtn`;

// const width = 1920;
// const height = 1080;

const getProperty = async (element, property) => {
  const value = await (await element.getProperty(property)).jsonValue();
  return value;
};

const getComputedStyleProperty = async (selector, property) => {
  // property must be named in js style: not class but className etc.
  const value = await page.$eval(selector, (el, prop) => getComputedStyle(el)[prop], property);
  return value;
};

const getDisplayStyleProperty = async selector => getComputedStyleProperty(selector, 'display');

describe('E2E browser testing', () => {
  beforeAll(async () => {
    // jest.setTimeout(timeout);
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

    video = await page.$('video');
  });

  it(
    'mute',
    async () => {
      const muted1 = await getProperty(video, 'muted');
      expect(muted1).toBeFalsy();

      const muteBtn = await page.$(muteBtnSelector);
      await muteBtn.click();


      const muted2 = await getProperty(video, 'muted');
      expect(muted2).toBeTruthy();

      await muteBtn.click();

      const muted3 = await getProperty(video, 'muted');
      expect(muted3).toBeFalsy();
    },
    timeout,
  );

  it(
    'autoplay',
    async () => {
      const paused = await getProperty(video, 'paused');
      expect(paused).toBeFalsy();


      const display1 = await getDisplayStyleProperty(playBtnSelector);
      expect(display1).toBe('none');

      const display2 = await getDisplayStyleProperty(replayBtnSelector);
      expect(display2).toBe('none');
    },
    timeout,
  );

  it(
    'play/pause',
    async () => {
      // pause
      const pause = async () => {
        await video.click();

        const paused = await getProperty(video, 'paused');
        expect(paused).toBeTruthy();

        const display = await getDisplayStyleProperty(playBtnSelector);
        expect(display).not.toBe('none');
      };

      await pause();

      // play
      const playBtn = await page.$(playBtnSelector);
      await playBtn.click();

      const display = await getDisplayStyleProperty(playBtnSelector);
      expect(display).toBe('none');

      const paused = await getProperty(video, 'paused');
      expect(paused).toBeFalsy();

      // pause again
      await pause();
    },
    timeout,
  );

  it.skip(
    'replay',
    async () => {
      // pause

      const playBtn = await page.$(playBtnSelector);
      await playBtn.click();

      const display = await getDisplayStyleProperty(playBtnSelector);
      expect(display).toBe('none');

      const paused = await getProperty(video, 'paused');
      expect(paused).toBeFalsy();

      // pause again
      await pause();
    },
    timeout,
  );

  // await page.waitFor(3000);

  afterAll(() => {
    browser.close();
  });
});
