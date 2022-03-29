import type { FieldPolicy } from '@apollo/client/core'
import { ObjectID } from '.'

export const dateTypePolicy: FieldPolicy = {
  merge: (_, incoming) => {
    if (incoming == undefined || incoming == null) {
      return incoming
    } else if (incoming instanceof Date) {
      return incoming
    } else {
      return new Date(incoming as string)
    }
  },
}

export const objectIdTypePolicy: FieldPolicy = {
  merge: (_, incoming) => {
    if (incoming == undefined || incoming == null) {
      return incoming
    } else if (incoming instanceof ObjectID) {
      return incoming
    } else {
      return new ObjectID(incoming as string)
    }
  },
}
