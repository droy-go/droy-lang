# Droy Database - Microprogramming Language

A database microprogramming language extension for Droy, invoked via the `set` command.

## Overview

Droy Database provides a simple, intuitive way to work with databases directly in Droy code. It supports multiple database backends, a fluent query builder, transactions, and migrations.

## Features

- **Multiple Database Types**: SQLite, In-Memory, JSON file, Flat file
- **Fluent Query Builder**: Chainable methods for building queries
- **Schema Definition**: Define tables with types and constraints
- **CRUD Operations**: Create, Read, Update, Delete records
- **Transactions**: ACID-compliant transactions
- **Migrations**: Version-controlled schema changes
- **Relations**: Foreign key support

## Quick Start

```droy
// Create a database
set db = database "myapp" type: memory

// Define a table
set users = db.table "users" schema: {
    id: INTEGER PRIMARY_KEY AUTO_INCREMENT
    name: TEXT NOT_NULL
    email: TEXT UNIQUE
    age: INTEGER
}

// Insert data
set user = users.insert { name: "Alice" email: "alice@example.com" age: 28 }

// Query data
set result = users.where { age: { $gte: 18 } }.query()
em "Found " + result.count() + " users"
```

## Database Types

### In-Memory Database
```droy
set db = database "myapp" type: memory
```
Fast, volatile storage. Data is lost when program ends.

### JSON File Database
```droy
set db = database "myapp" type: json path: "data.db.json"
```
Persistent storage in JSON format.

### SQLite Database
```droy
set db = database "myapp" type: sqlite path: "data.db"
```
Full SQL support with SQLite backend.

## Schema Definition

### Data Types
- `INTEGER` - Whole numbers
- `REAL` - Floating point numbers
- `TEXT` - Strings
- `BLOB` - Binary data
- `BOOLEAN` - true/false
- `DATETIME` - Date and time
- `JSON` - JSON objects

### Constraints
- `PRIMARY_KEY` - Unique identifier
- `AUTO_INCREMENT` - Auto-incrementing integer
- `UNIQUE` - No duplicate values
- `NOT_NULL` - Required field
- `DEFAULT: value` - Default value
- `FOREIGN_KEY: "table.column"` - Reference to another table

### Example Schema
```droy
set products = db.table "products" schema: {
    id: INTEGER PRIMARY_KEY AUTO_INCREMENT
    name: TEXT NOT_NULL
    sku: TEXT UNIQUE
    price: REAL NOT_NULL
    stock: INTEGER DEFAULT: 0
    category_id: INTEGER FOREIGN_KEY: "categories.id"
}
```

## CRUD Operations

### Create (INSERT)
```droy
// Insert a single record
set user = users.insert {
    name: "John Doe"
    email: "john@example.com"
    age: 30
}

// Insert with all fields
set product = products.insert {
    name: "Laptop"
    sku: "LAP-001"
    price: 999.99
    stock: 10
    category_id: 1
}
```

### Read (SELECT)
```droy
// Query all records
set all = users.query()

// Query with WHERE clause
set adults = users.where { age: { $gte: 18 } }.query()

// Query with multiple conditions
set activeAdults = users.where {
    age: { $gte: 18 }
    active: true
}.query()

// Query with OR
set result = users.where {
    $or: [
        { age: { $lt: 18 } }
        { age: { $gte: 65 } }
    ]
}.query()

// Query with sorting
set sorted = users.order("name" ascending: true).query()

// Query with pagination
set page1 = users.take(10).skip(0).query()
set page2 = users.take(10).skip(10).query()

// Get single record
set user = users.where { id: 1 }.first()
```

### Update
```droy
// Update single field
set updated = users.update {
    where: { id: 1 }
    set: { name: "Jane Doe" }
}

// Update multiple fields
set updated = users.update {
    where: { email: "john@example.com" }
    set: {
        name: "John Smith"
        age: 31
    }
}

// Update with condition
set updated = users.update {
    where: { age: { $lt: 18 } }
    set: { status: "minor" }
}
```

### Delete
```droy
// Delete by ID
set deleted = users.delete { where: { id: 1 } }

// Delete with condition
set deleted = users.delete { where: { active: false } }

// Delete all (use with caution!)
set deleted = users.delete { where: {} }
```

## Query Operators

### Comparison
- `$eq` - Equal (=)
- `$ne` - Not equal (!=)
- `$gt` - Greater than (>)
- `$gte` - Greater than or equal (>=)
- `$lt` - Less than (<)
- `$lte` - Less than or equal (<=)

### Logical
- `$and` - And
- `$or` - Or
- `$not` - Not

### Array
- `$in` - In array
- `$nin` - Not in array

### String
- `$like` - Pattern matching (SQL LIKE)
- `$regex` - Regular expression

### Example Queries
```droy
// Greater than
set result = products.where { price: { $gt: 100 } }.query()

// Range
set result = products.where { price: { $gte: 50 $lte: 200 } }.query()

// In array
set result = users.where { status: { $in: ["active", "premium"] } }.query()

// Pattern matching
set result = users.where { name: { $like: "John%" } }.query()

// Complex query
set result = products.where {
    $and: [
        { price: { $gte: 50 } }
        { stock: { $gt: 0 } }
        { category: { $in: ["Electronics", "Computers"] } }
    ]
}.query()
```

## Query Builder Methods

