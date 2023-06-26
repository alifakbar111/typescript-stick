# Challenge 3: Type Challenges

## Round 1

### 1 - `If<C, T, F>`

![image](/4/1.png)

solution:

```ts
// Implement this type
type If<C, T, F> = C extends true ? T : F

// Tests
type cases = [
  Expect<Equal<If<true, "apple", "pear">, "apple">>,
  Expect<Equal<If<false, "orange", 42>, 42>>
]
```

### 2 - `LengthOfTuple<T>`

Implement a type that evaluates to a numeric type literal, equivalent to the length of a specified tuple type `T`

![image](/4/2.png)

solution:

```ts
// Implement this type
type LengthOfTuple<T> = T extends readonly any[] ? T['length'] : never

// Tests
const Fruits = ["cherry", "banana"] as const
type cases = [
  Expect<Equal<LengthOfTuple<[1, 2, 3]>, 3>>,
  Expect<NotEqual<LengthOfTuple<[1, 2, 3]>, 2>>,
  Expect<Equal<LengthOfTuple<typeof Fruits>, 2>>,
  Expect<Equal<LengthOfTuple<[]>, 0>>
]
```

### 3 `EndsWith<A, B>`

Implement a type that evaluates to `true` if the type `A` ends with the type `B`, otherwise `false`.

![image](/4/3.png)

solution:

```ts
// Implement this type
type EndsWith<A extends string, B extends string> = A extends `${any}${B}` ? true: false

// Tests
type cases = [
  Expect<Equal<EndsWith<"ice cream", "cream">, true>>,
  Expect<Equal<EndsWith<"ice cream", "chocolate">, false>>
]
```

### 4 `Concat<A, B>`

Implement a type that concatenates two tuple types `A`, and `B`

![image](/4/4.png)

```ts
// Implement this type
type Concat<A extends any[], B extends any[]> = [...A, ...B];

// Tests
type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], ["hello"]>, ["hello"]>>,
  Expect<
    Equal<Concat<[18, 19], [20, 21]>, [18, 19, 20, 21]>
  >,
  Expect<
    Equal<
      Concat<[42, "a", "b"], [Promise<boolean>]>,
      [42, "a", "b", Promise<boolean>]
    >
  >
]
```

## -----------------------------------------------------------------------

## Round 2

### 1 `ReturnOf<F>`

Implement a type that emits the return type of a function type `F`

![image](/4/5a.png)
![image](/4/5b.png)

solution:

```ts
// Implement this type
type ReturnOf<F> = F extends {(...arg: any[]): infer RT} ? RT : never

// Tests

const flipCoin = () =>
  Math.random() > 0.5 ? "heads" : "tails"
const rockPaperScissors = (arg: 1 | 2 | 3) => {
  return arg === 1
    ? ("rock" as const)
    : arg === 2
    ? ("paper" as const)
    : ("scissors" as const)
}

type cases = [
  // simple 1
  Expect<Equal<boolean, ReturnOf<() => boolean>>>,
  // simple 2
  Expect<Equal<123, ReturnOf<() => 123>>>,
  Expect<
    Equal<ComplexObject, ReturnOf<() => ComplexObject>>
  >,
  Expect<
    Equal<
      Promise<boolean>,
      ReturnOf<() => Promise<boolean>>
    >
  >,
  Expect<Equal<() => "foo", ReturnOf<() => () => "foo">>>,
  Expect<
    Equal<"heads" | "tails", ReturnOf<typeof flipCoin>>
  >,
  Expect<
    Equal<
      "rock" | "paper" | "scissors",
      ReturnOf<typeof rockPaperScissors>
    >
  >
]

type ComplexObject = {
  a: [12, "foo"]
  bar: "hello"
  prev(): number
}
```

### 2 `Split<S, SEP>`

Implement a type that splits a string literal type `S` by a delimiter `SEP`, emitting a tuple type containing the string literal types for all of the “tokens”

![image](/4/6a.png)
![image](/4/6b.png)

solution:

```ts
// Implement this type
type Split<S extends string, SEP extends string> =
  S extends `${infer R}${SEP}${infer T}` 
  ? [R, ...Split<T, SEP>] : S extends "" 
  ? SEP extends "" 
  ? []: [""] : string extends S 
  ? string[] : [S];

// Tests

type cases = [
  Expect<
    Equal<
      Split<"Hi! How are you?", "z">,
      ["Hi! How are you?"]
    >
  >,
  Expect<
    Equal<
      Split<"Hi! How are you?", " ">,
      ["Hi!", "How", "are", "you?"]
    >
  >,
  Expect<
    Equal<
      Split<"Hi! How are you?", "">,
      [
        "H",
        "i",
        "!",
        " ",
        "H",
        "o",
        "w",
        " ",
        "a",
        "r",
        "e",
        " ",
        "y",
        "o",
        "u",
        "?"
      ]
    >
  >,
  Expect<Equal<Split<"", "">, []>>,
  Expect<Equal<Split<"", "z">, [""]>>,
  Expect<Equal<Split<string, "whatever">, string[]>>
]
```

### 3 `IsTuple<T>`

Implement a type `IsTuple`, which takes an input type `T` and returns whether `T` is tuple type.

![image](/4/7.png)

solution

```ts
// Implement this type
type IsTuple<T> = T extends readonly any[]
  ? [...T, any]['length'] extends T['length'] ? false : true
  : false

// or another solve 
type IsTuple<T> = T extends readonly [] | readonly [any, ...any[]] ? true : false;

// Or
type IsTuple<T> = [T] extends [never] ? false : T extends readonly [] ? true : T extends readonly [infer _Head, ...infer _Tail] ? true : false


// Tests
type cases = [
  Expect<Equal<IsTuple<[]>, true>>,
  Expect<Equal<IsTuple<[number]>, true>>,
  Expect<Equal<IsTuple<readonly [1]>, true>>,
  Expect<Equal<IsTuple<{ length: 1 }>, false>>,
  Expect<Equal<IsTuple<number[]>, false>>
]
```

### 4 `IndexOf<T, U>`

Implement the type version of `Array.indexOf`, `IndexOf<T, U>` takes an Array `T`, any `U` and returns the index of the first `U` in Array `T`.

![image](/4/8.png)

```ts
// Implement this type
type IndexOf<T extends any[], U, Acc extends any[] = []> =
  T[0] extends U
  ? Acc['length'] : T extends [infer F, ...infer Rest]
  ? IndexOf<Rest, U, [...Acc, F]> : -1

// Tests

type cases = [
  Expect<Equal<IndexOf<[1, 2, 3], 2>, 1>>,
  Expect<Equal<IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 2>>,
  Expect<Equal<IndexOf<[0, 0, 0], 2>, -1>>
]
```
