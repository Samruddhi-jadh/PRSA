// types/parameter.types.ts
export interface ParameterResult {
  parameterName: string  // matches Prisma schema
  category: string       // matches Prisma schema
  score: number
  passed: boolean
}