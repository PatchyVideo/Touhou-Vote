declare module '*.gql' {
  import { DocumentNode, DocumentNode } from '@apollo/client'

  const content: DocumentNode
  export default content
}

declare module '*.graphql' {
  const content: DocumentNode
  export default content
}
