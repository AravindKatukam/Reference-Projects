const puppeteer = require ('puppeteer')
const fs = require('fs')


async function start(){
    try{
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.goto("https://en.wikipedia.org/wiki/Cricket_World_Cup",{waitUntil:'networkidle2'})
    const selector = "//html/body/div[3]/div[3]/div[5]/div[1]/table[3]/tbody"
    await page.waitForXPath(selector)

    const grabData = await page.evaluate(()=>{
        const result = document.querySelectorAll(".mw-parser-output > table:nth-of-type(3) > tbody > tr")

        const data = []
        for(let i=0; i<result.length; i++){
            data_items={}
            if(result[i].children[0].children[0].innerText < 2023){
                data_items['year'] = result[i].children[0].children[0].innerText
                data_items['winner'] = result[i].children[3].children[1].innerText
                data_items['runner'] = result[i].children[5].children[1].innerText
            data.push(data_items)
            }
        }

        return data
    })
    
    //console.log(grabData)
    fs.writeFile('cricketData.json',JSON.stringify(grabData,null,2),(err)=>{
        if(err){
            console.error(err)
            return
        }
        console.log('success')
    })
    
   await browser.close()
}
catch(ex){
    console.error(ex)
}
}
start()