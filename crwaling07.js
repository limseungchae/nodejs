// 셀레니엄을 이용해서 네이버 받은 메일수 조회 후 출력\

const { Builder, Browser, By, Key, until, Select } = require('selenium-webdriver')
const ncp = require('copy-paste');

async function main() {
    const URL = 'http://www.naver.com';
    const chrome = await new Builder().forBrowser(Browser.CHROME)
        .build();

    try {
        // 사이트 접속
        await chrome.get(URL);

        // 로그인 버튼이 제대로 나타날때까지 최대 5초까지 대기
        await chrome.wait(until.elementLocated(
            By.css('.link_login')), 5000);

        // 로그인 버튼 클릭
        let loginbtn = await chrome.findElement(
                By.css('.link_login'));
        await chrome.actions().move({origin: loginbtn})
            .click().perform();

        await sleep(1000);   // 1초동안 잠시 대기

        // ---------------------------
        await chrome.wait(until.elementLocated(
            By.css('.btn_login')), 5000);

        const uid = await chrome.findElement(By.css('#id'));
        const pwd = await chrome.findElement(By.css('#pw'));
        loginbtn = await chrome.findElement(By.css('.btn_login'));

        // 네이버에서는 이러한 행위를 봇으로 인식 -> 2차 인증 필요
        // // 아이디를 uid 객체에 입력
        // await chrome.actions().sendKeys(uid, 'zzyzigy').perform();
        // await sleep(1000);
        //
        // // 비밀번호를 pwd 객체에 입력
        // await chrome.actions().sendKeys(pwd, 'zzyzigy').perform();
        // await sleep(1000);

        // 아이디/비밀번호를 클립보드로 복사/붙여넣기 후 로그인 시도
        // 클립보드 복사 모듈 - copy-paste

        ncp.copy('zzyzigy');
        await chrome.actions().click(uid)
            .keyDown(Key.CONTROL).sendKeys('v').perform();
        await sleep(1000);

        ncp.copy('zzyzigy');
        await chrome.actions().click(pwd)
            .keyDown(Key.CONTROL).sendKeys('v').perform();
        await sleep(1000);


        // 로그인 버튼 클릭
        await chrome.actions().move({origin: loginbtn})
            .click().perform();

        await sleep(1000);

    } catch (ex) {
        console.log(ex);
    } finally {
        await chrome.sleep(3000);
        await chrome.quit();
    }
};

// 일정시간 셀레니엄이 대기하도록 만드는 함수
const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve,ms));

main();