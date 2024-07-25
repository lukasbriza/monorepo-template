import { rmSync } from 'node:fs'

import { PROJECT_TYPE } from '../types'

import { APPS_PATH, PACKAGES_PATH } from './constants'

export const cleanup = (projectName: string, type: PROJECT_TYPE) => {
  console.log('Starting cleanup...')
  const path = `${type === PROJECT_TYPE.APP ? APPS_PATH : PACKAGES_PATH}/${projectName}`
  rmSync(path, { recursive: true, force: true })
  console.log('Cleanup sucessfull.')
}
