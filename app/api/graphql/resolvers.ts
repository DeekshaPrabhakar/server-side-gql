import { db } from '@/db/db'
import { InsertIssues, SelectIssues, issues, users } from '@/db/schema'
import { GQLContext } from '@/types'
import { getUserFromToken, signin, signup } from '@/utils/auth'
import { and, asc, desc, eq, or, sql } from 'drizzle-orm'
import { GraphQLError } from 'graphql'
import { Mutation } from 'urql'

export const resolvers = {
  Query: {
    me: (_, __, ctx: GQLContext) => {
      return ctx.user
    },
  },
  Mutation: {
    signin: async (_, args) => {
      const data = await signin(args.input)

      if (!data || !data.user || !data.token) {
        throw new GraphQLError('UNAUTHORIZED', {
          extensions: { code: 401 },
        })
      }

      return { ...data.user, token: data.token }
    },
    createUser: async (_, args) => {
      const data = await signup(args.input)

      if (!data || !data.user || !data.token) {
        throw new GraphQLError('could not create user', {
          extensions: { code: 401 },
        })
      }

      return { ...data.user, token: data.token }
    },
  },
}
