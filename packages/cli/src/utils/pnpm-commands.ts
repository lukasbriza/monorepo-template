import { exec, execSync } from 'node:child_process'

import terminate from 'terminate'

import { STORYBOOK_PATH } from './constants'

export const addConfigs = (projectName: string) => {
  execSync(`pnpm add @lukasbriza/ts-config --filter ${projectName} --workspace`)
  execSync(`pnpm add @lukasbriza/eslint-config --filter ${projectName} --workspace`)
}

export const initStorybook = (onEndCallback: () => void) => {
  const command = `pnpm dlx storybook@latest init`
  const process = exec(command, { cwd: STORYBOOK_PATH })

  process.stdout?.on('data', (data) => {
    if (String(data).includes('Choose a project template')) {
      process.stdin?.write('\n')
    }
    if (String(data).includes('Installing dependencies') && process.pid) {
      terminate(process.pid)
    }
  })
  process.stdout?.on('close', onEndCallback)
}

export const installDeps = () => execSync(`pnpm i`)
