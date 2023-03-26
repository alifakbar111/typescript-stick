# Making Typescript Stick - Intro Quiz

- **by Alif - Zero One Group**

## Question 1

Compare and contrast the `#name` and `age` fields

```ts
export class Person {
  #name = ""
  private age = 1
}
```

- `#name` is a JS private field, it's inaccessible outside of the class at runtime
- `age` is Typescript private field, while type checking helps ensure we don't access it improperly, at runtime it's accessible outside the class.

## Question 2

Which of the following variables (`a`, `b`, `c`, `d`, `e`) hold immutable values (meaning you cannot change the value)

```ts
const a = "Frontend Masters"
let b = "Frontend Masters"
 
const c = { learnAt: "Frontend Masters" }
let d = { learnAt: "Frontend Masters" }
 
const e = Object.freeze({ learnAt: "Frontend Masters" })
```

- `a`, `b` and `e` are immutable value; `const` and `let` differ in terms of whether variable can be reassigned, but has nothing to do with the value they hold.
- `Object.freeze` prevent properties of an object from being changed and prevent new properties from being added. This effectively is a *“shallow immutability”*

## Question 3

What’s the missing line of code that should replace `/* ??? */`

```ts
const str = "hello"
let val =
  /* ??? */
  console.log(val) // ['h', 'e', 'l', 'l', 'o']
```

- we can do splitting our string in `str` variable using `.split()` function. So to fill the missing line of code we can type like this

```ts
const str = "hello"
let val = str.split("")
```

## Question 4

What’s the missing line of code that should replace `/* ??? */`

```ts
const str = "hello"
let val =
  /* ??? */
  console.log(val)

// expected 
/**
 * {
 *   '0': 'h',
 *   '1': 'e',
 *   '2': 'l',
 *   '3': 'l',
 *   '4': 'o'
 * }
 */
```

- in JS Three dots is called `spread syntax` or `spread operator`

```ts
const str = "hello"
let val = { ...str.split("") }
```

## Question 5

Look at the types of `first` and `second` below

```ts
let first: string & number
let second: String & Number

first = "abc"
// Type 'string' is not assignable to type 'never'.

second = "abc"
// Type 'string' is not assignable to type 'String & Number'.
//   Type 'string' is not assignable to type 'Number'.

second = new String("abc")
// Type 'String' is not assignable to type 'String & Number'.
//   Type 'String' is missing the following properties from type 'Number': toFixed, toExponential, toPrecision
```

- the type of variable `first` is type `never`, which indicates the values that will never occur. there is nothing that we could combine between string and number so it will be type `never`.
- in variable `second` have same with `first` but got different error message, you can see the different between `string` and `String` with capital `S`.
- When using the primitive types `string` and `number` we can see that the union of these two types results in a never.
- When using the interface types `String` and `Number`, we can see that the union does not result in a never.
- When you are creating a function, type or *interface* in Typescript, it is recommended to use lowercase string to tell Typescript you want to get an actual `string`. If you use `String`, then you will get an **object** (which is not what you would want).

## Question 6

Why is `second = bar` type-checking, but `first = bar` is not?

```ts
let first: string & number
let second: String & Number
 
interface Foo extends String, Number {}

// Interface 'Foo' cannot simultaneously extend types 'String' and 'Number'.
//   Named property 'toString' of types 'String' and 'Number' are not identical.
// Interface 'Foo' cannot simultaneously extend types 'String' and 'Number'.
//   Named property 'valueOf' of types 'String' and 'Number' are not identical.

interface Bar extends String, Number {
  valueOf(): never
  toString(): string
}
 
let bar: Bar = {
  ...new Number(4),
  ...new String("abc"),
  ...{
    valueOf() {
      return "" as never
    },
  },
}
second = bar
first = bar

// Type 'Bar' is not assignable to type 'never'.

```

- It seems like we can create an interface `Bar` that that has just the right shape to both comply with the `String` and `Number` interfaces
- We can also successfully create a value `bar`, with only a little cheating via casting (as `never`)
- This is why we want to stay away from the interfaces corresponding to primitive types, and stick to `string` and `number`

## Question 7

In what order will the animal names below be printed to the console?

```ts
function getData() {
  console.log("elephant")
  const p = new Promise((resolve) => {
    console.log("giraffe")
    resolve("lion")
    console.log("zebra")
  })
  console.log("koala")
  return p
}
async function main() {
  console.log("cat")
  const result = await getData()
  console.log(result)
}
console.log("dog")
main().then(() => {
  console.log("moose")
})
```

- `dog`, `cat`, `elephant`, `giraffe`, `zebra`, `koala`, `lion`, `moose`
- `giraffe` and `zebra` will appear first because `Promise` executors are invoked synchronously in the `Promise` constructor
- `lion` will appear so late because a `resolve` is not a `return`. Just because a `Promise` has resolved, doesn’t mean the corresponding `.then` (or await is called immediately)
