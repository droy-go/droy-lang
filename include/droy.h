/**
 * Droy Programming Language - Complete Implementation
 * =====================================================
 * A modern markup and programming language with package management
 * 
 * Version: 2.0.0
 * License: MIT
 */

#ifndef DROY_H
#define DROY_H

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdarg.h>
#include <assert.h>
#include <math.h>

/* ============ VERSION ============ */
#define DROY_VERSION "2.0.0"
#define DROY_NAME "Droy Language"
#define DROY_PM_VERSION "1.0.0"

/* ============ CONSTANTS ============ */
#define MAX_TOKEN_LEN 1024
#define MAX_STRING_LEN 4096
#define MAX_IDENT_LEN 256
#define MAX_ARGS 64
#define MAX_SCOPE_DEPTH 256
#define MAX_MODULES 1024
#define MAX_PACKAGES 1024
#define CACHE_SIZE 1024

/* ============ TOKEN TYPES ============ */
typedef enum {
    // Keywords - Core
    TOKEN_SET,
    TOKEN_RET,
    TOKEN_EM,
    TOKEN_TEXT,
    TOKEN_PRINT,
    
    // Control Flow
    TOKEN_FE,
    TOKEN_ELSE,
    TOKEN_F,
    TOKEN_FOR,
    TOKEN_WHILE,
    TOKEN_BREAK,
    TOKEN_CONTINUE,
    TOKEN_RETURN,
    
    // Operators
    TOKEN_PLUS,
    TOKEN_MINUS,
    TOKEN_DIVIDE,
    TOKEN_EQUALS,
    TOKEN_MULTIPLY,
    TOKEN_MODULO,
    TOKEN_POWER,
    
    // Comparison
    TOKEN_EQ,
    TOKEN_NE,
    TOKEN_GT,
    TOKEN_LT,
    TOKEN_GE,
    TOKEN_LE,
    
    // Logical
    TOKEN_AND,
    TOKEN_OR,
    TOKEN_NOT,
    
    // Assignment
    TOKEN_ASSIGN,
    TOKEN_PLUS_ASSIGN,
    TOKEN_MINUS_ASSIGN,
    TOKEN_MUL_ASSIGN,
    TOKEN_DIV_ASSIGN,
    
    // Data Types
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_IDENTIFIER,
    TOKEN_BOOLEAN,
    TOKEN_NULL,
    TOKEN_ARRAY,
    TOKEN_OBJECT,
    
    // Special Variables
    TOKEN_VAR_SI,
    TOKEN_VAR_UI,
    TOKEN_VAR_YUI,
    TOKEN_VAR_POP,
    TOKEN_VAR_ABC,
    TOKEN_VAR_ARGC,
    TOKEN_VAR_ARGV,
    TOKEN_VAR_ENV,
    
    // Styling & Media
    TOKEN_STY,
    TOKEN_PKG,
    TOKEN_MEDIA,
    TOKEN_IMPORT,
    TOKEN_EXPORT,
    TOKEN_FROM,
    TOKEN_AS,
    
    // Links System
    TOKEN_LINK,
    TOKEN_A_LINK,
    TOKEN_YOEX_LINKS,
    TOKEN_LINK_GO,
    TOKEN_CREATE_LINK,
    TOKEN_OPEN_LINK,
    TOKEN_CLOSE_LINK,
    TOKEN_API,
    TOKEN_ID,
    TOKEN_URL,
    
    // Commands
    TOKEN_CMD_EMPLOYMENT,
    TOKEN_CMD_RUNNING,
    TOKEN_CMD_PRESSURE,
    TOKEN_CMD_LOCK,
    TOKEN_CMD_UNLOCK,
    TOKEN_CMD_STATUS,
    
    // Blocks
    TOKEN_BLOCK,
    TOKEN_KEY,
    TOKEN_CLASS,
    TOKEN_STRUCT,
    TOKEN_ENUM,
    TOKEN_INTERFACE,
    TOKEN_IMPLEMENTS,
    TOKEN_EXTENDS,
    
    // Module System
    TOKEN_MODULE,
    TOKEN_NAMESPACE,
    TOKEN_USE,
    TOKEN_REQUIRE,
    TOKEN_INCLUDE,
    
    // Package Manager
    TOKEN_INSTALL,
    TOKEN_UNINSTALL,
    TOKEN_UPDATE,
    TOKEN_PUBLISH,
    TOKEN_SEARCH,
    TOKEN_REGISTRY,
    
    // Delimiters
    TOKEN_LPAREN,
    TOKEN_RPAREN,
    TOKEN_LBRACE,
    TOKEN_RBRACE,
    TOKEN_LBRACKET,
    TOKEN_RBRACKET,
    TOKEN_COLON,
    TOKEN_SEMICOLON,
    TOKEN_COMMA,
    TOKEN_DOT,
    TOKEN_AT,
    TOKEN_HASH,
    TOKEN_TILDE,
    TOKEN_DOLLAR,
    TOKEN_QUESTION,
    TOKEN_BANG,
    TOKEN_PIPE,
    TOKEN_AMPERSAND,
    
    // Comments
    TOKEN_COMMENT,
    TOKEN_DOC_COMMENT,
    
    // Whitespace
    TOKEN_NEWLINE,
    TOKEN_WHITESPACE,
    TOKEN_TAB,
    TOKEN_EOF,
    TOKEN_ERROR,
    TOKEN_UNKNOWN
} TokenType;

