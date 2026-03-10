
### 1️⃣ What is the difference between `var`, `let`, and `const`?

These are three ways to create variables in JavaScript, and they behave quite differently:

- **`var`** is the old way. It's *function-scoped*, meaning it lives inside the whole function it was declared in. The weird thing about `var` is something called **hoisting** — JavaScript moves the declaration to the top of the function automatically, which can cause confusing bugs. It also lets you redeclare the same variable without any error.

- **`let`** is the modern replacement for `var`. It's *block-scoped* — meaning it only exists inside the `{}` block (like an `if` statement or loop) where it was declared. You can change its value later, but you can't redeclare it in the same scope.

- **`const`** is also block-scoped like `let`, but the difference is that once you give it a value, you **cannot reassign** it. This doesn't mean the value is completely frozen though — if `const` holds an object or array, you can still change the contents of that object. You just can't point the variable to a completely different thing.

**Simple rule:** Use `const` by default. Use `let` only when you know the value will change. Avoid `var`.

```js
var x = 10;    // function-scoped, can be redeclared
let y = 20;    // block-scoped, can be reassigned
const z = 30;  // block-scoped, cannot be reassigned
```

---

### 2️⃣ What is the spread operator (`...`)?

The spread operator (`...`) is a way to **"spread out"** or expand items from an array, object, or iterable into individual pieces.

Think of it like opening a bag and pouring all the items out individually.

**Copying an array:**
```js
const fruits = ['apple', 'banana'];
const moreFruits = [...fruits, 'mango']; // ['apple', 'banana', 'mango']
```

**Merging objects:**
```js
const userInfo = { name: 'Shams', age: 20 };
const extraInfo = { role: 'admin' };
const fullProfile = { ...userInfo, ...extraInfo };
// { name: 'Shams', age: 20, role: 'admin' }
```

**Passing array items as function arguments:**
```js
const numbers = [1, 2, 3];
console.log(Math.max(...numbers)); // 3
```

It's super useful for creating **copies** instead of references, so you don't accidentally mutate original data.

---

### 3️⃣ What is the difference between `map()`, `filter()`, and `forEach()`?

All three loop through arrays, but they do different things:

- **`forEach()`** — just runs a function for each item. It **doesn't return anything** (returns `undefined`). You'd use it when you want to do something like log or display each item, but don't need a new array back.

- **`map()`** — runs a function on each item and **returns a brand new array** with the transformed values. The original array is unchanged. Perfect when you want to convert every item into something else.

- **`filter()`** — runs a test on each item and **returns a new array** containing only the items where the test returned `true`. Great for filtering out items you don't need.

```js
const numbers = [1, 2, 3, 4, 5];

numbers.forEach(n => console.log(n));       // logs each, returns nothing

const doubled = numbers.map(n => n * 2);    // [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
```

**Rule of thumb:**
- Want to transform → `map()`
- Want to pick/remove → `filter()`
- Just want to do something (like render to DOM) → `forEach()`

---

### 4️⃣ What is an arrow function?

An arrow function is a **shorter way to write a function** in JavaScript, introduced in ES6. Instead of writing `function`, you use `=>` (which looks like an arrow).

**Old way:**
```js
function greet(name) {
  return 'Hello, ' + name;
}
```

**Arrow function:**
```js
const greet = (name) => 'Hello, ' + name;
```

If there's only one parameter, you can even drop the parentheses:
```js
const double = n => n * 2;
```

The big difference (beyond syntax) is how arrow functions handle the `this` keyword. Regular functions have their own `this`, which can change depending on how they're called. Arrow functions **don't have their own `this`** — they borrow it from the surrounding code. This makes them very useful inside things like event listeners and callbacks where you don't want `this` to be unpredictable.

---

### 5️⃣ What are template literals?

Template literals are a better way to create strings in JavaScript. Instead of regular quotes (`'` or `"`), you use **backticks** (`` ` ``). The main benefit is that you can embed variables or expressions directly inside the string using `${}`, without having to break the string with `+` operators.

**Old way (messy):**
```js
const name = 'Shams';
const age = 20;
const msg = 'Hi, my name is ' + name + ' and I am ' + age + ' years old.';
```

**Template literal (clean):**
```js
const msg = `Hi, my name is ${name} and I am ${age} years old.`;
```

You can even do calculations inside `${}`:
```js
console.log(`Two plus two is ${2 + 2}`); // Two plus two is 4
```

Template literals also support **multi-line strings** without needing `\n`:
```js
const html = `
  <div>
    <h1>${name}</h1>
  </div>
`;
```
