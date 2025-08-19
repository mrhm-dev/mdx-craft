import { MDXPreview, MDXEditor } from '../index'

describe('Package Exports', () => {
  it('exports MDXPreview component', () => {
    expect(MDXPreview).toBeDefined()
    expect(typeof MDXPreview).toBe('function')
  })

  it('exports MDXEditor component', () => {
    expect(MDXEditor).toBeDefined()
    expect(typeof MDXEditor).toBe('function')
  })

  it('components have correct display names', () => {
    expect(MDXPreview.name).toBe('MDXPreview')
    expect(MDXEditor.name).toBe('MDXEditor')
  })
})