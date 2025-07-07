/* eslint-disable no-console */
import { cpSync } from 'node:fs'

import chalk from 'chalk'
import ora from 'ora'
import readlineSync from 'readline-sync'

import { DOCKER_PATH, PACKAGES_PATH, SETTINGS_OPTIONS, TEMP_PATH } from '../constants.js'
import { cleanTemporaryFolder, downloadMonorepoTemplate } from '../utils/index.js'

const updateDockerFiles = async () => {
  console.clear()
  const downloadSpinner = ora().start('Downloading monorepo...')
  cleanTemporaryFolder()
  downloadMonorepoTemplate()

  const updateSpinner = downloadSpinner.succeed('Monorepo downloaded...').start('Updating docker folder...')
  cpSync(`${TEMP_PATH}/monorepo-template/docker`, DOCKER_PATH, { recursive: true, force: true })

  const cleanSpinner = updateSpinner.succeed('Docker folder updated...').start('Cleaning temporary folder...')
  cleanTemporaryFolder()
  cleanSpinner.succeed('Temporary folder cleaned...')

  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  console.clear()
}

const updateCli = async () => {
  console.clear()
  const downloadSpinner = ora().start('Downloading monorepo...\n')
  cleanTemporaryFolder()
  downloadMonorepoTemplate()
  downloadSpinner.succeed('Monorepo downloaded...\n')

  const copyOptions = { recursive: true, force: true }

  const updateSpinner = ora().start('Updating CLI package folder...')
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/src`, `${PACKAGES_PATH}/cli/src`, copyOptions)
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/files`, `${PACKAGES_PATH}/cli/src/files`, copyOptions)
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/.eslintignore`, `${PACKAGES_PATH}/cli/.eslintignore`, copyOptions)
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/.eslintrc.cjs`, `${PACKAGES_PATH}/cli/.eslintrc.cjs`, copyOptions)
  cpSync(
    `${TEMP_PATH}/monorepo-template/packages/cli/.prettierignore`,
    `${PACKAGES_PATH}/cli/.prettierignore`,
    copyOptions,
  )
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/package.json`, `${PACKAGES_PATH}/cli/package.json`, copyOptions)
  cpSync(
    `${TEMP_PATH}/monorepo-template/packages/cli/tsconfig.build.json`,
    `${PACKAGES_PATH}/cli/tsconfig.build.json`,
    copyOptions,
  )
  cpSync(
    `${TEMP_PATH}/monorepo-template/packages/cli/tsconfig.build.json`,
    `${PACKAGES_PATH}/cli/tsconfig.build.json`,
    copyOptions,
  )
  cpSync(`${TEMP_PATH}/monorepo-template/packages/cli/tsconfig.json`, `${PACKAGES_PATH}/cli/tsconfig.json`, copyOptions)
  updateSpinner.succeed('CLI folder updated...\n')

  const cleanSpinner = ora().start('Cleaning temporary folder...\n')
  cleanTemporaryFolder()
  cleanTemporaryFolder()
  cleanSpinner.succeed('Temporary folder cleaned...\n')

  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })

  console.clear()
  console.log(chalk.red('It is recommended to freshly build CLI tool and re-run.'))
}

export const settings = async () => {
  console.log(chalk.green('\nSettings:\n'))
  const option = readlineSync.keyInSelect(SETTINGS_OPTIONS, 'Choose option', {
    defaultInput: '0',
    cancel: 'Cancel',
  })

  // Reset flow to crossroad.
  if (option === -1) {
    return {
      stop: false,
      option,
    }
  }

  // CLI update.
  if (option === 0) {
    await updateCli()
    return {
      stop: true,
      option,
    }
  }

  // DOcker files update.
  if (option === 1) {
    await updateDockerFiles()
    return {
      stop: false,
      option,
    }
  }

  return {
    stop: true,
  }
}
