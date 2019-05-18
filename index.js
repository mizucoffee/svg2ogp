const express = require("express")
const puppeteer = require('puppeteer')
const path = require('path')
const bodyParser = require('body-parser')
const uniq = require('uniqid')
const fs = require('fs')
const app = express()

const server = app.listen(process.env.PORT || 3000, () => console.log(server.address().port))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'))

app.post('/', async (req, res) => {
  const browser = await puppeteer.launch({args: ['--headless', '--no-sandbox']})
  const page = await browser.newPage()

  const id = uniq()
  await fs.writeFileSync(`./public/${id}.html`, `<html lang="ja"><head><meta charset="utf-8"></head><body style="margin:0;">${req.body.data}</body></html>`)

  await page.goto(`http://localhost:${process.env.PORT || 3000}/${id}.html`)
  await page.evaluateHandle('document.fonts.ready')

  await page.screenshot({ clip:{x:0, y:0, width: 1200, height: 630}, path: `./${'test'}.png` })
  fs.unlinkSync(`./public/${id}.html`)
  browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.sendFile(path.join(__dirname, 'test.png'))
})
