# Droy Language Syntax Reference

## Table of Contents

1. [Comments](#comments)
2. [Variables](#variables)
3. [Data Types](#data-types)
4. [Operators](#operators)
5. [Control Flow](#control-flow)
6. [Functions](#functions)
7. [UI Components](#ui-components)
8. [Events](#events)
9. [Data Handling](#data-handling)
10. [Server Integration](#server-integration)

---

## Comments

```droy
# Single line comment

# Multi-line
# comments
```

---

## Variables

### Declaration

```droy
# Standard syntax
var name = "Droy"
var age = 25

# Shorthand syntax
name: "Droy"
age: 25

# Print shorthand
message = print: "Hello"
```

### Naming Conventions

```droy
# Valid names
var myVariable = 1
var _private = 2
var $special = 3

# SET naming
set=topbar=main-nav
set=sidebar=menu
```

---

## Data Types

### Primitives

```droy
# String
var str = "Hello"
var str2: "World"

# Number
var int = 42
var float = 3.14

# Boolean
var flag = true
var flag2 = false

# Null
var empty = null
```

### Complex Types

```droy
# Array
var arr = [1, 2, 3]
var mixed = [1, "two", true]

# Object
var obj = {
  name: "Droy",
  version: 3.0
}

# Color
var primary = #6366f1
var secondary = "rgb(168, 85, 247)"
```

---

## Operators

### Arithmetic

```droy
+   # Addition
-   # Subtraction
*   # Multiplication
/   # Division
%   # Modulo
**  # Power
```

### Comparison

```droy
==  # Equal
!=  # Not equal
<   # Less than
>   # Greater than
<=  # Less than or equal
>=  # Greater than or equal
```

### Logical

```droy
&&  # AND
||  # OR
!   # NOT
```

### Assignment

```droy
=   # Assign
+=  # Add and assign
-=  # Subtract and assign
*=  # Multiply and assign
/=  # Divide and assign
```

---

## Control Flow

### If Statement

```droy
if condition {
  # code
} else if otherCondition {
  # code
} else {
  # code
}
```

### For Loop

```droy
for item in collection {
  # code
}

for i in [1, 2, 3, 4, 5] {
  print i
}
```

### While Loop

```droy
while condition {
  # code
}

var i = 0
while i < 10 {
  print i
  i = i + 1
}
```

---

## Functions

### Definition

```droy
# Standard function
func name(param1, param2) {
  return param1 + param2
}

# Arrow function
func add = (a, b) => a + b

# No parameters
func greet() {
  return "Hello!"
}
```

### Calling

```droy
var result = add(5, 3)
var msg = greet()
```

---

## UI Components

### Syntax Pattern

```droy
~component "content" prop: value prop2: value2

~component {
  prop: value
  # children
}
```

### Common Components

```droy
# Button
~btn "Click Me"
~btn "Styled" color: #6366f1 radius: 8px

# Image
~img src: "image.jpg"
~img src: "image.jpg" radius: 16px shadow: "0 4px 10px rgba(0,0,0,0.2)"

# Text
~title "Title"
~subtitle "Subtitle"
~text "Paragraph"

# Layout
~container { }
~grid cols: 3 gap: 16px { }
~row gap: 20px { }
~col gap: 12px { }

# Layout Sections
~topbar { }
~sidebar { }
~header { }
~footer { }
~nav { }
~menu { }
```

### Properties

```droy
# Size
width: 100px
height: 100px
size: 24px

# Spacing
padding: 20px
margin: 10px

# Appearance
color: #6366f1
bg: #1e293b
background: "linear-gradient(...)"
radius: 8px
border: "1px solid #ccc"
shadow: "0 4px 10px rgba(0,0,0,0.2)"
opacity: 0.8

# Position
position: "relative"
top: 10px
left: 20px
z_index: 100
```

---

## Events

### Event Handlers

```droy
@click => { }
@hover => { }
@focus => { }
@blur => { }
@keydown "Key" => { }
@keyup "Key" => { }
@submit => { }
@change => { }
```

### Examples

```droy
~btn "Click" @click => {
  print "Clicked!"
}

~input @change => (value) => {
  print "Changed: " + value
}

@keydown "Enter" => {
  submitForm()
}
```

---

## Data Handling

### Declaration

```droy
data name: value
data name: value format: json
```

### Operations

```droy
# Filter
filter data where condition

# Sort
sort data by field asc
data.sort by field desc

# Map
map data transform

# Reduce
reduce data initial reducer
```

---

## Server Integration

### Configuration

```droy
server=api: "https://api.example.com"
server=endpoint: "/v1"
```

### Requests

```droy
# GET
fetch: "/users"
get: "/users/1"

# POST
post: "/users" data: { name: "John" }

# PUT
put: "/users/1" data: { name: "Jane" }

# DELETE
delete: "/users/1"

# PATCH
patch: "/users/1" data: { age: 30 }
```

### WebSocket

```droy
ws: "wss://ws.example.com"

@ws:open => { }
@ws:message => (msg) => { }
@ws:close => { }
@ws:error => (err) => { }
```

---

## Advanced Concepts

### SET / SETUP

```droy
# Define named element
set=name=expression

# Setup configuration
setup=action: target
```

### TOOL

```droy
# Define tool
tool=action: config

# Tool set styling
tool-set-sty=style-name
```

### GET_SET

```droy
# Get and set
GET_SET property: value
```

### Value Set

```droy
# Define multiple values
value-set=(a=1, b=2, c=a+b)
```

### Group / ID / Name

```droy
# Group elements
group=name: [elements]

# Assign ID
id=name: element

# Name element
name=name: element
```

---

## Color & Styling

### Color Formats

```droy
# Hex
#ff0000
#f00

# RGB
rgb(255, 0, 0)
rgba(255, 0, 0, 0.5)

# HSL
hsl(0, 100%, 50%)
```

### Blending

```droy
# Blend colors
blend #ff0000, #0000ff mode: multiply

# Gradient
gradient #ff0000, #00ff00, #0000ff

# Theme
~theme mode: dark
~theme mode: light
```

---

## Math Functions

```droy
# Rounding
round 3.14159    # 3
floor 3.9        # 3
ceil 3.1         # 4

# Absolute
abs -10          # 10

# Min/Max
min [1, 2, 3]    # 1
max [1, 2, 3]    # 3

# Random
random 1 100     # Random number between 1-100

# Aggregations
sum [1, 2, 3]    # 6
avg [10, 20, 30] # 20
count [1, 2, 3]  # 3
```