/* ============ VALUE TYPES ============ */
typedef enum {
    VAL_NUMBER,
    VAL_STRING,
    VAL_BOOLEAN,
    VAL_NULL,
    VAL_ARRAY,
    VAL_OBJECT,
    VAL_FUNCTION,
    VAL_NATIVE,
    VAL_LINK,
    VAL_PACKAGE,
    VAL_MODULE,
    VAL_POINTER
} ValueType;

/* ============ FORWARD DECLARATIONS ============ */
typedef struct Token Token;
typedef struct Value Value;
typedef struct ASTNode ASTNode;
typedef struct Variable Variable;
typedef struct Function Function;
typedef struct Scope Scope;
typedef struct Link Link;
typedef struct Package Package;
typedef struct Module Module;
typedef struct Interpreter Interpreter;
typedef struct Compiler Compiler;
typedef struct IR IR;

/* ============ TOKEN STRUCTURE ============ */
struct Token {
    TokenType type;
    char* value;
    int line;
    int column;
    int length;
    char* file;
    Token* next;
    Token* prev;
};

/* ============ VALUE STRUCTURE ============ */
struct Value {
    ValueType type;
    union {
        double number;
        char* string;
        bool boolean;
        struct {
            Value** items;
            int count;
            int capacity;
        } array;
        struct {
            char** keys;
            Value** values;
            int count;
            int capacity;
        } object;
        Function* function;
        struct {
            Value* (*fn)(int argc, Value** args);
            char* name;
        } native;
        Link* link;
        Package* package;
        Module* module;
        void* pointer;
    } as;
    bool is_const;
    bool is_exported;
    char* doc;
};

/* ============ AST NODE TYPES ============ */
typedef enum {
    AST_PROGRAM,
    AST_BLOCK,
    AST_EXPRESSION_STMT,
    AST_SET_STMT,
    AST_RET_STMT,
    AST_EM_STMT,
    AST_TEXT_STMT,
    AST_PRINT_STMT,
    AST_IF_STMT,
    AST_ELSE_STMT,
    AST_FOR_STMT,
    AST_WHILE_STMT,
    AST_BREAK_STMT,
    AST_CONTINUE_STMT,
    AST_FUNCTION_DEF,
    AST_FUNCTION_CALL,
    AST_RETURN_STMT,
    AST_BINARY_EXPR,
    AST_UNARY_EXPR,
    AST_TERNARY_EXPR,
    AST_NUMBER_LITERAL,
    AST_STRING_LITERAL,
    AST_BOOLEAN_LITERAL,
    AST_NULL_LITERAL,
    AST_ARRAY_LITERAL,
    AST_OBJECT_LITERAL,
    AST_IDENTIFIER,
    AST_VARIABLE_REF,
    AST_ASSIGNMENT,
    AST_COMPOUND_ASSIGNMENT,
    AST_MEMBER_ACCESS,
    AST_INDEX_ACCESS,
    AST_LINK_STMT,
    AST_STY_STMT,
    AST_PKG_STMT,
    AST_MEDIA_STMT,
    AST_COMMAND_STMT,
    AST_BLOCK_DEF,
    AST_IMPORT_STMT,
    AST_EXPORT_STMT,
    AST_CLASS_DEF,
    AST_STRUCT_DEF,
    AST_ENUM_DEF,
    AST_INTERFACE_DEF,
    AST_TRY_STMT,
    AST_CATCH_STMT,
    AST_FINALLY_STMT,
    AST_THROW_STMT
} ASTNodeType;

