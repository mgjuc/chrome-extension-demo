//chrome Api：runtime.onInstalled 脚本安装完毕
chrome.runtime.onInstalled.addListener(() =>{
    console.log("安装完毕");
    //badge是工具栏上的角表
    chrome.action.setBadgeText({
        text:"OFF",
    });
});


const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

//action.onClicked 工具栏图标点击事件
chrome.action.onClicked.addListener(async (tab) => { //需要activeTab权限获取当前的tab信息
    console.log("点击");
    if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    //处理css
    if (nextState === "ON") {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
          files: ["focus-mode.css"],
          target: { tabId: tab.id },
        });
      } else if (nextState === "OFF") {
        // Remove the CSS file when the user turns the extension off
        await chrome.scripting.removeCSS({
          files: ["focus-mode.css"],
          target: { tabId: tab.id },
        });
      }
    }
});