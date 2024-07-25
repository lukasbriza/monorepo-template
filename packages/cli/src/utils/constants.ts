import path from 'node:path'

import { PROJECT_TYPE, type Options } from '../types'

export const APPS_PATH = path.normalize(`${__dirname}/../../../../apps`)
export const PACKAGES_PATH = path.normalize(`${__dirname}/../../../../packages`)
export const STORYBOOK_PATH = path.resolve(`${APPS_PATH}/storybook`)

export const OPTIONS: Options = [
  ['NextJS', PROJECT_TYPE.APP],
  ['Storybook', PROJECT_TYPE.APP],
]

export const DEFAULT_OPTION_INDEX = 0

export const getNextTemplateTurboCommand = (projectName: string) =>
  `pnpm turbo gen workspace -n ${projectName} -t app -d apps/${projectName} -c https://github.com/lukasbriza/next-template/tree/master `
