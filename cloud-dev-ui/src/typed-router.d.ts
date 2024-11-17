/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...path]': RouteRecordInfo<'/[...path]', '/:path(.*)', { path: ParamValue<true> }, { path: ParamValue<false> }>,
    '/defects': RouteRecordInfo<'/defects', '/defects', Record<never, never>, Record<never, never>>,
    '/profile': RouteRecordInfo<'/profile', '/profile', Record<never, never>, Record<never, never>>,
    '/property/': RouteRecordInfo<'/property/', '/property', Record<never, never>, Record<never, never>>,
    '/property/[id]': RouteRecordInfo<'/property/[id]', '/property/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/settings': RouteRecordInfo<'/settings', '/settings', Record<never, never>, Record<never, never>>,
  }
}
