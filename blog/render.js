/**
 * Render module
 */

/**
 * Module dependencies
 * 
 * swig-templates
 */
const views = require('koa-views')
const path = require('path')

module.exports = views(
  path.join(__dirname, 'views'), {
    map: { html: 'swig' }
  }
)