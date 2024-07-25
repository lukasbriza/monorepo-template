import { copyFileSync } from 'node:fs'

import {
  babelConfigPath,
  eslintIgnorePath,
  eslintrcPath,
  gitIgnorePath,
  lintStagetConfigPath,
  packagePath,
  prettierIgnorePath,
  servePath,
  storybookMainPath,
  storybookManangerPath,
  storybookPreviewPath,
  storybookThemePath,
  tsConfigPath,
  viteConfigPath,
} from '../paths/storybook-paths'
import { PROJECT_TYPE } from '../types'

import { cleanup } from './cleanup'
import { APPS_PATH, STORYBOOK_PATH } from './constants'
import { createDirectory } from './create-directory'
import { addConfigs, installDeps } from './pnpm-commands'

export const createStorybook = async () => {
  const { default: ora } = await import('ora')
  const projectName = 'storybook'
  const storybookPath = `${APPS_PATH}/${projectName}`

  const makeDirectorySpinner = ora('Create storybook directory...').start()

  try {
    createDirectory(storybookPath)
    makeDirectorySpinner.succeed()
  } catch {
    makeDirectorySpinner.fail()
    cleanup(projectName, PROJECT_TYPE.APP)
    return
  }

  const copyStorybookFilesSpinner = ora('Copy storybook files...').start()
  try {
    createDirectory(`${storybookPath}/config`)
    copyFileSync(storybookMainPath, `${storybookPath}/config/main.ts`)
    copyFileSync(storybookManangerPath, `${storybookPath}/config/manager.ts`)
    copyFileSync(storybookPreviewPath, `${storybookPath}/config/preview.tsx`)
    copyFileSync(storybookThemePath, `${storybookPath}/config/theme.ts`)

    copyFileSync(packagePath, `${STORYBOOK_PATH}/package.json`)
    copyFileSync(eslintIgnorePath, `${STORYBOOK_PATH}/.eslintignore`)
    copyFileSync(eslintrcPath, `${STORYBOOK_PATH}/.eslintrc.cjs`)
    copyFileSync(gitIgnorePath, `${STORYBOOK_PATH}/.gitignore`)
    copyFileSync(prettierIgnorePath, `${STORYBOOK_PATH}/.prettierignore`)
    copyFileSync(babelConfigPath, `${STORYBOOK_PATH}/babel.config.js`)
    copyFileSync(lintStagetConfigPath, `${STORYBOOK_PATH}/lint-staged.config.js`)
    copyFileSync(servePath, `${STORYBOOK_PATH}/serve.json`)
    copyFileSync(tsConfigPath, `${STORYBOOK_PATH}/tsconfig.json`)
    copyFileSync(viteConfigPath, `${STORYBOOK_PATH}/vite.config.ts`)
    copyStorybookFilesSpinner.succeed()
  } catch {
    copyStorybookFilesSpinner.fail()
    cleanup(projectName, PROJECT_TYPE.APP)
    return
  }

  const addConfigsSpinner = ora('Add configs...').start()
  try {
    addConfigs('storybook')
    addConfigsSpinner.succeed()
  } catch {
    cleanup('storybook', PROJECT_TYPE.APP)
    addConfigsSpinner.fail()
    return
  }

  const installDepsSpinner = ora('Install dependencies...').start()
  try {
    installDeps()
    installDepsSpinner.succeed()
  } catch {
    cleanup('storybook', PROJECT_TYPE.APP)
    installDepsSpinner.fail()
  }
}
