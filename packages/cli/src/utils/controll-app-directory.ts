import { existsSync } from 'node:fs'

import { PROJECT_TYPE, type Option } from '../types.js'

import { APPS_PATH } from './constants.js'
import { createDirectory } from './create-directory.js'

export const controlAppDirectory = (option: Option) => {
  if (option[1] === PROJECT_TYPE.APP) {
    const hasAppDirectory = existsSync(`${APPS_PATH}`)

    if (!hasAppDirectory) {
      createDirectory(`${APPS_PATH}`)
    }
  }
}
