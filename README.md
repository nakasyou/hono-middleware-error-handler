# hono-middleware-error-handler
Catch server error middleware for Hono.
## How to use it?
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { errorHandlerMiddleware } from 'https://deno.land/x/hono_middleware_error_handler/mod.ts'

const app = new Hono()

app.use('/*', errorHandlerMiddleware())

app.get('/error', c => {
  throw new Error('This is test error')
  return c.text('Hello world!')
})

Deno.serve(app.fetch)
```
If you send get request `/error`, you see this response.
```
Error: This is test error

(...stack)
```
### Details
Other response:
```ts
errorHandlerMiddleware({
  type: 'text' // Text Error Handler (default)
})
errorHandlerMiddleware({
  type: 'html' // HTML Error Handler
})
errorHandlerMiddleware({
  type: 'json' // JSON Error Handler
})
```
Custom transform:
```ts
errorHandlerMiddleware({
  transform: ({
    type, // Init type ('text', 'html', 'json')
    error // Error object
  }): string => {
    return error.name
  }
})
```

