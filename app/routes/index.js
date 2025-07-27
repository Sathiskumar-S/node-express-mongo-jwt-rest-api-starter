import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { removeExtensionFromFile } from '../middleware/utils/index.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routesPath = `${__dirname}/`

/*
 * Load routes statically and/or dynamically
 */

// Load Auth route
import authRoutes from './auth.js'
router.use('/', authRoutes)

// Loop routes path and load every file as a route except this file and auth route
const files = fs.readdirSync(routesPath)

for (const file of files) {
  const routeFile = removeExtensionFromFile(file)

  if (
    routeFile !== 'index' &&
    routeFile !== 'auth' &&
    file !== '.DS_Store' &&
    file.endsWith('.js')
  ) {
    const module = await import(`./${file}`)

    // Ensure it's a valid router before registering
    if (module?.default && typeof module.default === 'function') {
      router.use(`/${routeFile}`, module.default)
    } else {
      console.warn(`⚠️ Skipping ${file} - default export is not a valid Express router`)
    }
  }
}


/*
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.render('index')
})

/*
 * Handle 404 error
 */
router.use((req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

export default router
