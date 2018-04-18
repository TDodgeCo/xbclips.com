'use strict'

const Schema = use('Schema')

class ClipSchema extends Schema {
  up () {
    this.create('clips', (table) => {
      table.increments()
      table.integer('xuid', 16).notNullable()
      table.string('uri').unique()
      table.string('thumbnailSmall').unique()
      table.string('thumbnailLarge').unique()
      table.integer('titleId')
      table.string('titleName')
      table.string('storageLocation')
      table.timestamps()
    })
  }

  down () {
    this.drop('clips')
  }
}

module.exports = ClipSchema
