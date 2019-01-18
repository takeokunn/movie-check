const fs = require('fs')
const puppeteer = require('puppeteer');

const video = require('./video.json');

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const pc = {
    'name': 'Chrome Mac',
    'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'viewport': {
        'width': 1200,
        'height': 800,
        'deviceScaleFactor': 1,
        'isMobile': false,
        'hasTouch': false,
        'isLandscape': false
    }
};

const play_video = async (browser, video_id) => {
    const url = `https://www.youtube.com/watch?v=${video_id}`;

    const page = await browser.newPage();
    await page.emulate(pc);
    await page.goto(url, { waitUntil: 'networkidle2' });

    await sleep(3000);

    try {
        // open menu
        await page.waitForSelector('#menu > .ytd-video-primary-info-renderer > #button > #button > .style-scope')
        await page.click('#menu > .ytd-video-primary-info-renderer > #button > #button > .style-scope')

        // open transcript
        await page.waitForSelector('#contentWrapper > .dropdown-content > #items > .style-scope:nth-child(2)')
        await page.click('#contentWrapper > .dropdown-content > #items > .style-scope:nth-child(2)')

        // change language
        await page.waitForSelector('#contentWrapper > #trigger')
        await page.click('#contentWrapper > #trigger')

        // get transcript
        await page.waitForSelector('.ytd-transcript-body-renderer')

        const transcript = await page.evaluate(() => document.querySelector('#body .ytd-transcript-renderer').innerText);
        console.log(transcript);
    } catch (e) {
        console.log(e);
        console.log("error: " + video_id);
    }
};

const main = async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 100, args: ['--lang=ja,en-US,en'] });
    await video.ids.map(id => play_video(browser, id));
    await browser.close();
}

main();
