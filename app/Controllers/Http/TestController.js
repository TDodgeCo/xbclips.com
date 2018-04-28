'use strict'
const Env = use('Env')
const Redis = use('Redis')

class TestController {

  async index () {
    var testString = 'Connection from Adonis'
    await Redis.set('test', testString)
    return test
  }
}

module.exports = TestController