/* ============ AST NODE STRUCTURE ============ */
struct ASTNode {
    ASTNodeType type;
    char* value;
    Token* token;
    
    // Children
    ASTNode** children;
    int child_count;
    int child_capacity;
    
    // For binary/unary expressions
    ASTNode* left;
    ASTNode* right;
    ASTNode* condition;
    
    // For function definitions
    char** params;
    int param_count;
    int param_capacity;
    
    // For variable declarations
    bool is_const;
    bool is_exported;
    
    // Line info
    int line;
    int column;
    char* file;
};

/* ============ VARIABLE STRUCTURE ============ */
struct Variable {
    char* name;
    Value* value;
    bool is_const;
    bool is_exported;
    char* doc;
    Variable* next;
};

/* ============ FUNCTION STRUCTURE ============ */
struct Function {
    char* name;
    char** params;
    int param_count;
    ASTNode* body;
    Scope* closure;
    bool is_native;
    bool is_async;
    bool is_generator;
    char* doc;
    Value* (*native_fn)(int argc, Value** args);
};

/* ============ SCOPE STRUCTURE ============ */
struct Scope {
    Variable* variables;
    Scope* parent;
    Scope** children;
    int child_count;
    int child_capacity;
    char* name;
    bool is_module;
    bool is_function;
};

/* ============ LINK STRUCTURE ============ */
struct Link {
    char* id;
    char* url;
    char* api;
    char* method;
    char** headers;
    int header_count;
    bool is_open;
    bool is_persistent;
    void* handle;
    Link* next;
};

/* ============ PACKAGE STRUCTURE ============ */
struct Package {
    char* name;
    char* version;
    char* description;
    char* author;
    char* license;
    char* repository;
    char* homepage;
    char** keywords;
    int keyword_count;
    char* main;
    char** dependencies;
    int dependency_count;
    char** dev_dependencies;
    int dev_dependency_count;
    Module* module;
    bool is_installed;
    bool is_loaded;
    char* install_path;
    Package* next;
};

/* ============ MODULE STRUCTURE ============ */
struct Module {
    char* name;
    char* path;
    char* source;
    Token* tokens;
    ASTNode* ast;
    Scope* scope;
    Value** exports;
    int export_count;
    bool is_loaded;
    bool is_main;
    Module** imports;
    int import_count;
    Package* package;
};

/* ============ INTERPRETER STATE ============ */
struct Interpreter {
    Scope* global_scope;
    Scope* current_scope;
    Module* main_module;
    Module** loaded_modules;
    int module_count;
    int module_capacity;
    Package** packages;
    int package_count;
    int package_capacity;
    Link* links;
    Value* special_vars[8];
    bool running;
    bool locked;
    int pressure_level;
    int employment_status;
    int exit_code;
    Value* last_value;
    char** argv;
    int argc;
};

/* ============ COMPILER STATE ============ */
struct Compiler {
    Module* module;
    IR* ir;
    char* output_path;
    bool optimize;
    int optimization_level;
    char* target;
    char* target_triple;
};

/* ============ IR STRUCTURE ============ */
struct IR {
    char** instructions;
    int count;
    int capacity;
    char* data_section;
    char* text_section;
};

