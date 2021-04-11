const pup = require("puppeteer");

let id = 'sahilsharmaa279';
let pass = 'Sahil@279';

let mail = {
    "email" : 'jainmridul2000@gmail.com',
    "subject" : 'AUTOMATION TESTING',
    "content" : 'Hey, How are you doing? This is an automated email sent using Puppeteer.'
}

let task = process.argv[2];
async function main()
{
    let browser = await pup.launch( {
        headless : false,
        defaultViewport : false,
        args: ["--start-maximized"]
    } );

    if( task =='play' )
    {
        await playMusic(browser);
    }
    else if( task == 'email' )
    {
        await email(browser);
    }

}




async function email( browser)
{
    let pages = await browser.pages();
    let tab = pages[0];

    await tab.goto("https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
    
    await tab.waitForSelector( "input[type = 'email']" );
    await tab.type( "input[type = 'email']", id );
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");

    await tab.waitForSelector('input[type="password"]', {visible: true});

    await tab.type('input[type="password"]', pass);

    await tab.waitForSelector("#passwordNext", { visible: true });
    await tab.click('#passwordNext');

    await tab.waitForSelector( ".T-I.T-I-KE.L3" );
    await tab.click(".T-I.T-I-KE.L3");

    await new Promise(resolve => setTimeout(resolve, 1000));

    await tab.waitForSelector("textarea[name= 'to']");
    await tab.type( "textarea[name= 'to']", mail['email'] );
    await tab.type( "input[name= 'subjectbox']", mail['subject'] );


    // let contentBox = await tab.$( "div[role= 'textbox']");

    await tab.evaluate((content) => {
        document.querySelector("div[role= 'textbox']").innerText = content;
    }, mail['content']);

    // await setTimeout( function(){ }, 2000 );
    await new Promise(resolve => setTimeout(resolve, 2000));

    await tab.click(".T-I.J-J5-Ji.aoO.v7.T-I-atl.L3");
    await new Promise(resolve => setTimeout(resolve, 3000));

    await tab.waitForSelector(".TN.bzz.aHS-bnu a");
    await tab.click(".TN.bzz.aHS-bnu a");

    await tab.waitForSelector(".T-I.J-J5-Ji.nu.T-I-ax7.L3");
    await tab.click(".T-I.J-J5-Ji.nu.T-I-ax7.L3");

    await tab.waitForNavigation( {waitUntil: 'networkidle2'} );

    await tab.waitForSelector(".ae4.UI.nH.oy8Mbf tr");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    let sentMails = await tab.$$(".ae4.UI.nH.oy8Mbf tr");
    await sentMails[0].click();
    // console.log(sentMails.length);

    await browser.close();

}

async function playMusic( browser)
{
    let pages = await browser.pages();
    let tab = pages[0];

    let name = process.argv.slice(3, process.argv.length);
    let song = "";
    for(let i of name)
    {
        song += i + " ";
    }

    await tab.goto("https://www.youtube.com/");

    await tab.waitForSelector( ".style-scope.ytd-masthead.style-suggestive.size-small" );
    await tab.click( ".style-scope.ytd-masthead.style-suggestive.size-small" );

    await tab.waitForSelector( ".rFrNMe.N3Hzgf.jjwyfe.QBQrY.zKHdkd.sdJrJc.Tyc9J input" );
    await tab.type( ".rFrNMe.N3Hzgf.jjwyfe.QBQrY.zKHdkd.sdJrJc.Tyc9J input", id );
    await tab.click(".VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc.lw1w4b");

    await tab.waitForSelector('input[type="password"]', {visible: true});

//  TODO : change to your password
    await tab.type('input[type="password"]', pass);

    await tab.waitForSelector("#passwordNext", { visible: true });
    await tab.click('#passwordNext');

    await tab.waitForSelector( "#search-input input" );
    await tab.type( "#search-input input", song );
    await tab.click("#search-icon-legacy");

    await tab.waitForSelector(".title-and-badge.style-scope.ytd-video-renderer a");
    let titles = await tab.$$(".title-and-badge.style-scope.ytd-video-renderer a");
    // console.log( titles.length );
    await titles[0].click();

    await new Promise(resolve => setTimeout(resolve, 9000));    

    let button = await tab.$$( ".top-level-buttons.style-scope.ytd-menu-renderer ytd-toggle-button-renderer" );
    await button[0].click();

    await new Promise(resolve => setTimeout(resolve, 6000));


    // await tab.evaluate( (comment)=>{
    //     document.querySelector("#labelAndInputContainer #contenteditable-root").innerText = comment;
    // }, comment )
    
    // await tab.click( ".style-scope.ytd-commentbox.style-primary.size-default" );

    await browser.close();
}
main()
