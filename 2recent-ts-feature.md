# ***Recent TS Features***

## **Variadic Tuple Types**

We know that a tuple type is an ordered collection (often of known length)

```ts
type Color = [
  number, // red (0-255)
  number, // green (0-255)
  number // blue (0-255)
]
```

For a while, it’s also been possible to use a `...spread[]` as the last element of the tuple

```ts
enum Sandwich {
  Hamburger,
  VeggieBurger,
  GrilledCheese,
  BLT
}
type SandwichOrder = [
  number, // order total
  Sandwich, // sandwich
  ...string[] // toppings 
]

const order1: SandwichOrder = [12.99, Sandwich.Hamburger, "lettuce"]
const order2: SandwichOrder = [14.99, Sandwich.Hamburger, "avocado", "cheese"]

```

the `...string[]` indicate that we can use infinite text type string after the type `Sandwich`

It has even been possible to use generics for that spread type at the end of the tuple

```ts
// Worked this way, even before TS 4.x
type MyTuple<T> = [number, ...T[]]

const x1: MyTuple<string> = [4, "hello"]
const x2: MyTuple<boolean> = [4, true]
```

It’s important to note that, before TS 4.0 we had to use ...T[], and could not do something like this

while then if we try another example

```ts
enum Sandwich {
  Hamburger,
  VeggieBurger,
  GrilledCheese,
  BLT
}
type SandwichOrder = [
  number, // order total
  Sandwich, // sandwich
  ...string[] // toppings
]
 
const order1: SandwichOrder = [12.99, Sandwich.Hamburger, "lettuce"]
 
/**
 * return an array containing everything except the first element
 */
function tail<T>(arg: readonly [number, ...T[]]) {
  const [_ignored, ...rest] = arg
  return rest
}
 
const orderWithoutTotal = tail(order1)
// the type of orderWithoutTotal is const orderWithoutTotal: (string | Sandwich)[]

```

This is not ideal. A type `(string | Sandwich)[]` is not the same thing as a type `[Sandwich, ...string[]]`.

we can try another approach

```ts
// first approach
function returnArray<T>(arg: readonly T[]): readonly T[] {
  return arg
}

// second approach 
function returnArray<T extends any[]>(arg: T): T {
  return arg
}

const arr: [Sandwich.Hamburger, "lettuce"] = [Sandwich.Hamburger, "lettuce"]
// const arr: [Sandwich.Hamburger, "lettuce"]

const result = returnArray(arr)
// const result: [Sandwich.Hamburger, "lettuce"]

```

then we compared two variable `arr` and `result` it will have same type.
we’re no longer losing type information, once `T = [Sandwich.Hamburger, "lettuce"]`

We can also now use more than one `...spread` in a single tuple

```ts
type MyTuple = [
  ...[number, number],
  ...[string, string, string]
]
const x: MyTuple = [1, 2, "a", "b", "c"]
// const x: [number, number, string, string, string]

```

It’s important to note that **only one `...rest[]` element is possible in a given tuple, but it doesn’t necessarily have to be the last element**

```ts
type YEScompile1 = [...[number, number], ...string[]]
type NOcompile1 = [...number[], ...string[]]
```

`type NoCompile1` will give an error because a rest element cannot follow another rest element.

## **Class Property Inference from Constructors**

This major convenience feature reduces the need for class field type annotations by inferring their types from assignments in the `constructor`. It’s important to remember that this only works when `noImplicitAny` is set to `true`.

```ts
class Color {
  red  // :number no longer needed!
  green // :number no longer needed!
  blue // :number no longer needed!
  constructor(c: [number, number, number]) {
    this.red = c[0]
    this.green = c[1]
    this.blue = c[2]
  }
}
```

In code above we don't need declaring type again like `red: number` in the below Color class, it will follow the constructor type.

then if we declare ex `red: string` it will show an error like `Type 'number' is not assignable to type 'string'`

## **Thrown values as unknown**

now in TS 4.0 we can choose to thrown error as of type `unknown`. If you’ve ever found it risky to assume that a `message`, `stacktrace`, or `name` property is on every possible thrown value you encounter in a catch clause, this feature may make help you sleep a little more soundly.

Whereas thrown values of other types (e.g., `string`) often provide far less information

![image](/2/throw-string.png)

for easy trace error we can type errors as `unknown` not `any`.

here example

```TS
try {
  somethingRisky()
} catch (err: unknown) {
  if (err instanceof Error) throw err
  else throw new Error(`${err}`)
}
```

There’s also a `useUnknownInCatchVariables` `compilerOption` flag that will make thrown values unknown across your entire project

## **Template literal types**

You can think of these like **template strings, but for `types`**.

![image](/2/1.png)

You can do some pretty interesting things with these

![image](/2/2.png)

We even get some special utility types to assist with changing case

![image](/2/3.png)

## **Key remapping in mapped types**

We now have some new syntax (note the as in the example below) that lets us transform keys in a more declarative way. This language feature works quite nicely with template literal types

![image](/2/4.png)

## **Checked index access**

If you’ve ever heard me rant about typing Dictionaries, you may recall that *my advice to describe them as having a possibility of holding `undefined` under some keys*

![image](/2/5.png)

now we see an error alerting us to the ~possibility~ certainty that there is no `string[]` stored under the `rhubarb` key.

the possibly way to

TypeScript now gives us a compiler flag that will do this for us: `noUncheckedIndexAccess`.

## **Building a typed data store**

```ts

export interface DataEntity {
  id: string
}
export interface Movie extends DataEntity {
  director: string
}
export interface Song extends DataEntity {
  singer: string
}
 
export type DataEntityMap = {
  movie: Movie
  song: Song
}
 
export class DataStore {}

```

This `DataEntityMap` object should drive a lot of what happens to `DataStore`.

Ultimately, `DataStore` should end up with methods like

```ts
const ds = new DataStore()
ds.addSong({ id: "song-123", singer: "The Flaming Lips" })
ds.addMovie({
  id: "movie-456",
  director: "Stephen Spielberg",
})
ds.getSong("song-123") // returns the song
ds.getMovie("movie-456") // returns the movie
ds.getAllSongs() // array of all songs
ds.getAllMovies() // array of all movies
ds.clearSongs() // clears all songs
ds.clearMovies() // clears all movies
```

It’s ok to define these explicitly in the `DataStore` class, but they should be type-checked against the `DataEntityMap` type in some way.

### Requirements

- If you mis-name a method on the class (e.g., `getSongs` instead of `getAllSongs`), you should get some sort of type error that alerts you that you’ve *broken the established pattern*
- If you add a new entity like `Comic` (shown below) and make no other changes to your solution, you should get some sort of type error that alerts you to the absence of a `clearComics`, `getAllComics` and `getAllSongs` method.

```ts
+export interface Comic extends DataEntity {
+  issueNumber: number
+}

export type DataEntityMap = {
  movie: Movie
  song: Song
  
+  comic: Comic

}
```

- There should be no externally-visible properties on an instance of `DataStore` beyond the required methods
- Your code, and the test suite should type-check
- All pre-existing tests should pass