/* ============ LEXER STRUCTURE ============ */
typedef struct {
    const char* source;
    char* file;
    int position;
    int line;
    int column;
    int length;
    Token* tokens;
    Token* current;
    int token_count;
    int token_capacity;
    bool skip_whitespace;
    bool skip_comments;
} Lexer;

/* ============ PARSER STRUCTURE ============ */
typedef struct {
    Token* tokens;
    Token* current;
    int position;
    int error_count;
    char** errors;
    int error_capacity;
    bool panic_mode;
} Parser;

/* ============ CONFIG STRUCTURE ============ */
typedef struct {
    char* name;
    char* version;
    char* description;
    char* author;
    char* license;
    char* repository;
    char* homepage;
    char* main;
    char* droy_version;
    char** dependencies;
    int dependency_count;
    char** dev_dependencies;
    int dev_dependency_count;
    char** scripts;
    int script_count;
    bool private;
} DroyConfig;

/* ============ FUNCTION PROTOTYPES ============ */

// Lexer Functions
Lexer* lexer_create(const char* source, const char* file);
void lexer_destroy(Lexer* lexer);
Token* lexer_next_token(Lexer* lexer);
Token* lexer_tokenize(Lexer* lexer);
void token_free(Token* token);
const char* token_type_to_string(TokenType type);
bool token_is_keyword(TokenType type);
bool token_is_operator(TokenType type);
bool token_is_literal(TokenType type);

// Parser Functions
Parser* parser_create(Token* tokens);
void parser_destroy(Parser* parser);
ASTNode* parser_parse(Parser* parser);
ASTNode* parser_parse_program(Parser* parser);
ASTNode* parser_parse_statement(Parser* parser);
ASTNode* parser_parse_expression(Parser* parser);
ASTNode* parser_parse_block(Parser* parser);
ASTNode* parser_parse_function_def(Parser* parser);
ASTNode* parser_parse_function_call(Parser* parser);
ASTNode* parser_parse_if_stmt(Parser* parser);
ASTNode* parser_parse_for_stmt(Parser* parser);
ASTNode* parser_parse_while_stmt(Parser* parser);
ASTNode* parser_parse_import_stmt(Parser* parser);
ASTNode* parser_parse_class_def(Parser* parser);
void ast_free(ASTNode* node);
void ast_print(ASTNode* node, int indent);
char* ast_to_string(ASTNode* node);

// Value Functions
Value* value_create_number(double num);
Value* value_create_string(const char* str);
Value* value_create_boolean(bool b);
Value* value_create_null(void);
Value* value_create_array(int capacity);
Value* value_create_object(int capacity);
Value* value_create_function(Function* fn);
Value* value_create_native(const char* name, Value* (*fn)(int argc, Value** args));
Value* value_create_link(Link* link);
Value* value_create_package(Package* pkg);
Value* value_create_module(Module* mod);
void value_free(Value* value);
Value* value_copy(Value* value);
char* value_to_string(Value* value);
bool value_is_truthy(Value* value);
bool value_equals(Value* a, Value* b);
int value_compare(Value* a, Value* b);
Value* value_add(Value* a, Value* b);
Value* value_subtract(Value* a, Value* b);
Value* value_multiply(Value* a, Value* b);
Value* value_divide(Value* a, Value* b);
Value* value_modulo(Value* a, Value* b);
Value* value_power(Value* a, Value* b);

// Scope Functions
Scope* scope_create(Scope* parent, const char* name);
void scope_destroy(Scope* scope);
Variable* scope_define(Scope* scope, const char* name, Value* value, bool is_const);
Variable* scope_get(Scope* scope, const char* name);
Value* scope_get_value(Scope* scope, const char* name);
bool scope_set(Scope* scope, const char* name, Value* value);
bool scope_has(Scope* scope, const char* name);
void scope_push(Interpreter* interp, Scope* scope);
void scope_pop(Interpreter* interp);

