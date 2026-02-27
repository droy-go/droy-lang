# Droy Programming Language v3.0

A modern, expressive programming language with ultra-short syntax, UI components, data handling, and server integration.

## Quick Start

```droy
# Ultra-short syntax
name: "Droy"
version: 3.0

# Print shorthand
message = print: "Hello, World!"

# UI Components
~btn "Click Me" color: #6366f1
~title "Welcome to Droy"
```

## Core Concepts

### SET / SETUP Naming

Define named elements with the `set` keyword:

```droy
# Set naming syntax
set=topbar=s+d
set=sidebar=main-nav

# Setup configuration
setup=get: styles
setup=theme: dark
```

### TOOL Concept

Create reusable tools:

```droy
# Tool definition
tool=get: formatter
tool=validate: input
tool-set-sty=modern
```

### GET_SET

Get and set values simultaneously:

```droy
# GET_SET pattern
GET_SET name: "value"
GET_SET config: { theme: "dark" }
```

### Value Set with Operations

Define multiple values with operations:

```droy
# Value set with calculations
value-set=(a=1, s=2, c+s=3)
value-set=(x=10, y=20, sum=x+y)
```

## UI Components

### Layout Components

```droy
# Top navigation
~topbar {
  bg: #1e293b
  height: 60px
  
  ~nav {
    ~btn "Home"
    ~btn "About"
    ~btn "Contact"
  }
}

# Sidebar
~sidebar {
  width: 250px
  bg: #0f172a
  
  ~menu {
    ~btn "Dashboard"
    ~btn "Settings"
  }
}

# Header section
~header {
  bg: "linear-gradient(135deg, #6366f1, #a855f7)"
  padding: 60px
  
  ~title "Droy Language"
  ~subtitle "Modern Programming"
}

# Footer
~footer {
  bg: #0f172a
  padding: 40px
  
  ~text "© 2026 Droy Language"
}
```

### Visual Components

```droy
# Buttons
~btn "Primary" color: #6366f1
~btn "Success" color: #10b981
~btn "Danger" color: #ef4444

# Images
~img src: "photo.jpg" radius: 16px

# Video
~video src: "video.mp4" autoplay: true

# Audio
~audio src: "music.mp3" controls: true

# Icons
~icon "★" size: 32px color: #fbbf24
```

### Text Components

```droy
~title "Main Title"
~subtitle "Subtitle Text"
~text "Regular paragraph text"
```

## Color & Styling

### Color Blending

```droy
# Color blend
blend #6366f1, #a855f7 mode: overlay

# Gradient
gradient #ff6b6b, #feca57, #48dbfb

# Theme
~color #6366f1
~bg "linear-gradient(135deg, #6366f1, #a855f7)"
```

### Integrated Background

```droy
# Integrated background
~bg {
  gradient: "linear-gradient(135deg, #667eea, #764ba2)"
  image: "bg.jpg"
  blend: overlay
}
```

## Data Handling

### Data Declaration

```droy
# JSON data
data users: [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 }
]

# CSV data
data csv: "name,age\nJohn,30\nJane,25" format: csv

# State management
data state: { count: 0, user: null }
```

### Data Operations

```droy
# Filter data
filter users where age > 25

# Sort data
sort users by name asc

# Count
count users

# Sum
sum users.age
```

## Server Integration

### Server Configuration

```droy
# Server setup
server=api: "https://api.example.com"
server=endpoint: "/v1"
```

### HTTP Requests

```droy
# GET request
fetch: "/users"

# POST request
post: "/users" data: { name: "John" }

# PUT request
put: "/users/1" data: { name: "Jane" }

# DELETE request
delete: "/users/1"
```

### WebSocket

```droy
# WebSocket connection
ws: "wss://ws.example.com"

@ws:message => {
  print "Received: " + message
}
```

## Group / ID / Name

### Element Grouping

```droy
# Group elements
group=nav-items: [
  ~btn "Home",
  ~btn "About",
  ~btn "Contact"
]

# ID assignment
id=main-header: ~header {
  ~title "Main Header"
}

# Named elements
name=submit-btn: ~btn "Submit" color: #10b981
```

## Programming

### Variables

```droy
# Variable declaration
var name = "Droy"
var age = 25
var active = true

# Shorthand
name: "Droy"
age: 25
```

### Functions

```droy
# Function definition
func greet(name) {
  return "Hello, " + name
}

# Arrow function
func add = (a, b) => a + b

# Usage
var message = greet("World")
var sum = add(5, 3)
```

### Conditions

```droy
# If statement
if age >= 18 {
  print "Adult"
} else {
  print "Minor"
}

# Ternary
var status = age >= 18 ? "Adult" : "Minor"
```

### Loops

```droy
# For loop
for user in users {
  print user.name
}

# While loop
var i = 0
while i < 10 {
  print i
  i = i + 1
}
```

## Math Operations

```droy
# Basic operations
var sum = 10 + 5
var diff = 10 - 5
var product = 10 * 5
var quotient = 10 / 5

# Math functions
var rounded = round 3.14159
var floored = floor 3.9
var ceiled = ceil 3.1
var absolute = abs -10
var random = random 1 100

# Aggregations
var total = sum [1, 2, 3, 4, 5]
var average = avg [10, 20, 30]
var minimum = min [5, 2, 8, 1]
var maximum = max [5, 2, 8, 1]
```

## Events

```droy
# Click event
~btn "Click Me" @click => {
  print "Clicked!"
}

# Hover event
~btn "Hover" @hover => {
  print "Hovered!"
}

# Key events
@keydown "Enter" => {
  print "Enter pressed"
}

@keyup "Escape" => {
  print "Escape pressed"
}
```

## Animation

```droy
# Animation
animate duration: 500 easing: "ease-out"

# Transition
transform: scale(1.1)
opacity: 0.5

# Keyframes
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
```

## Examples

### Login Form

```droy
~card {
  ~title "Login"
  
  ~text "Email"
  ~input type: "email" placeholder: "email@example.com"
  
  ~text "Password"
  ~input type: "password" placeholder: "********"
  
  ~btn "Login" color: #6366f1 @click => {
    submitLogin()
  }
}
```

### Dashboard Layout

```droy
set=dashboard-layout=main

~topbar {
  ~title "Dashboard"
  
  ~nav {
    ~icon "🔔" @click => showNotifications()
    ~icon "👤" @click => showProfile()
  }
}

~sidebar {
  ~menu {
    ~btn "📊 Dashboard"
    ~btn "📈 Analytics"
    ~btn "⚙️ Settings"
  }
}

~container {
  ~grid cols: 3 gap: 20px {
    ~card { ~text "Users: 1,234" }
    ~card { ~text "Revenue: $12,345" }
    ~card { ~text "Orders: 567" }
  }
}
```

## License

MIT License - See LICENSE file for details.
