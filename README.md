# HNDL

Are you looking for a new Node framework? Well, you've come to the right place!

HNDL was made to address my personal frustrations with existing Node frameworks,
and here are the main design decisions behind HNDL:

- No middleware
- Strong types
- Simple routing
- Async by default
- No external dependencies
- Sane defaults

## No Middleware?!

Yes! This is my main point of concern with existing Node frameworks.
Let's take a typicial Express request handler:

```js
app.get("/timestamp", (req, res) => {
  res.send({
    timestamp: new Date().valueOf();
  })
});
```

Let's say we send a request `GET /timestamp`, what would the response be?

It would be valid to say: "Well it returns a json object containing a unix millis timestamp.".
However it's not correct, because you don't know that before I registered this handler, I also have:

```js
app.use((req, res) => {
  res.sendStatus(400);
})
```

So to avoid confusion like this, there is no middleware support in HNDL.
If your request handler gets invoked, it is guaranteed to be THE ONLY thing that will process this event.
Isn't that cool? Why do I even have to sell this as a feature? How did we come to this?

## Endpoint Type Definition

In HNDL any object that looks like this is a valid endpoint:

```ts
type Endpoint<T> = {
  accept: (request: Request) => Optional<T> | Promise<Optional<T>>;
  handle: (payload: T) => Response | Promise<Response>;
}
```

The most important thing to notice is the relationship between `accept` and `handle`:
`handle` takes as a param whatever `accept` returns.

How they are related is explained in the next section about routing.

## Routing

A router in HNDL is defined using the function `router`, it takes a variadic list of
endpoints like this:

```ts
const myRouter = router(
  firstEndpoint,
  secondEndpoint,
  thirdEndpoint
)
```

The main job of the router is to choose one of the passed endpoints to handle the
incoming request. And for this the router uses the `accept` function.

So when a new request comes in, the router will go in order, and call the `accept`
function of every endpoint. The first `accept` that returns a truthy value, is chosen.

Whatever this truthy value is, the router will invoke the `handle` method of this chosen
endpoint with that value.

The `handle` method of the chosen endpoint MUST return a `Response` object.
In other words, if you accept the request, you must handle it entirely.

Both `accept` and `handle` can of course be async.

Finally, it's worth noting that the `router` function just returns another
`Endpoint` so they can be nested, if needed, but this is discouraged.

### Examples

Let's go through a few examples to illustrate how this works:

This endpoint will respond to any request with a 200 OK:

```ts
const everythingIsOK = {
  accept: () => true,
  handle: () => { status: OK }
}
```

This router will respond with `200 OK` if the URL starts with `/ok`,
otherwise with `404 Not Found`:

```ts
const myRouter = router(
  {
    accept: request => request.url.startsWith("/ok"),
    handle: () => { status: OK }
  },
  {
    accept: () => true,
    handle: () { status: NOT_FOUND }
  }
)
```

## The Service

When developing a web service it's necessary to perform additional
tasks such as logging, error handling, etc... These do not fall
into the area of responsibility of endpoints, and for this we use the `service`.

The `service` function takes the following arguments:

```ts
type ServiceProps = {
  endpoint: Endpoint<any>;
  errorHandler?: ErrorHandler;
  logger?: Logger;
}

type ErrorHandler = (error: any) => Response | Promise<Response>;

type Logger = (request: Request, response: Response) => void;
```

And returns a new `endpoint` which will log requests and handle
errors correctly thrown from both the `accept` and `handle` functions
of the passed endpoint.

It's a convenient function that is not strictly necessary in this
package, but is something that most people will like to have.

## The Listener

The last piece of the puzzle is the `listener`. It is meant to conform
to the request handler function passed into the `createServer` function
which comes with the default node `http` module.

The listener's job is to simply allow async handling of incoming
requests. And can be used in the following way:

```ts
const myEndpoint: Endpoint = { /* ... */};
const server = createServer(listener(myEndpoint));
```