// Interpreter Functions
Interpreter* interpreter_create(void);
void interpreter_destroy(Interpreter* interp);
int interpreter_run(Interpreter* interp, ASTNode* ast);
Value* interpreter_eval(Interpreter* interp, ASTNode* node);
Value* interpreter_call_function(Interpreter* interp, Function* fn, int argc, Value** args);
void interpreter_register_native(Interpreter* interp, const char* name, Value* (*fn)(int argc, Value** args));
void interpreter_load_module(Interpreter* interp, const char* path);
void interpreter_import_module(Interpreter* interp, const char* path);
Value* interpreter_get_special_var(Interpreter* interp, TokenType type);
void interpreter_set_special_var(Interpreter* interp, TokenType type, Value* value);

// Compiler Functions
Compiler* compiler_create(Module* module);
void compiler_destroy(Compiler* compiler);
IR* compiler_compile(Compiler* compiler, ASTNode* ast);
bool compiler_optimize(Compiler* compiler, int level);
bool compiler_emit(Compiler* compiler, const char* format, ...);
bool compiler_emit_binary(Compiler* compiler, const char* output);
bool compiler_emit_llvm(Compiler* compiler, const char* output);
bool compiler_emit_asm(Compiler* compiler, const char* output);

// IR Functions
IR* ir_create(void);
void ir_destroy(IR* ir);
bool ir_emit(IR* ir, const char* instruction);
char* ir_to_string(IR* ir);
bool ir_save(IR* ir, const char* path);

// Link Functions
Link* link_create(const char* id, const char* url);
void link_destroy(Link* link);
bool link_open(Link* link);
bool link_close(Link* link);
char* link_fetch(Link* link, const char* method, const char* body);
bool link_set_header(Link* link, const char* key, const char* value);

// Package Functions
Package* package_create(const char* name, const char* version);
void package_destroy(Package* pkg);
bool package_add_dependency(Package* pkg, const char* name, const char* version);
bool package_add_keyword(Package* pkg, const char* keyword);
bool package_install(Package* pkg, const char* path);
bool package_load(Package* pkg);
bool package_unload(Package* pkg);
Package* package_find(Interpreter* interp, const char* name);

// Module Functions
Module* module_create(const char* name, const char* path);
void module_destroy(Module* mod);
bool module_load_source(Module* mod, const char* source);
bool module_tokenize(Module* mod);
bool module_parse(Module* mod);
bool module_compile(Module* mod);
bool module_execute(Module* mod, Interpreter* interp);
Value* module_get_export(Module* mod, const char* name);
bool module_add_export(Module* mod, const char* name, Value* value);

// Config Functions
DroyConfig* config_load(const char* path);
bool config_save(DroyConfig* config, const char* path);
void config_free(DroyConfig* config);
char* config_get_dependency(DroyConfig* config, const char* name);
bool config_add_dependency(DroyConfig* config, const char* name, const char* version);
bool config_remove_dependency(DroyConfig* config, const char* name);

// Utility Functions
char* read_file(const char* filename);
bool write_file(const char* filename, const char* content);
bool file_exists(const char* path);
bool dir_exists(const char* path);
bool create_dir(const char* path);
char* get_dirname(const char* path);
char* get_basename(const char* path);
char* get_extension(const char* path);
char* join_path(const char* a, const char* b);
char** split_string(const char* str, const char* delim, int* count);
char* trim_string(char* str);
char* duplicate_string(const char* str);
bool starts_with(const char* str, const char* prefix);
bool ends_with(const char* str, const char* suffix);
char* replace_string(const char* str, const char* old, const char* new);
unsigned long hash_string(const char* str);

// Error Handling
void droy_error(const char* file, int line, int column, const char* message);
void droy_warning(const char* file, int line, int column, const char* message);
void droy_info(const char* file, int line, int column, const char* message);
void set_error_handler(void (*handler)(const char* file, int line, int column, const char* message));

// Memory Management
void* droy_malloc(size_t size);
void* droy_realloc(void* ptr, size_t size);
void droy_free(void* ptr);
void* droy_calloc(size_t num, size_t size);
char* droy_strdup(const char* str);

