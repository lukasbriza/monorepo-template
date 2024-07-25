import readlineSync from 'readline-sync'

import { chooseName, chooseOption } from './questions/index'
import type { Option } from './types'
import { createMatrix, DEFAULT_OPTION_INDEX, OPTIONS } from './utils'

let selectedOption: Option

const option = readlineSync.question(chooseOption())

if (option.length === 0 || Number.isNaN(Number(option)) || Number(option) > OPTIONS.length || Number(option) <= 0) {
  const [array] = OPTIONS
  selectedOption = array
  console.log(`Choosed default option: ${array[DEFAULT_OPTION_INDEX]}`)
}

const optionIndex = Number(option) - 1

selectedOption = OPTIONS[optionIndex]

const name = selectedOption[0] === 'Storybook' ? '' : chooseName()

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createMatrix(selectedOption[0], name)
