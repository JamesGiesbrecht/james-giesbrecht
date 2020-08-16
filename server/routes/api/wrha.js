/* eslint-disable security/detect-object-injection */
const express = require('express')

const { scrapeSite } = require('../../util/scraper')

const router = express.Router()

const hospitals = {
  grace: {
    url: 'grace-hospital',
    friendlyName: 'Grace Hospital',
  },
  hsc: {
    url: 'hsc-adult',
    friendlyName: 'Health Sciences Centre',
  },
  childrens: {
    url: 'hsc-childrens',
    friendlyName: 'Children\'s Hospital',
  },
  'st-boniface': {
    url: 'st-boniface-hospital',
    friendlyName: 'St. Boniface Hospital',
  },
  concordia: {
    url: 'concordia-hospital',
    friendlyName: 'Concordia Hospital',
  },
  'seven-oaks': {
    url: 'seven-oaks-general-hospital',
    friendlyName: 'Seven Oaks General Hospital',
  },
  victoria: {
    url: 'victoria-general-hospital',
    friendlyName: 'Victoria General Hospital',
  },
}

const getMessage = (waitTimes, hospitalName) => (
  `At ${hospitalName}, there are currently ${waitTimes.waiting} waiting, ${waitTimes.treating} treating, and an average wait time of ${waitTimes.wait_time} hours.`
)

const getWaitTimes = async (hospital) => {
  if (!hospitals[hospital]) {
    return { message: 'Error: Hospital not found' }
  }
  const siteUrl = `https://wrha.mb.ca/wait-times/${hospitals[hospital].url}`
  const $ = await scrapeSite(siteUrl)
  let waitTime = $('.table-wait-times-data[data-label="Wait Time"]').text()
  waitTime = waitTime.substring(0, waitTime.indexOf(' '))
  const waitTimes = {
    waiting: $('.table-wait-times-data[data-label="Waiting"]').text(),
    treating: $('.table-wait-times-data[data-label="Treating"]').text(),
    wait_time: waitTime,
  }
  const message = getMessage(waitTimes, hospitals[hospital].friendlyName)
  return {
    ...waitTimes,
    message,
  }
}

router.get('/:hospital', async (req, res) => {
  const waitTimes = await getWaitTimes(req.params.hospital)
  res.json(waitTimes)
})

module.exports = router
