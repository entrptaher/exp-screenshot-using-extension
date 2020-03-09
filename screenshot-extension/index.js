const path = require("path");

const screenshotExtArgs = (puppeteer) => {
  /**
   * Remove default arguments and apply new arguments
   */
  const extension = path.resolve(__dirname + "/extension");
  const extensionName = require("./extension/manifest.json").name;
  const args = puppeteer
    .defaultArgs()
    .filter(e => !["--disable-extensions", "--headless"].includes(e));
  const newArgs = [...args, `--load-extension=${extension}`];

  /**
   * Save Image to Disk
   */
  const saveImage = (inputData, outPath) => {
    var base64Data = inputData.replace(/^data:image\/jpeg;base64,/, "");
    return require("fs").writeFileSync(outPath, base64Data, "base64");
  };

  /**
   * Capture screenshot using the background page
   */
  const capturePage = async (browser, page) => {
    const targets = await browser.targets();
    const extensionTarget = await targets
      .find(e => e._targetInfo.title.includes(extensionName)) // find our extension background page with this hack
      .page();
    const pageUrl = await page.url();
    const result = await extensionTarget.evaluate(
      pageUrl => captureActiveTab(pageUrl),
      pageUrl
    );
    return result;
  };
  return {
    saveImage,
    capturePage,
    args: newArgs
  };
};

module.exports = screenshotExtArgs;
