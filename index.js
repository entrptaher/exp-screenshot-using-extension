const puppeteer = require("puppeteer");
const screenshotExtArgs = require("./screenshot-extension");

(async () => {
  // initialize right before launching the browser
  const { saveImage, capturePage, args } = screenshotExtArgs(puppeteer);

  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: true, // important for the extension to work
    args
  });
  const page = await browser.newPage();
  await page.goto("http://duckduckgo.com");
  
  // if you don't set viewport, it'll capture the empty spaces as well
  await page.setViewport({ width: 800, height: 600})

  // call it using same browser and page arguments
  const result = await capturePage(browser, page);
  // the output is data src in base64, sanitize and save the data if want
  await saveImage(result, 'screenshots/1-using-extenion.jpg');

  // default screenshot function from browser
  await page.screenshot({path: 'screenshots/2-using-page-screenshot.png'})
  await browser.close();
})();
