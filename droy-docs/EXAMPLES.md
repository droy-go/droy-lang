# Droy Language Examples

## Table of Contents

1. [Basic Examples](#basic-examples)
2. [UI Examples](#ui-examples)
3. [Data Examples](#data-examples)
4. [Server Examples](#server-examples)
5. [Complete Applications](#complete-applications)

---

## Basic Examples

### Hello World

```droy
# Classic hello world
print "Hello, World!"

# Shorthand
message = print: "Hello, World!"
```

### Variables and Types

```droy
# Strings
name: "Droy"
greeting: "Hello, " + name

# Numbers
age: 25
pi: 3.14159

# Booleans
active: true
verified: false

# Null
empty: null

# Arrays
numbers: [1, 2, 3, 4, 5]
fruits: ["apple", "banana", "orange"]

# Objects
user: {
  name: "John",
  age: 30,
  email: "john@example.com"
}
```

### Functions

```droy
# Simple function
func greet(name) {
  return "Hello, " + name + "!"
}

# Arrow function
func add = (a, b) => a + b

# Multiple parameters
func calculate(x, y, op) {
  if op == "+" {
    return x + y
  } else if op == "-" {
    return x - y
  } else if op == "*" {
    return x * y
  } else if op == "/" {
    return x / y
  }
}

# Usage
var msg = greet("World")
var sum = add(5, 3)
var result = calculate(10, 5, "*")
```

### Control Flow

```droy
# If-else
var score = 85

if score >= 90 {
  print "Grade: A"
} else if score >= 80 {
  print "Grade: B"
} else if score >= 70 {
  print "Grade: C"
} else {
  print "Grade: F"
}

# For loop
for i in [1, 2, 3, 4, 5] {
  print "Number: " + i
}

# While loop
var count = 0
while count < 5 {
  print "Count: " + count
  count = count + 1
}
```

---

## UI Examples

### Button Variants

```droy
# Primary button
~btn "Primary" color: #6366f1

# Success button
~btn "Success" color: #10b981

# Danger button
~btn "Danger" color: #ef4444

# Warning button
~btn "Warning" color: #f59e0b

# With click handler
~btn "Click Me" color: #6366f1 @click => {
  print "Button clicked!"
}
```

### Card Component

```droy
~card {
  padding: 24px
  bg: white
  radius: 16px
  shadow: "0 4px 20px rgba(0,0,0,0.1)"
  
  ~img src: "avatar.jpg" radius: 50% width: 80px height: 80px
  ~title "John Doe"
  ~text "Software Developer"
  
  ~row gap: 10px {
    ~btn "Follow" color: #6366f1
    ~btn "Message" color: #e2e8f0
  }
}
```

### Form Layout

```droy
~container {
  max-width: 400px
  margin: 0 auto
  padding: 40px
  
  ~title "Sign Up"
  
  ~text "Full Name"
  ~input type: "text" placeholder: "John Doe"
  
  ~text "Email"
  ~input type: "email" placeholder: "john@example.com"
  
  ~text "Password"
  ~input type: "password" placeholder: "********"
  
  ~btn "Create Account" color: #6366f1 width: 100% @click => {
    submitForm()
  }
  
  ~text "Already have an account? Sign in"
}
```

### Navigation

```droy
set=main-nav=topbar

~topbar {
  bg: #1e293b
  height: 60px
  padding: 0 20px
  
  ~row justify: space-between align: center {
    ~title "Logo" color: white
    
    ~nav {
      ~row gap: 20px {
        ~btn "Home" color: transparent
        ~btn "About" color: transparent
        ~btn "Services" color: transparent
        ~btn "Contact" color: transparent
      }
    }
  }
}
```

### Dashboard Layout

```droy
set=dashboard=main-layout

~topbar {
  bg: #1e293b
  height: 60px
  
  ~row justify: space-between align: center {
    ~title "Dashboard"
    
    ~nav {
      ~icon "🔔" @click => showNotifications()
      ~icon "👤" @click => showProfile()
    }
  }
}

~sidebar {
  width: 250px
  bg: #0f172a
  padding: 20px
  
  ~menu {
    ~col gap: 10px {
      ~btn "📊 Dashboard"
      ~btn "📈 Analytics"
      ~btn "👥 Users"
      ~btn "⚙️ Settings"
    }
  }
}

~container {
  padding: 30px
  
  ~grid cols: 4 gap: 20px {
    ~card {
      ~text "Total Users"
      ~title "1,234"
    }
    ~card {
      ~text "Revenue"
      ~title "$12,345"
    }
    ~card {
      ~text "Orders"
      ~title "567"
    }
    ~card {
      ~text "Growth"
      ~title "+23%"
    }
  }
  
  ~grid cols: 2 gap: 20px {
    ~card {
      ~title "Recent Orders"
      ~text "Order #1234 - $99"
      ~text "Order #1235 - $149"
      ~text "Order #1236 - $79"
    }
    ~card {
      ~title "Top Products"
      ~text "Product A - 234 sales"
      ~text "Product B - 189 sales"
      ~text "Product C - 156 sales"
    }
  }
}
```

### Image Gallery

```droy
~container {
  ~title "Image Gallery"
  
  ~grid cols: 3 gap: 16px {
    ~img src: "image1.jpg" radius: 12px
    ~img src: "image2.jpg" radius: 12px
    ~img src: "image3.jpg" radius: 12px
    ~img src: "image4.jpg" radius: 12px
    ~img src: "image5.jpg" radius: 12px
    ~img src: "image6.jpg" radius: 12px
  }
}
```

### Color Palette

```droy
~container {
  ~title "Color Palette"
  
  ~row gap: 16px {
    ~col align: center {
      ~color #ef4444 width: 60px height: 60px radius: 8px
      ~text "Red"
    }
    ~col align: center {
      ~color #f97316 width: 60px height: 60px radius: 8px
      ~text "Orange"
    }
    ~col align: center {
      ~color #eab308 width: 60px height: 60px radius: 8px
      ~text "Yellow"
    }
    ~col align: center {
      ~color #22c55e width: 60px height: 60px radius: 8px
      ~text "Green"
    }
    ~col align: center {
      ~color #3b82f6 width: 60px height: 60px radius: 8px
      ~text "Blue"
    }
    ~col align: center {
      ~color #a855f7 width: 60px height: 60px radius: 8px
      ~text "Purple"
    }
  }
}
```

---

## Data Examples

### User Data

```droy
data users: [
  { id: 1, name: "John", age: 30, email: "john@example.com" },
  { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
  { id: 3, name: "Bob", age: 35, email: "bob@example.com" }
]

# Filter adults
var adults = filter users where age >= 18

# Sort by name
var sorted = sort users by name asc

# Count users
var count = count users

# Get names
var names = map users name
```

### Product Data

```droy
data products: [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Phone", price: 699, category: "Electronics" },
  { id: 3, name: "Shirt", price: 29, category: "Clothing" },
  { id: 4, name: "Shoes", price: 89, category: "Clothing" }
]

# Filter by category
var electronics = filter products where category == "Electronics"

# Calculate total value
var total = sum products.price

# Average price
var average = avg products.price

# Find most expensive
var maxPrice = max products.price
```

### State Management

```droy
data state: {
  user: null,
  isLoggedIn: false,
  theme: "dark",
  notifications: []
}

# Update state
state.user = { name: "John", email: "john@example.com" }
state.isLoggedIn = true

# Watch state changes
watch state.isLoggedIn => (newValue) => {
  if newValue {
    print "User logged in"
  } else {
    print "User logged out"
  }
}
```

---

## Server Examples

### REST API

```droy
# Configure server
server=api: "https://api.example.com"
server=endpoint: "/v1"

# GET request
fetch: "/users" => (data) => {
  print "Users: " + data
}

# GET single user
get: "/users/1" => (user) => {
  print "User: " + user.name
}

# POST request
post: "/users" data: {
  name: "John",
  email: "john@example.com"
} => (response) => {
  print "Created: " + response.id
}

# PUT request
put: "/users/1" data: {
  name: "Jane"
} => (response) => {
  print "Updated"
}

# DELETE request
delete: "/users/1" => {
  print "Deleted"
}
```

### Authentication

```droy
# Login
func login(email, password) {
  post: "/auth/login" data: {
    email: email,
    password: password
  } => (response) => {
    if response.token {
      state.token = response.token
      state.user = response.user
      state.isLoggedIn = true
      print "Login successful"
    } else {
      print "Login failed"
    }
  }
}

# Logout
func logout() {
  post: "/auth/logout" => {
    state.token = null
    state.user = null
    state.isLoggedIn = false
    print "Logged out"
  }
}

# Register
func register(name, email, password) {
  post: "/auth/register" data: {
    name: name,
    email: email,
    password: password
  } => (response) => {
    print "Registered: " + response.id
  }
}
```

### WebSocket

```droy
# Connect to WebSocket
ws: "wss://chat.example.com"

@ws:open => {
  print "Connected to chat"
}

@ws:message => (msg) => {
  print "Received: " + msg.text
  addMessage(msg)
}

@ws:close => {
  print "Disconnected from chat"
}

# Send message
func sendMessage(text) {
  emit "message" { text: text, timestamp: now() }
}
```

---

## Complete Applications

### Todo App

```droy
# State
data todos: []
data filter: "all"

# Add todo
func addTodo(text) {
  var todo = {
    id: random 1 10000,
    text: text,
    completed: false
  }
  todos.push(todo)
}

# Toggle todo
func toggleTodo(id) {
  var todo = find todos where id == id
  todo.completed = !todo.completed
}

# Delete todo
func deleteTodo(id) {
  todos = filter todos where id != id
}

# Filter todos
func getFilteredTodos() {
  if filter == "active" {
    return filter todos where completed == false
  } else if filter == "completed" {
    return filter todos where completed == true
  }
  return todos
}

# UI
~container {
  max-width: 500px
  margin: 0 auto
  padding: 40px
  
  ~title "Todo App"
  
  ~row gap: 10px {
    ~input id: "todo-input" placeholder: "What needs to be done?"
    ~btn "Add" color: #6366f1 @click => {
      var input = get "todo-input"
      addTodo(input.value)
      input.value = ""
    }
  }
  
  ~row gap: 10px {
    ~btn "All" @click => filter = "all"
    ~btn "Active" @click => filter = "active"
    ~btn "Completed" @click => filter = "completed"
  }
  
  ~col gap: 10px {
    for todo in getFilteredTodos() {
      ~row justify: space-between align: center {
        ~row gap: 10px align: center {
          ~input type: "checkbox" checked: todo.completed @change => {
            toggleTodo(todo.id)
          }
          ~text todo.text style: todo.completed ? "line-through" : ""
        }
        ~btn "×" color: #ef4444 @click => {
          deleteTodo(todo.id)
        }
      }
    }
  }
  
  ~text (count getFilteredTodos()) + " items left"
}
```

### Chat Application

```droy
# State
data messages: []
data currentUser: { name: "Anonymous" }
data connected: false

# WebSocket
ws: "wss://chat.example.com/room/1"

@ws:open => {
  connected = true
  print "Connected to chat"
}

@ws:message => (msg) => {
  messages.push(msg)
}

@ws:close => {
  connected = false
  print "Disconnected"
}

# Send message
func sendMessage(text) {
  if text.trim() == "" {
    return
  }
  
  var message = {
    user: currentUser.name,
    text: text,
    timestamp: now()
  }
  
  emit "message" message
}

# UI
~container {
  max-width: 600px
  margin: 0 auto
  height: 100vh
  
  ~topbar {
    ~title "Chat Room"
    ~text connected ? "● Online" : "○ Offline"
  }
  
  ~container {
    flex: 1
    overflow: auto
    
    for msg in messages {
      ~row justify: msg.user == currentUser.name ? "flex-end" : "flex-start" {
        ~card {
          bg: msg.user == currentUser.name ? #6366f1 : #e2e8f0
          color: msg.user == currentUser.name ? white : black
          
          ~text msg.user
          ~text msg.text
          ~text formatTime(msg.timestamp)
        }
      }
    }
  }
  
  ~row gap: 10px {
    ~input id: "message-input" placeholder: "Type a message..."
    ~btn "Send" color: #6366f1 @click => {
      var input = get "message-input"
      sendMessage(input.value)
      input.value = ""
    }
  }
}
```

### E-commerce Product Page

```droy
# Product data
data product: {
  id: 1,
  name: "Premium Headphones",
  price: 299,
  description: "High-quality wireless headphones with noise cancellation.",
  images: ["img1.jpg", "img2.jpg", "img3.jpg"],
  colors: ["Black", "Silver", "Blue"],
  inStock: true
}

data cart: []

# Add to cart
func addToCart(product, quantity, color) {
  var item = {
    product: product,
    quantity: quantity,
    color: color
  }
  cart.push(item)
  print "Added to cart"
}

# UI
~container {
  max-width: 1200px
  margin: 0 auto
  padding: 40px
  
  ~grid cols: 2 gap: 40px {
    # Product images
    ~col gap: 16px {
      ~img src: product.images[0] radius: 16px
      
      ~row gap: 10px {
        for img in product.images {
          ~img src: img width: 80px height: 80px radius: 8px
        }
      }
    }
    
    # Product info
    ~col gap: 20px {
      ~title product.name
      ~title "$" + product.price
      ~text product.description
      
      ~text "Color"
      ~row gap: 10px {
        for color in product.colors {
          ~btn color radius: 50% width: 40px height: 40px
        }
      }
      
      ~text "Quantity"
      ~row gap: 10px align: center {
        ~btn "-" @click => decreaseQuantity()
        ~text quantity
        ~btn "+" @click => increaseQuantity()
      }
      
      ~btn "Add to Cart" color: #6366f1 width: 100% @click => {
        addToCart(product, quantity, selectedColor)
      }
      
      if product.inStock {
        ~text "✓ In Stock" color: #10b981
      } else {
        ~text "✗ Out of Stock" color: #ef4444
      }
    }
  }
}
```

---

## Animation Examples

### Fade In

```droy
~container {
  animate duration: 500 easing: "ease-out"
  from: { opacity: 0 }
  to: { opacity: 1 }
  
  ~title "Fade In Animation"
}
```

### Slide In

```droy
~container {
  animate duration: 600 easing: "ease-out"
  from: { transform: "translateX(-100%)" }
  to: { transform: "translateX(0)" }
  
  ~title "Slide In Animation"
}
```

### Hover Effects

```droy
~btn "Hover Me" color: #6366f1 {
  transition: "all 0.3s ease"
  
  @hover => {
    transform: "scale(1.05)"
    shadow: "0 10px 30px rgba(99, 102, 241, 0.4)"
  }
}
```

---

## Color & Gradient Examples

### Solid Colors

```droy
~row gap: 10px {
  ~color #ef4444
  ~color #f97316
  ~color #eab308
  ~color #22c55e
  ~color #3b82f6
  ~color #a855f7
}
```

### Gradients

```droy
# Linear gradient
~bg "linear-gradient(135deg, #6366f1, #a855f7)"

# Multi-color gradient
~bg "linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3)"

# Radial gradient
~bg "radial-gradient(circle, #667eea, #764ba2)"
```

### Color Blending

```droy
# Blend two colors
blend #ff0000, #0000ff mode: multiply

# Blend with opacity
blend #ff0000 50%, #0000ff 50%
```