### Chaining
```droy
set result = products
    .where { category: "Electronics" }
    .where { price: { $lte: 1000 } }
    .order("price" ascending: false)
    .take(10)
    .query()
```

### Available Methods
- `.where(conditions)` - Add filter conditions
- `.order(column, ascending)` - Sort results
- `.take(n)` - Limit results
- `.skip(n)` - Offset results
- `.select(columns)` - Select specific columns
- `.query()` - Execute the query

## Transactions

### Basic Transaction
```droy
transaction db {
    // Deduct from account A
    accounts.update {
        where: { id: 1 }
        set: { balance: accountA.balance - 100 }
    }
    
    // Add to account B
    accounts.update {
        where: { id: 2 }
        set: { balance: accountB.balance + 100 }
    }
    
    // Commit happens automatically at end of block
    // Or rollback explicitly
    if (error) {
        rollback
    }
}
```

### Manual Transaction Control
```droy
db.beginTransaction()

// ... operations ...

if (success) {
    db.commit()
} else {
    db.rollback()
}
```

## Migrations

### Creating Migrations
```droy
// Migration 1: Create users table
db.migrate version: 1 {
    up: {
        set users = db.table "users" schema: {
            id: INTEGER PRIMARY_KEY AUTO_INCREMENT
            username: TEXT UNIQUE NOT_NULL
        }
    }
    down: {
        db.dropTable "users"
    }
}

// Migration 2: Add email column
db.migrate version: 2 {
    up: {
        db.alterTable "users" add: {
            email: TEXT
        }
    }
    down: {
        // Reverse migration
    }
}
```

### Migration Commands
```droy
// Run all pending migrations
db.migrateUp()

// Rollback last migration
db.migrateDown()

// Rollback to specific version
db.migrateTo(version: 1)

// Get current version
set version = db.getMigrationVersion()
```

## Relations

### One-to-Many
```droy
// Categories table
set categories = db.table "categories" schema: {
    id: INTEGER PRIMARY_KEY AUTO_INCREMENT
    name: TEXT NOT_NULL
}

// Products table with foreign key
set products = db.table "products" schema: {
    id: INTEGER PRIMARY_KEY AUTO_INCREMENT
    name: TEXT NOT_NULL
    category_id: INTEGER FOREIGN_KEY: "categories.id"
}

// Query with join
set category = categories.where { id: 1 }.first()
set categoryProducts = products.where { category_id: category.id }.query()
```

### Many-to-Many
```droy
// Users table
set users = db.table "users" schema: { id: INTEGER PRIMARY_KEY name: TEXT }

// Roles table
set roles = db.table "roles" schema: { id: INTEGER PRIMARY_KEY name: TEXT }

// Junction table
set user_roles = db.table "user_roles" schema: {
    user_id: INTEGER FOREIGN_KEY: "users.id"
    role_id: INTEGER FOREIGN_KEY: "roles.id"
}

// Get user's roles
set userRoles = user_roles.where { user_id: 1 }.query()
```

## Result Object

### Properties
- `success` - Boolean indicating success
- `count` - Number of rows returned
- `totalCount` - Total matching rows (for pagination)
- `errorMessage` - Error message if failed
- `executionTime` - Query execution time

### Methods
```droy
set result = users.query()

// Get first row
set first = result.first()

// Get last row
set last = result.last()

// Get row at index
set row = result.at(5)

// Iterate
for (row in result) {
    em row.name
}

// Check if empty
if (result.empty()) {
    em "No results found"
}

// Convert to JSON
set json = result.toJSON()
```

## Advanced Features

### Raw SQL
```droy
// Execute raw SQL query
set result = db.query "SELECT * FROM users WHERE age > 18"

// Execute raw SQL for updates
db.execute "UPDATE users SET status = 'active' WHERE id = 1"
```

### Indexes
```droy
set users = db.table "users" schema: {
    id: INTEGER PRIMARY_KEY AUTO_INCREMENT
    email: TEXT INDEX
    name: TEXT INDEX
}

// Create index manually
db.createIndex "users" columns: ["email", "name"] unique: true
```

### Aggregations
```droy
// Count
set count = users.where { active: true }.count()

// Sum
set total = orders.sum("total")

// Average
set avg = products.avg("price")

// Min/Max
set minPrice = products.min("price")
set maxPrice = products.max("price")
```

## Error Handling

```droy
set result = users.insert { name: "Alice" }

if (!result.success) {
    em "Error: " + result.errorMessage
}

// Or check for specific errors
set db = database "myapp" type: sqlite

if (!db.isConnected()) {
    em "Failed to connect: " + db.getLastError()
}
```

## Best Practices

1. **Use Transactions**: Wrap related operations in transactions
2. **Index Frequently Queried Columns**: Add indexes for better performance
3. **Use Migrations**: Version control your schema changes
4. **Validate Data**: Check constraints before inserting
5. **Handle Errors**: Always check result.success
6. **Close Connections**: Call db.disconnect() when done

## Examples

See the `examples/database/` directory for complete examples:
- `basic_crud.droy` - Basic CRUD operations
- `relations.droy` - Table relationships
- `transactions.droy` - Transaction handling
- `migrations.droy` - Schema migrations
- `query_builder.droy` - Query builder usage

## Implementation

The Droy Database microprogramming language is implemented in:
- `include/droy_database.h` - Header file
- `database/droy_database.cpp` - Core implementation
- `database/memory_database.h/cpp` - In-memory and JSON database backends
