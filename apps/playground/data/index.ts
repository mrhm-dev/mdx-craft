import { Example } from '@/store/editorStore'
import introduction from './1-introduction'
import { basicMarkdown } from './2-basic-markdown'
import { components } from './4-components'
import { codeBlocks } from './3-code-blocks'
import { tablesLists } from './5-tables-lists'
import { folderStructure } from './6-folder-structure'

export const mdxExamples: Example[] = [
  introduction,
  basicMarkdown,
  components,
  codeBlocks,
  tablesLists,
  folderStructure,
]
