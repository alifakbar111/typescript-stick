
# Game 1 : Does it compile?

## Example 1

```ts
let age = 38
age = Number.NaN
```

answer:

Yes, this will compile. Unfortunately, obviously NaN is a number in JavaScript.

## Example 2

```ts
const vector3: [number, number, number] = [3, 4, 5]
vector3.push(6)
```

answer:

`Yes, this will compile`. Unfortunately, because tuples are a specialized flavor of arrays (and at runtime, they actually are just regular arrays) they expose the entire array API. Look at the type signature of `.push()`

## Example 3

```ts
type Color = {
  red: number
  green: number
  blue: number
}
interface Color {
  alpha: number
}
```

answer:
`No, this will not compile`. if we have `type` alias we cannot have same name. but if we have an `interface` with same name it will merge together.

![image](/3/1.png)

## Example 4

```ts
class Person {
  name: string
  friends: Person[]
  constructor(name: string) {
    this.name = name
  }
}
```

answer:
`No, this will not compile`.

![image](/3/2.png)

## Example 5

```ts
abstract class Person {
  public abstract name: string
}
class Student extends Person {
  public name: string | string[] = ["Mike North"]
}
```

answer:
`No, this will not compile`.

![image](/3/3.png)

## Example 6

```ts
interface Color {
  red: number
  green: number
  blue: number
}
function printColor(color: Color) {
  // ... //
}
printColor({
  red: 255,
  green: 0,
  blue: 0,
  alpha: 0.4,
})
```

answer:
`No, this will not compile`. because we passing `alpha` into parameter but we don't have the `alpha` in interface

![image](/3/4.png)

## Example 7

```ts
type Color = {
  red: number
  green: number
  blue: number
}
class ColorValue implements Color {
  constructor(
    public red: number,
    public green: number,
    public blue: number
  ) {}
}
```

answer:
`Yes, this will compile`.

## Example 8

```ts
export class Person {
  name: string = ""
}
interface Person {
  age?: number
}
```

answer:
`No, this will NOT compile`. When one part of a merged declaration is exported, all other parts must be exported as well.

![image](/3/5.png)

## Example 9

```ts
class Person {
  name: string
  constructor(userId: string) {
    // Fetch user's name from an API endpoint
    fetch(`/api/user-info/${userId}`)
      .then((resp) => resp.json())
      .then((info) => {
        this.name = info.name // set the user's name
      })
  }
}
```

answer:
`No, this will NOT compile`. The callback passed to .then is not regarded as a “definite assignment”. In fact, all callbacks are treated this way.

![image](/3/6.png)

## Example 10

```ts
enum Language {
  TypeScript = "TS",
  JavaScript,
}
enum Editor {
  SublimeText,
  VSCode = "vscode",
}
enum Linter {
  ESLint,
  TSLint = "tslint",
  JSLint = 3,
  JSHint,
}
```

answer:
`No, this will NOT compile`.

![image](/3/7.png)

## Example 11

```ts
function handleClick(evt: Event) {
  const $element = evt.target as HTMLInputElement
  if (this.value !== "") {
    this.value = this.value.toUpperCase()
  }
}
```

answer:

`No, this will NOT compile`. When you have a free-standing function like this, and refer to the `this` value, we need to give it a type of some sort.

![image](/3/8.png)

Here’s a version that would compile

```ts
function handleClick(this: HTMLInputElement, evt: Event) {
  const $element = evt.target as HTMLInputElement
  if (this.value !== "") {
    this.value = this.value.toUpperCase()
  }
}
```

## Example 12

```ts
class Person {
  #name: string
  private age: number
  constructor(name: string, age: number) {
    this.#name = name
    this.age = age
  }
}
class Student extends Person {
  #name: string | string[]
  private age: number
  constructor(name: string, age: number | null) {
    super(name, age || 0)
    this.#name = name
    this.age = age
  }
}
```

answer:
`No, this will NOT compile`. Because TS `private` fields are just “checked for access at build time” and are totally accessible outside the class at runtime, there’s a collision between the two `age` members.

![image](/3/9.png)

## Example 13

```ts
class Person {
  #name: string
  constructor(name: string) {
    this.#name = name
  }
}
function makeName(name: string | string[]): string {
  if (Array.isArray(name)) return name.join(" ")
  else return name
}
class Student extends Person {
  #name: string | string[]
  constructor(name: string | string[]) {
    super(makeName(name))
    this.#name = name
  }
}
```

answer:
`Yes, this will compile`. Because Ecma `#private` fields are not visible, even at runtime, outside of the class, there’s no collision between the two `#name` members.

# Game 2 : Typing jQuery

## What’s a jQuery?

Back in the age of inconsistent DOM APIs (I’m looking at you IE6) there arose a dominant solution that allowed us to do things very similar to `document.querySelector` and many other things.

We’re going to write our own version of part of this API surface, with **types**!.

```js
const $: any = {}
 
/**
 * Get the <button> element with the class 'continue'
 * and change its HTML to 'Next Step...'
 */
$("button.continue").html("Next Step...")
 
/**
 * Show the #banner-message element that is hidden with visibility:"hidden" in
 * its CSS when any button in #button-container is clicked.
 */
const hiddenBox = $("#banner-message")
$("#button-container button").on("click", (event) => {
  hiddenBox.show()
})
 
/**
 * Make an API call and fill a <div id="post-info">
 * with the response data
 */
$.ajax({
  url: "https://jsonplaceholder.typicode.com/posts/33",
  success: (result) => {
    $("#post-info").html(
      "<strong>" + result.title + "</strong>" + result.body
    )
  },
})
```