// Built-in Functions
Value* builtin_print(int argc, Value** args);
Value* builtin_println(int argc, Value** args);
Value* builtin_input(int argc, Value** args);
Value* builtin_type(int argc, Value** args);
Value* builtin_len(int argc, Value** args);
Value* builtin_push(int argc, Value** args);
Value* builtin_pop(int argc, Value** args);
Value* builtin_shift(int argc, Value** args);
Value* builtin_unshift(int argc, Value** args);
Value* builtin_slice(int argc, Value** args);
Value* builtin_split(int argc, Value** args);
Value* builtin_join(int argc, Value** args);
Value* builtin_replace(int argc, Value** args);
Value* builtin_contains(int argc, Value** args);
Value* builtin_index_of(int argc, Value** args);
Value* builtin_to_string(int argc, Value** args);
Value* builtin_to_number(int argc, Value** args);
Value* builtin_parse_json(int argc, Value** args);
Value* builtin_stringify_json(int argc, Value** args);
Value* builtin_exit(int argc, Value** args);
Value* builtin_sleep(int argc, Value** args);
Value* builtin_time(int argc, Value** args);
Value* builtin_random(int argc, Value** args);
Value* builtin_floor(int argc, Value** args);
Value* builtin_ceil(int argc, Value** args);
Value* builtin_round(int argc, Value** args);
Value* builtin_abs(int argc, Value** args);
Value* builtin_sqrt(int argc, Value** args);
Value* builtin_pow(int argc, Value** args);
Value* builtin_min(int argc, Value** args);
Value* builtin_max(int argc, Value** args);
Value* builtin_range(int argc, Value** args);
Value* builtin_map(int argc, Value** args);
Value* builtin_filter(int argc, Value** args);
Value* builtin_reduce(int argc, Value** args);
Value* builtin_foreach(int argc, Value** args);
Value* builtin_sort(int argc, Value** args);
Value* builtin_reverse(int argc, Value** args);
Value* builtin_keys(int argc, Value** args);
Value* builtin_values(int argc, Value** args);
Value* builtin_entries(int argc, Value** args);
Value* builtin_has_key(int argc, Value** args);
Value* builtin_read_file(int argc, Value** args);
Value* builtin_write_file(int argc, Value** args);
Value* builtin_append_file(int argc, Value** args);
Value* builtin_delete_file(int argc, Value** args);
Value* builtin_exists(int argc, Value** args);
Value* builtin_is_file(int argc, Value** args);
Value* builtin_is_dir(int argc, Value** args);
Value* builtin_mkdir(int argc, Value** args);
Value* builtin_rmdir(int argc, Value** args);
Value* builtin_list_dir(int argc, Value** args);
Value* builtin_chdir(int argc, Value** args);
Value* builtin_getcwd(int argc, Value** args);
Value* builtin_getenv(int argc, Value** args);
Value* builtin_setenv(int argc, Value** args);
Value* builtin_exec(int argc, Value** args);
Value* builtin_fetch(int argc, Value** args);
Value* builtin_encode_url(int argc, Value** args);
Value* builtin_decode_url(int argc, Value** args);
Value* builtin_encode_base64(int argc, Value** args);
Value* builtin_decode_base64(int argc, Value** args);
Value* builtin_hash_md5(int argc, Value** args);
Value* builtin_hash_sha1(int argc, Value** args);
Value* builtin_hash_sha256(int argc, Value** args);
Value* builtin_uuid(int argc, Value** args);

// Package Manager Functions
bool pm_init(const char* path);
bool pm_install(const char* package, const char* version);
bool pm_uninstall(const char* package);
bool pm_update(const char* package);
bool pm_update_all(void);
bool pm_search(const char* query);
bool pm_publish(const char* path);
bool pm_list(void);
bool pm_info(const char* package);
bool pm_clean(void);
bool pm_run_script(const char* script);

// CLI Functions
int cli_main(int argc, char** argv);
void cli_print_usage(void);
void cli_print_version(void);
void cli_print_help(const char* command);
int cli_run_file(const char* path, int argc, char** argv);
int cli_run_repl(void);
int cli_build_file(const char* path, const char* output, const char* target);
int cli_test_project(const char* pattern);
int cli_format_files(char** files, int count);
int cli_lint_files(char** files, int count);
int cli_new_project(const char* name, const char* template);
int cli_init_project(const char* path);

#endif // DROY_H
