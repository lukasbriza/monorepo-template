import { createNextProject } from './create-next-project'
import { createStorybook } from './create-storybook'

export const createMatrix = async (option: string, projectName: string) => {
  switch (option) {
    case 'NextJS': {
      await createNextProject(projectName)
      break
    }
    case 'Storybook': {
      await createStorybook()
      break
    }
  }
}
