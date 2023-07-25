JavaScript is a cross-platform, object-oriented scripting language used to make webpages interactive (e.g., having complex animations, clickable buttons, popup menus, etc.).

More advanced server side versions of JavaScript such as Node.js, which allow you to add more functionality to a website (realtime collaboration between multiple computers).

Inside a host environment (for example, a web browser), JavaScript can be connected to the objects of its environment to provide programmatic control over them.

JavaScript contains a standard library of objects, such as `Array`, `Date`, and `Math`, and a core set of language elements such as operators, control structures, and statements.

- _Client-side JavaScript_ extends the core language by supplying objects to control a browser and its _Document Object Model_ (DOM). For example, client-side extensions allow an application to place elements on an HTML form and respond to user events such as mouse clicks, form input, and page navigation

- Server-side JavaScript_ extends the core language by supplying objects relevant to running JavaScript on a server. For example, server-side extensions allow an application to communicate with a database, provide continuity of information from one invocation to another of the application, or perform file manipulations on a server.

A very useful tool for exploring JavaScript is the JavaScript Console (sometimes called the Web Console, or just the console). We can also use node to interpret JS code locally in the console.

# Table of Content
- [[#1. Declaring Variables|1. Declaring Variables]]
	- [[#1. Declaring Variables#1.1 var - let - const|1.1 var - let - const]]
	- [[#1. Declaring Variables#1.2 Destructuring|1.2 Destructuring]]
	- [[#1. Declaring Variables#1.3 Variables Scope|1.3 Variables Scope]]
	- [[#1. Declaring Variables#1.4 Hoisting|1.4 Hoisting]]
	- [[#1. Declaring Variables#1.5 Global variables|1.5 Global variables]]
	- [[#1. Declaring Variables#1.6 Const|1.6 Const]]
- [[#2. Data Structures and Types|2. Data Structures and Types]]
	- [[#2. Data Structures and Types#2.1 Data Types|2.1 Data Types]]
	- [[#2. Data Structures and Types#2.2 Data Conversion|2.2 Data Conversion]]
		- [[#2.2 Data Conversion#2.2.1 Converting Numbers to Str|2.2.1 Converting Numbers to Str]]
	- [[#2. Data Structures and Types#2.3 Literals|2.3 Literals]]
		- [[#2.3 Literals#2.3.1 Array|2.3.1 Array]]
		- [[#2.3 Literals#2.3.2 Boolean|2.3.2 Boolean]]
		- [[#2.3 Literals#2.3.3 Numeric literals|2.3.3 Numeric literals]]
			- [[#2.3.3 Numeric literals#2.3.4 Integer literals|2.3.4 Integer literals]]
			- [[#2.3.3 Numeric literals#2.3.5 Floating Point literals|2.3.5 Floating Point literals]]
		- [[#2.3 Literals#2.3.6 Object Literals|2.3.6 Object Literals]]
			- [[#2.3.6 Object Literals#2.3.6.1 Enhanced Object literals|2.3.6.1 Enhanced Object literals]]
		- [[#2.3 Literals#2.3.7 RegExp literals|2.3.7 RegExp literals]]
		- [[#2.3 Literals#2.3.8 String Literals|2.3.8 String Literals]]
- [[#3. Control Flow and error handling|3. Control Flow and error handling]]
	- [[#3. Control Flow and error handling#3.1 Block statement|3.1 Block statement]]
	- [[#3. Control Flow and error handling#3.2 Conditional statements|3.2 Conditional statements]]
		- [[#3.2 Conditional statements#3.2.1 Falsy values|3.2.1 Falsy values]]
	- [[#3. Control Flow and error handling#3.3 Exception handling statements|3.3 Exception handling statements]]
		- [[#3.3 Exception handling statements#3.3.1 Throw - Try Catch|3.3.1 Throw - Try Catch]]
		- [[#3.3 Exception handling statements#3.3.2 Finally block|3.3.2 Finally block]]
- [[#4. Loops and Iteration|4. Loops and Iteration]]
	- [[#4. Loops and Iteration#4.1 labeled statement|4.1 labeled statement]]
	- [[#4. Loops and Iteration#4.2 continue statement|4.2 continue statement]]
	- [[#4. Loops and Iteration#4.3 for...in statement|4.3 for...in statement]]
	- [[#4. Loops and Iteration#4.4 for...of statement|4.4 for...of statement]]
- [[#5. Functions|5. Functions]]

## 1. Declaring Variables

```js
const foo = "bar"
```

### 1.1 var - let - const

[`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)

Declares a variable, optionally initializing it to a value.
This syntax can be used to declare both **local** and **global** variables, depending on the _execution context_ : variables created with `var` are not block-scoped, but only local to the _function (or global scope)_ that the block resides within

```js
var x = 1;

if (x === 1) {
  var x = 2;

  console.log(x);
  // Expected output: 2
}

console.log(x);
// Expected output: 2
```

As x is x declared in global context and `var` keyword is not block scoped, we can access it outside of the statement.
```js 
if (true) {
  var x = 5;
}
console.log(x); // x is 5
```

[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

Declares a block-scoped, local variable, optionally initializing it to a value. => Var exists only in block scope.

```js
let x = 1;

if (x === 1) {
  let x = 2;

  console.log(x);
  // Expected output: 2
}

console.log(x);
// Expected output: 1
```

[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

Declares a block-scoped, read-only named constant.

```js 
const number = 42;

try {
  number = 99;
} catch (err) {
  console.log(err);
  // Expected output: TypeError: invalid assignment to const `number'
  // (Note: the exact output may be browser-dependent)
}

console.log(number);
// Expected output: 42
```


### 1.2 Destructuring 

You can declare variables to unpack values using the [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax. For example, `const { bar } = foo`. This will create a variable named `bar` and assign to it the value corresponding to the key of the same name from our object `foo`.

```js
const x = [1, 2, 3, 4, 5];
const [y, z] = x;
console.log(y); // 1
console.log(z); // 2
```

Similarly, you can destructure objects on the left-hand side of the assignment.

```js
const obj = { a: 1, b: 2 };
const { a, b } = obj;
// is equivalent to:
// const a = obj.a;
// const b = obj.b;
```

### 1.3 Variables Scope

A variable may belong to one of the following [scopes](https://developer.mozilla.org/en-US/docs/Glossary/Scope):
- Global scope: The default scope for all code running in script mode.
- Module scope: The scope for code running in module mode.
- Function scope: The scope created with a [function](https://developer.mozilla.org/en-US/docs/Glossary/Function).
 
In addition, variables declared with [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) or [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) can belong to an additional scope:
- Block scope: The scope created with a pair of curly braces (a [block](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block)).

### 1.4 Hoisting

`var`-declared variables are [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), meaning you can refer to the variable anywhere in its scope, even if its declaration isn't reached yet. You can see `var` declarations as being "lifted" to the top of its function or global scope. However, if you access a variable before it's declared, the value is always `undefined`, because only its _declaration_ is hoisted, but not its _initialization_.

```js
console.log(x === undefined); // true
var x = 3;

(function () {
  console.log(x); // undefined
  var x = "local value";
})();
```

Unlike `var` declarations, which only hoist the declaration but not its value, [function declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#function_hoisting) are hoisted entirely — you can safely call the function anywhere in its scope. See the [hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) glossary entry for more discussion.

### 1.5 Global variables

Global variables are in fact properties of the _global object_.

In web pages, the global object is [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window), so you can set and access global variables using the `window.variable` syntax. In all environments, you can use the [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) variable (which itself is a global variable) to access global variables.

### 1.6 Const

You can create a read-only, named constant with the [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) keyword. The syntax of a constant identifier is the same as any variable identifier.

A constant cannot change value through assignment or be re-declared while the script is running. It must be initialized to a value. The scope rules for constants are the same as those for `let` blo ck-scope variables.

However, `const` only prevents _re-assignments_, but doesn't prevent _mutations_. The properties of objects assigned to constants are not protected, so the following statement is executed without problems.

```js
const MY_OBJECT = { key: "value" };
MY_OBJECT.key = "otherValue";
```


## 2. Data Structures and Types

### 2.1 Data Types

The latest ECMAScript standard defines eight data types:

- Seven data types that are [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive):
    1. [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean). `true` and `false`.
    2. [null](https://developer.mozilla.org/en-US/docs/Glossary/Null). A special keyword denoting a null value. (Because JavaScript is case-sensitive, `null` is not the same as `Null`, `NULL`, or any other variant.)
    3. [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined). A top-level property whose value is not defined.
    4. [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number). An integer or floating point number. For example: `42` or `3.14159`.
    5. [BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt). An integer with arbitrary precision. For example: `9007199254740992n`.
    6. [String](https://developer.mozilla.org/en-US/docs/Glossary/String). A sequence of characters that represent a text value. For example: `"Howdy"`.
    7. [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol). A data type whose instances are unique and immutable.

- and [Object](https://developer.mozilla.org/en-US/docs/Glossary/Object)

[Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) are the other fundamental elements of the language. While functions are technically a kind of object, you can think of objects as named containers for values, and functions as procedures that your script can perform.

### 2.2 Data Conversion

JavaScript is a _dynamically typed_ language. This means you don't have to specify the data type of a variable when you declare it. It also means that data types are automatically converted as-needed during script execution.
> NOT APPLICABLE WITH TYPESCRIPT

#### 2.2.1 Converting Numbers to Str

In the case that a value representing a number is in memory as a string, there are methods for conversion.

- [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [`parseFloat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)

`parseInt` only returns whole numbers, so its use is diminished for decimals.

### 2.3 Literals

_Literals_ represent values in JavaScript. These are fixed values—not variables—that you _literally_
provide in your script. This section describes the following types of literals:

- [Array literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#array_literals)
- [Boolean literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#boolean_literals)
- [Numeric literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#numeric_literals)
- [Object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals)
- [RegExp literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#regexp_literals)
- [String literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#string_literals)

#### 2.3.1 Array

An array literal is a list of zero or more expressions, each of which represents an array element, enclosed in square brackets (`[]`). When you create an array using an array literal, it is initialized with the specified values as its elements, and its `length` is set to the number of arguments specified.

```js
const coffees = ["French Roast", "Colombian", "Kona"];
```


#### 2.3.2 Boolean

The Boolean type has two literal values: `true` and `false`.

#### 2.3.3 Numeric literals
JavaScript numeric literals include integer literals in different bases as well as floating-point literals in base-10.

Note that the language specification __requires numeric literals to be unsigned__. Nevertheless, code fragments like `-123.4` are fine, being interpreted as a unary `-` operator applied to the numeric literal `123.4`.

##### 2.3.4 Integer literals

Integer and [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) literals can be written in decimal (base 10), hexadecimal (base 16), octal (base 8) and binary (base 2).

A trailing `n` suffix on an integer literal indicates a [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) literal. The integer literal can use any of the above bases. Note that leading-zero octal syntax like `0123n` is not allowed, but `0o123n` is fine.

##### 2.3.5 Floating Point literals

A floating-point literal can have the following parts:

- An unsigned decimal integer,
- A decimal point (`.`),
- A fraction (another decimal number),
- An exponent.
The exponent part is an `e` or `E` followed by an integer, which can be signed (preceded by `+` or `-`). A floating-point literal must have at least one digit, and either a decimal point or `e` (or `E`).

```js
3.1415926
.123456789
3.1E+12
.1e-23
```

#### 2.3.6 Object Literals
An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces (`{}`).

The following is an example of an object literal. The first element of the `car` object defines a property, `myCar`, and assigns to it a new string, `"Saturn"`; the second element, the `getCar` property, is immediately assigned the result of invoking the function `(carTypes("Honda"))`; the third element, the `special` property, uses an existing variable (`sales`).

```js
const sales = "Toyota";

function carTypes(name) {
  return name === "Honda" ? name : `Sorry, we don't sell ${name}.`;
}

const car = { myCar: "Saturn", getCar: carTypes("Honda"), special: sales };

console.log(car.myCar); // Saturn
console.log(car.getCar); // Honda
console.log(car.special); // Toyota
```

##### 2.3.6.1 Enhanced Object literals

Object literals support a range of shorthand syntaxes that include setting the prototype at construction, shorthand for `foo: foo` assignments, defining methods, making `super` calls, and computing property names with expressions.

Together, these also bring object literals and class declarations closer together, and allow object-based design to benefit from some of the same conveniences.

```js
const obj = {
  // __proto__
  __proto__: theProtoObj,
  // Shorthand for 'handler: handler'
  handler,
  // Methods
  toString() {
    // Super calls
    return "d " + super.toString();
  },
  // Computed (dynamic) property names
  ["prop_" + (() => 42)()]: 42,
};
```

#### 2.3.7 RegExp literals

A regex literal (which is defined in detail [later](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)) is a pattern enclosed between slashes. The following is an example of a regex literal.

```
const re = /ab+c/;
```

#### 2.3.8 String Literals
A string literal is zero or more characters enclosed in double (`"`) or single (`'`) quotation marks. A string must be delimited by quotation marks of the same type (that is, either both single quotation marks, or both double quotation marks).

The following are examples of string literals:

```js
'foo'
"bar"
'1234'
'one line \n another line'
"Joyo's cat"
```

You should use string literals unless you specifically need to use a `String` object. See [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) for details on `String` objects.

You can call any of the [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) object's methods on a string literal value. JavaScript automatically converts the string literal to a temporary String object, calls the method, then discards the temporary String object. You can also use the `length` property with a string literal:

```js 
// Will print the number of symbols in the string including whitespace.
console.log("Joyo's cat".length); // In this case, 10.
```


##  3. Control Flow and error handling

### 3.1 Block statement

The most basic statement is a _block statement_, which is used to group statements. The block is delimited by a pair of curly brackets.
Block statements are commonly used with control flow statements (`if`, `for`, `while`).

```js
while (x < 10) {
  x++;
}
```

---
>**NOTE**

[`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)-declared variables are not block-scoped, but are scoped to the containing function or script, and the effects of setting them persist beyond the block itself. For example:

```js
var x = 1;
{
  var x = 2;
}
console.log(x); // 2
```

This outputs `2` because the `var x` statement within the block is in the same scope as the `var x` statement before the block. (In C or Java, the equivalent code would have output `1`.)

This scoping effect can be mitigated by using [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) or [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const).

---
### 3.2 Conditional statements

JavaScript supports two conditional statements: `if...else` and `switch`.
Switch statement works with other things than integers (!= C)

#### 3.2.1 Falsy values

The following values evaluate to `false` (also known as [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values):
- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- the empty string (`""`)

---
>**NOTE**

Do not confuse the primitive boolean values `true` and `false` with the true and false values of the [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) object!
For example:
```js
const b = new Boolean(false);
if (b) {
  // this condition evaluates to true
}
if (b == true) {
  // this condition evaluates to false
}
```

---

### 3.3 Exception handling statements

#### 3.3.1 Throw - Try Catch
You can throw exceptions using the `throw` statement and handle them using the `try...catch` statements.

- [`throw` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#throw_statement)
- [`try...catch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#try...catch_statement)

Just about any object can be thrown in JavaScript. Nevertheless, not all thrown objects are created equal. While it is common to throw numbers or strings as errors, it is frequently more effective to use one of the exception types specifically created for this purpose:

- [ECMAScript exceptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types)
- [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException) and [`DOMError`](https://developer.mozilla.org/en-US/docs/Web/API/DOMError)

#### 3.3.2 Finally block
The `finally` block contains statements to be executed _after_ the `try` and `catch` blocks execute. Additionally, the `finally` block executes _before_ the code that follows the `try…catch…finally`
statement.

It is also important to note that the `finally` block will execute _whether or not_ an exception is thrown. If an exception is thrown, however, the statements in the `finally` block execute even if no `catch` block handles the exception that was thrown.

```js
openMyFile();
try {
  writeMyFile(theData); // This may throw an error
} catch (e) {
  handleError(e); // If an error occurred, handle it
} finally {
  closeMyFile(); // Always close the resource
}
```

## 4. Loops and Iteration
Similar to what we already know

The statements for loops provided in JavaScript are:
- [for statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for_statement)
- [do...while statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#do...while_statement)
- [while statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#while_statement)
- [labeled statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#labeled_statement)
- [break statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#break_statement)
- [continue statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#continue_statement)
- [for...in statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for...in_statement)

### 4.1 labeled statement

A [`label`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) provides a statement with an identifier that lets you refer to it elsewhere in your program. For example, you can use a label to identify a loop, and then use the `break` or `continue` statements to indicate whether a program should interrupt the loop or continue its execution.

In this example, the label `markLoop` identifies a `while` loop.

```js
markLoop: while (theMark) {
  doSomething();
}
```

- When you use `break` with a label, it terminates the specified labeled statement.
```js
let x = 0;
let z = 0;
labelCancelLoops: while (true) {
  console.log("Outer loops:", x);
  x += 1;
  z = 1;
  while (true) {
    console.log("Inner loops:", z);
    z += 1;
    if (z === 10 && x === 10) {
      break labelCancelLoops;
    } else if (z === 10) {
      break;
    }
  }
}
```

### 4.2 continue statement

- When you use `continue` without a label, it terminates the current iteration of the innermost enclosing `while`, `do-while`, or `for` statement and continues execution of the loop with the next iteration. In contrast to the `break` statement, `continue` does not terminate the execution of the loop entirely. In a `while` loop, it jumps back to the condition. In a `for` loop, it jumps to the `increment-expression`.

### 4.3 for...in statement

The [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) statement iterates a specified variable over all the enumerable properties of an object.

```js
function dumpProps(obj, objName) {
  let result = "";
  for (const i in obj) {
    result += `${objName}.${i} = ${obj[i]}<br>`;
  }
  result += "<hr>";
  return result;
}
```

### 4.4 for...of statement

The [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) statement creates a loop Iterating over [iterable objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) (including [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) object and so on), invoking a custom iteration hook with statements to be executed for the value of each distinct property.

```js 
const arr = [3, 5, 7];
arr.foo = "hello";

for (const i in arr) {
  console.log(i);
}
// "0" "1" "2" "foo"

for (const i of arr) {
  console.log(i);
}
// Logs: 3 5 7
```

The `for...of` and `for...in` statements can also be used with [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). For example, you can simultaneously loop over the keys and values of an object using [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).

```js
const obj = { foo: 1, bar: 2 };

for (const [key, val] of Object.entries(obj)) {
  console.log(key, val);
}
// "foo" 1
// "bar" 2
```

## 5. Functions

