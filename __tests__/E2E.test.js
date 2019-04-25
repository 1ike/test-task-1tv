import puppeteer from 'puppeteer';

import { namespace } from '../src/constants';

const pathToChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const url = 'http://localhost:8080/';
// const headless = true;
const headless = false;
const slowMo = headless ? 0 : 100;
const timeout = headless ? 27000 : 10000;

let page;
let browser;

let video;

const videoSelector = 'video';
const muteBtnSelector = `.${namespace}__muteBtn`;
const playBtnSelector = `.${namespace}__playBtn`;
// const replayBtnSelector = `${namespace}__replayBtn`;

// const width = 1920;
// const height = 1080;

const getProperty = async (element, property) => {
  const value = await (await element.getProperty(property)).jsonValue();
  return value;
};

describe('E2E browser testing', () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    browser = await puppeteer.launch({
      headless,
      slowMo,
      args: ['--no-sandbox'],
      // args: [`--window-size=${width},${height}`]
      executablePath: pathToChrome,
    });
    page = await browser.newPage();
    // await page.setViewport({ width, height });
    // await page.goto(url);

    // video = await page.$('video');
  });

  it(
    'mute',
    async () => {
      await page.goto(url);

      video = await page.$('video');

      const muted1 = await getProperty(video, 'muted');
      expect(muted1).toBeFalsy();

      await page.$eval(muteBtnSelector, (el) => {
        el.click();
      });

      const muted2 = await getProperty(video, 'muted');
      expect(muted2).toBeTruthy();

      await page.$eval(muteBtnSelector, (el) => {
        el.click();
      });

      const muted3 = await getProperty(video, 'muted');
      expect(muted3).toBeFalsy();
    },
    timeout,
  );

  it(
    'autoplay/play/pause',
    async () => {
      await page.goto(url);

      video = await page.$('video');

      const paused = await getProperty(video, 'paused');
      expect(paused).toBeTruthy();

      const display1 = await page.$eval(playBtnSelector, (el) => {
        const { display } = getComputedStyle(el);
        return display;
      });
      expect(display1).toBe('none');
      console.log('await getProperty :', await getProperty(await page.$(playBtnSelector), 'className'));

      await page.$eval(playBtnSelector, (el) => {
        el.click();
      });
      const display2 = await page.$eval(playBtnSelector, (el) => {
        const { display } = getComputedStyle(el);
        return display;
      });
      console.log('await getProperty :', await getProperty(await page.$(playBtnSelector), 'className'));
      expect(display2).not.toBe('none');
      const paused2 = await getProperty(video, 'paused');
      expect(paused2).toBeFalsy();

      await video.click();

      const paused3 = await getProperty(video, 'paused');
      expect(paused3).toBeTruthy();


      // const playBtn = await page.$(playBtnSelector);
      // expect(getComputedStyle(playBtn).display).not.toBe('none');
      // expect(video.paused).toBeTruthy();

      // playBtn.click();
      // expect(getComputedStyle(playBtn).display).toBe('none');
      // expect(video.paused).toBeFalsy();

      // video.click();
      // expect(getComputedStyle(playBtn).display).not.toBe('none');
      // expect(video.paused).toBeTruthy();
    },
    timeout,
  );

  afterAll(() => {
    // browser.close();
  });
});
