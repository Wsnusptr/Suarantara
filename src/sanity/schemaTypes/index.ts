import { type SchemaTypeDefinition } from 'sanity'
import { articleType } from './article'
import { authorType } from './author'
import { categoryType } from './category'
import { advocacyDocType } from './advocacyDoc'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [articleType, authorType, categoryType, advocacyDocType],
}
