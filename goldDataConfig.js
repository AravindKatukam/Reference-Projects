const puppeteer = require ('puppeteer')
const fs = require ('fs')

async function start(){
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.goto("https://www.bullion-rates.com/gold/inr/2022-1-history.html", {waitUntil:'networkidle0'})

    const grabData = await page.evaluate(()=>{
        const goldData = document.querySelectorAll(".DataRow")
        const data =[]
        for(let i =0 ; i<goldData.length;i++){
            data_items={}
            data_items['date'] = goldData[i].firstElementChild.innerText
            data_items['priceInOz'] = goldData[i].children[1].innerText
            data_items['priceInGrams']= goldData[i].lastElementChild.innerText
            data.push(data_items)
        }

        return data
    })

    fs.writeFile('goldData.json', JSON.stringify(grabData,null,2), (err)=>{
        try{
            if(err){
                console.error(err)
                return
            }
            console.log('success')
        }
        catch(ex){
            console.error(ex)
        }
    })
    await browser.close()
}
start()