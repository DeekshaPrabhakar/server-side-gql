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
    issues: async (
      _,
      {
        input,
      }: {
        input?: {
          statuses?: SelectIssues['status'][]
          projects?: SelectIssues['projectId'][]
        }
      },
      ctx: GQLContext
    ) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      // return only issues that belong to the user
      const andFilters = [eq(issues.userId, ctx.user.id)]

      if (input && input.statuses && input.statuses.length) {
        const statusFilters = input.statuses.map((status) =>
          eq(issues.status, status)
        )

        andFilters.push(or(...statusFilters))
      }

      const data = await db.query.issues.findMany({
        where: and(...andFilters),
        orderBy: [
          asc(sql`case ${issues.status}
        when "backlog" then 1
        when "inprogress" then 2
        when "done" then 3
      end`),
          desc(issues.createdAt),
        ],
      })

      return data
    },
  },
  IssueStatus: {
    BACKLOG: 'backlog', // always need to resolve enums since in graphwl the enum is uppercase and in db is lowercase
    TODO: 'todo',
    INPROGRESS: 'inprogress',
    DONE: 'done',
  },
  Issue: {
    // this is a resolver for the Issue type and say how to resolve user
    user: (issue, args, ctx) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      return db.query.users.findFirst({
        where: eq(users.id, issue.userId),
      })
    },
  },
  User: {
    issues: (user, args, ctx) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      return db.query.issues.findMany({
        where: eq(issues.userId, user.id),
      })
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
    createIssue: async (_, { input }, ctx: GQLContext) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      const issue = await db
        .insert(issues)
        .values({ ...input, userId: ctx.user.id })
        .returning()
      //returning is a method that returns the inserted row instead of stats on how many rows were inserted

      return issue[0]
    },
    editIssue: async (_, { input }, ctx) => {
      if (!ctx.user)
        throw new GraphQLError('UNAUTHORIZED', { extensions: { code: 401 } })

      console.log('input', input)
      const { id, ...update } = input

      const result = await db
        .update(issues)
        .set(update ?? {})
        .where(and(eq(issues.userId, ctx.user.id), eq(issues.id, id)))
        .returning()

      return result[0]
    },
  },
}
