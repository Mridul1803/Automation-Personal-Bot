require("chromedriver");

let wd = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");

//building a browser
let browser = new wd.Builder().forBrowser('chrome').build();
let matchid = 30880;
let innings = 1;

let batsmenColumns = ["matches", "innings", "notOut", "runs", "highestScore", "average", "ballsPlayed", "strikeRate", "hundreds", "twoHundreds", "Fifties", "Fours", "Sixes"];
let bowlerColumns = ["matches", "innings", "balls", "runs", "wickets", "bestBowlingInInnings", "bestBowlingInMatch", "economy", "bowlingAverage", "bowlingStrikeRate", "fiveWicketsInning", "tenWicketsMatch"];
let inningsBatsmen=[];
let inningsBowler = [];
let careerData = [];
let fs = require('fs');

async function main()
{
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchid}`);
    await browser.wait(wd.until.elementLocated( wd.By.css(".cb-nav-bar a") ));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a") );
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));

    let batsmenRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms") );
    
    for( let i=0; i<(batsmenRows.length); ++i)
    {
        let columns = await batsmenRows[i].findElements( wd.By.css("div") );
        if(columns.length==7)
        {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute('innerText');
            
            careerData.push( {"playerName" : playerName} );
            inningsBatsmen.push(url);
        }
    }
    // console.log(BatsmenData);
    let bowlerRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms") );    
    for( let i=0; i<bowlerRows.length; ++i)
    {
        let columns = await bowlerRows[i].findElements( wd.By.css("div") );
        if(columns.length==8)
        {
            let url = await columns[0].findElement(wd.By.css("a")).getAttribute("href");
            let playerName = await columns[0].getAttribute('innerText');
            
            careerData.push( {"playerName" : playerName} );
            inningsBowler.push(url);
        }
    }
    // console.log(BowlersData);

    let finalUrls = inningsBatsmen.concat(inningsBowler);
    
    for( i in finalUrls )
    {
        await browser.get(finalUrls[i]);
        await browser.wait( wd.until.elementLocated(wd.By.css("table") ) );
        let tables = await browser.findElements(wd.By.css("table") );
        // console.log(tables);
        for(j in tables)
        {
            let data = {};
            let rows = await tables[j].findElements(wd.By.css("tbody tr"));
            for(row of rows)
            {
                let tempData = {};
                let columns = await row.findElements( wd.By.css("td") );
                let matchType = await columns[0].getAttribute("innerText");
                let keyArr = batsmenColumns;
                if(j==1)
                {
                    keyArr = bowlerColumns;
                }
                for( let k=1; k<columns.length; ++k )
                {
                    tempData[keyArr[k-1]] = await columns[k].getAttribute("innerText");
                }
                data[matchType] = tempData;
            }

            if(j==0)
            {
                careerData[i]["battingCareer"] = data;
            }
            else
            {
                careerData[i]["bowlingCareer"] = data;
            }
        }
    }
    fs.writeFileSync( "career.json", JSON.stringify(careerData) );
}

main();
