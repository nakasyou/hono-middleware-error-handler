import type { MiddlewareHandler } from 'https://deno.land/x/hono/mod.ts'

export type ErrorHandlerMiddlewareInitType = 'text' | 'html' | 'json'

export interface ErrorHandlerMiddlewareInit {
  type?: 'text' | 'html' | 'json'
  transform?: (init: { error: Error, type: ErrorHandlerMiddlewareInitType }) => string
  status?: number
}
export const errorHandlerMiddleware = (init?: ErrorHandlerMiddlewareInit): MiddlewareHandler => {
  if (!init) {
    init = {}
  }
  if (!init.type) {
    init.type = 'text'
  }
  if (!init.status) {
    init.status = 500
  }
  if (!init.transform) {
    // Defaurt transform function
    init.transform = (transformInit) => {
      // JSON Response
      if (transformInit.type === 'json') {
        return JSON.stringify({
          name: transformInit.error.name,
          message: transformInit.error.message,
          stack: transformInit.error.stack,
        })
      }
      // Text Response
      if (transformInit.type === 'text') {
        return `${transformInit.error.name}: ${transformInit.error.message}\n\n${transformInit.error.stack}`
      }
      // HTML Response
      if (transformInit.type === 'html') {
        return `<!doctype HTML>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${transformInit.error.name}</title>
  </head>
  <body>
    <div>
      <h2>${transformInit.error.name}</h2>
      <p>${transformInit.error.message}</p>
      <div>
        <div>Stack:</div>
        <pre style="overflow-x: scroll;">
          <code>
${
              transformInit.error.stack
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
}
          </code>
        </pre>
      </div>
    </div>`
      }
    }
  }
  // Create response
  return async (ctx, next) => {
    //try {
      await next()
    //} catch (error) {
      const resText = init.transform!({
        error: ctx.error,
        type: init.type!,
      })
      ctx.status(init.status!)
      return ctx.text(resText)
    //}
  }
}
