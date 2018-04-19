'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.on('/').render('home')

Route.post('/clips', 'ClipController.index')

Route.get('/clips/:gtag/:clipid', 'ClipController.store')

Route.get('/:gtag', 'GamertagController.index')

Route.post('/slack', 'SlackController.index')
