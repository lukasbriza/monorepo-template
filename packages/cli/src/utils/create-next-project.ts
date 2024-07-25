import { spawn } from 'node:child_process'
import { copyFileSync, unlinkSync } from 'node:fs'
import path from 'node:path'

import { eslintPath, tsConfigPath } from '../paths/nextjs-paths'
import { PROJECT_TYPE } from '../types'

import { cleanup } from './cleanup'
import { APPS_PATH, getNextTemplateTurboCommand } from './constants'
import { addConfigs, installDeps } from './pnpm-commands'

export const createNextProject = async (name: string) => {
  const { default: ora } = await import('ora')

  return new Promise((resolve, reject) => {
    const download = ora('Downloading NextJs template...').start()
    const command = getNextTemplateTurboCommand(name)
    const process = spawn(command, { shell: true, cwd: path.normalize(`${APPS_PATH}/../`) })

    process.stdout.on('data', (data) => {
      if (String(data).includes('Add workspace dependencies to')) {
        process.stdin.write('n\n')
      }
    })

    process.stderr.on('error', (error) => {
      download.fail('Downloading failed.')
      cleanup(name, PROJECT_TYPE.APP)
      reject(error)
    })

    process.on('exit', () => {
      download.succeed('Template downloaded.')
      const copyFiles = ora('Copy configuration files.')

      try {
        copyFiles.start()
        unlinkSync(`${APPS_PATH}/${name}/tsconfig.json`)
        copyFileSync(tsConfigPath, `${APPS_PATH}/${name}/tsconfig.json`)
        copyFileSync(eslintPath, `${APPS_PATH}/${name}/.eslintrc.cjs`)
        copyFiles.succeed('Files copied.')
      } catch (error) {
        console.log(error)
        copyFiles.fail()
        cleanup(name, PROJECT_TYPE.APP)
        reject(error)
        return
      }

      const depsAdding = ora('Installing dependencies.')

      try {
        depsAdding.start()
        addConfigs(name)
        installDeps()
        depsAdding.succeed('Dependencies added.')
      } catch (error) {
        depsAdding.fail()
        cleanup(name, PROJECT_TYPE.APP)
        reject(error)
      }
    })

    resolve(`App ${name} created.`)
  })
}
