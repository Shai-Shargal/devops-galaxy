/**
 * CSS Module Declarations
 *
 * Tells TypeScript that CSS imports are valid and won't error
 */

declare module '*.css' {
  const content: Record<string, string>
  export default content
}
