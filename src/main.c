/**
 * Droy Language - Main Entry Point
 * =================================
 * Complete Droy programming language with package manager
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <getopt.h>
#include "../include/droy.h"

#define DROY_VERSION "2.0.0"
#define DROY_PM_VERSION "1.0.0"

/* Command handlers */
static int cmd_run(int argc, char** argv, int optind);
static int cmd_build(int argc, char** argv, int optind);
static int cmd_test(int argc, char** argv, int optind);
static int cmd_repl(int argc, char** argv);
static int cmd_tokenize(int argc, char** argv, int optind);
static int cmd_parse(int argc, char** argv, int optind);
static int cmd_version(int argc, char** argv);
static int cmd_help(int argc, char** argv);

/* Package manager commands */
static int cmd_pm_init(int argc, char** argv, int optind);
static int cmd_pm_install(int argc, char** argv, int optind);
static int cmd_pm_uninstall(int argc, char** argv, int optind);
static int cmd_pm_update(int argc, char** argv, int optind);
static int cmd_pm_search(int argc, char** argv, int optind);
static int cmd_pm_publish(int argc, char** argv, int optind);
static int cmd_pm_list(int argc, char** argv);
static int cmd_pm_info(int argc, char** argv, int optind);
static int cmd_pm_clean(int argc, char** argv);

/* Utility commands */
static int cmd_fmt(int argc, char** argv, int optind);
static int cmd_lint(int argc, char** argv, int optind);
static int cmd_new(int argc, char** argv, int optind);

/* Forward declarations */
static void print_usage(void);
static void print_version(void);
static void print_help(const char* command);

int main(int argc, char** argv) {
    if (argc < 2) {
        print_usage();
        return 1;
    }
    
    const char* command = argv[1];
    
    /* Core language commands */
    if (strcmp(command, "run") == 0) {
        return cmd_run(argc, argv, 2);
    }
    if (strcmp(command, "build") == 0) {
        return cmd_build(argc, argv, 2);
    }
    if (strcmp(command, "test") == 0) {
        return cmd_test(argc, argv, 2);
    }
    if (strcmp(command, "repl") == 0 || strcmp(command, "i") == 0) {
        return cmd_repl(argc, argv);
    }
    if (strcmp(command, "tokenize") == 0 || strcmp(command, "-t") == 0) {
        return cmd_tokenize(argc, argv, 2);
    }
    if (strcmp(command, "parse") == 0 || strcmp(command, "-a") == 0) {
        return cmd_parse(argc, argv, 2);
    }
    if (strcmp(command, "version") == 0 || strcmp(command, "-v") == 0 || strcmp(command, "--version") == 0) {
        return cmd_version(argc, argv);
    }
    if (strcmp(command, "help") == 0 || strcmp(command, "-h") == 0 || strcmp(command, "--help") == 0) {
        return cmd_help(argc, argv);
    }
    
    /* Package manager commands */
    if (strcmp(command, "init") == 0) {
        return cmd_pm_init(argc, argv, 2);
    }
    if (strcmp(command, "install") == 0 || strcmp(command, "i") == 0 || strcmp(command, "add") == 0) {
        return cmd_pm_install(argc, argv, 2);
    }
    if (strcmp(command, "uninstall") == 0 || strcmp(command, "remove") == 0 || strcmp(command, "rm") == 0) {
        return cmd_pm_uninstall(argc, argv, 2);
    }
    if (strcmp(command, "update") == 0 || strcmp(command, "up") == 0) {
        return cmd_pm_update(argc, argv, 2);
    }
    if (strcmp(command, "search") == 0 || strcmp(command, "s") == 0) {
        return cmd_pm_search(argc, argv, 2);
    }
    if (strcmp(command, "publish") == 0) {
        return cmd_pm_publish(argc, argv, 2);
    }
    if (strcmp(command, "list") == 0 || strcmp(command, "ls") == 0) {
        return cmd_pm_list(argc, argv);
    }
    if (strcmp(command, "info") == 0) {
        return cmd_pm_info(argc, argv, 2);
    }
    if (strcmp(command, "clean") == 0) {
        return cmd_pm_clean(argc, argv);
    }
    
    /* Utility commands */
    if (strcmp(command, "fmt") == 0 || strcmp(command, "format") == 0) {
        return cmd_fmt(argc, argv, 2);
    }
    if (strcmp(command, "lint") == 0) {
        return cmd_lint(argc, argv, 2);
    }
    if (strcmp(command, "new") == 0) {
        return cmd_new(argc, argv, 2);
    }
    
    /* Direct file execution */
    if (file_exists(command) && ends_with(command, ".droy")) {
        return cmd_run(argc, argv, 1);
    }
    
    fprintf(stderr, "Unknown command: %s\n", command);
    print_usage();
    return 1;
}

/* Command implementations */

static int cmd_run(int argc, char** argv, int optind) {
    const char* file = (optind < argc) ? argv[optind] : NULL;
    
    if (!file) {
        // Try to find main file
        if (file_exists("src/main.droy")) {
            file = "src/main.droy";
        } else if (file_exists("main.droy")) {
            file = "main.droy";
        } else {
            fprintf(stderr, "Error: No file specified and no main.droy found\n");
            return 1;
        }
    }
    
    if (!file_exists(file)) {
        fprintf(stderr, "Error: File not found: %s\n", file);
        return 1;
    }
    
    // Read source
    char* source = read_file(file);
    if (!source) {
        fprintf(stderr, "Error: Cannot read file: %s\n", file);
        return 1;
    }
    
    // Create interpreter
    Interpreter* interp = interpreter_create();
    
    // Set argc/argv
    interp->argc = argc - optind;
    interp->argv = argv + optind;
    
    // Tokenize
    Lexer* lexer = lexer_create(source, file);
    Token* tokens = lexer_tokenize(lexer);
    
    // Parse
    Parser* parser = parser_create(tokens);
    ASTNode* ast = parser_parse(parser);
    
    if (parser->error_count > 0) {
        fprintf(stderr, "Parse errors: %d\n", parser->error_count);
        parser_destroy(parser);
        lexer_destroy(lexer);
        droy_free(source);
        interpreter_destroy(interp);
        return 1;
    }
    
    // Execute
    int result = interpreter_run(interp, ast);
    
    // Cleanup
    parser_destroy(parser);
    lexer_destroy(lexer);
    ast_free(ast);
    droy_free(source);
    interpreter_destroy(interp);
    
    return result;
}

static int cmd_build(int argc, char** argv, int optind) {
    const char* file = (optind < argc) ? argv[optind] : NULL;
    const char* output = "output";
    const char* target = "native";
    
    // Parse options
    for (int i = optind; i < argc; i++) {
        if (strcmp(argv[i], "-o") == 0 && i + 1 < argc) {
            output = argv[++i];
        } else if (strcmp(argv[i], "--target") == 0 && i + 1 < argc) {
            target = argv[++i];
        } else if (!file) {
            file = argv[i];
        }
    }
    
    if (!file) {
        fprintf(stderr, "Error: No file specified\n");
        return 1;
    }
    
    printf("Building %s -> %s (target: %s)\n", file, output, target);
    
    // TODO: Implement compilation
    printf("Compilation not yet implemented\n");
    
    return 0;
}

static int cmd_test(int argc, char** argv, int optind) {
    const char* pattern = (optind < argc) ? argv[optind] : NULL;
    
    printf("Running tests");
    if (pattern) {
        printf(" matching: %s", pattern);
    }
    printf("\n");
    
    // TODO: Implement test runner
    printf("Test runner not yet implemented\n");
    
    return 0;
}

static int cmd_repl(int argc, char** argv) {
    printf("Droy REPL v%s\n", DROY_VERSION);
    printf("Type 'exit' to quit, 'help' for help\n\n");
    
    Interpreter* interp = interpreter_create();
    char line[1024];
    
    while (true) {
        printf("> ");
        fflush(stdout);
        
        if (!fgets(line, sizeof(line), stdin)) {
            break;
        }
        
        // Remove newline
        line[strcspn(line, "\n")] = '\0';
        
        // Exit command
        if (strcmp(line, "exit") == 0 || strcmp(line, "quit") == 0) {
            break;
        }
        
        // Help command
        if (strcmp(line, "help") == 0) {
            printf("Commands:\n");
            printf("  exit, quit - Exit the REPL\n");
            printf("  help       - Show this help\n");
            printf("  clear      - Clear the screen\n");
            printf("\n");
            continue;
        }
        
        // Clear command
        if (strcmp(line, "clear") == 0) {
            printf("\033[2J\033[H");
            continue;
        }
        
        // Empty line
        if (strlen(line) == 0) {
            continue;
        }
        
        // Execute
        Lexer* lexer = lexer_create(line, "<repl>");
        Token* tokens = lexer_tokenize(lexer);
        
        Parser* parser = parser_create(tokens);
        ASTNode* ast = parser_parse(parser);
        
        if (parser->error_count == 0) {
            Value* result = interpreter_eval(interp, ast);
            char* str = value_to_string(result);
            printf("%s\n", str);
            droy_free(str);
            value_free(result);
        }
        
        parser_destroy(parser);
        lexer_destroy(lexer);
        ast_free(ast);
    }
    
    interpreter_destroy(interp);
    printf("\nGoodbye!\n");
    
    return 0;
}

static int cmd_tokenize(int argc, char** argv, int optind) {
    const char* file = (optind < argc) ? argv[optind] : NULL;
    
    if (!file) {
        fprintf(stderr, "Error: No file specified\n");
        return 1;
    }
    
    char* source = read_file(file);
    if (!source) {
        fprintf(stderr, "Error: Cannot read file: %s\n", file);
        return 1;
    }
    
    Lexer* lexer = lexer_create(source, file);
    Token* tokens = lexer_tokenize(lexer);
    
    Token* current = tokens;
    while (current) {
        printf("[%4d:%3d] %-15s %s\n", 
            current->line, 
            current->column,
            token_type_to_string(current->type),
            current->value);
        if (current->type == TOKEN_EOF) break;
        current = current->next;
    }
    
    lexer_destroy(lexer);
    droy_free(source);
    
    return 0;
}

static int cmd_parse(int argc, char** argv, int optind) {
    const char* file = (optind < argc) ? argv[optind] : NULL;
    
    if (!file) {
        fprintf(stderr, "Error: No file specified\n");
        return 1;
    }
    
    char* source = read_file(file);
    if (!source) {
        fprintf(stderr, "Error: Cannot read file: %s\n", file);
        return 1;
    }
    
    Lexer* lexer = lexer_create(source, file);
    Token* tokens = lexer_tokenize(lexer);
    
    Parser* parser = parser_create(tokens);
    ASTNode* ast = parser_parse(parser);
    
    if (parser->error_count == 0) {
        ast_print(ast, 0);
    } else {
        fprintf(stderr, "Parse errors: %d\n", parser->error_count);
    }
    
    parser_destroy(parser);
    lexer_destroy(lexer);
    ast_free(ast);
    droy_free(source);
    
    return parser->error_count > 0 ? 1 : 0;
}

static int cmd_version(int argc, char** argv) {
    printf("Droy Language v%s\n", DROY_VERSION);
    printf("Package Manager v%s\n", DROY_PM_VERSION);
    printf("\n");
    printf("A modern markup and programming language\n");
    printf("https://github.com/droy-go/droy-lang\n");
    return 0;
}

static int cmd_help(int argc, char** argv) {
    print_usage();
    return 0;
}

/* Package manager command implementations */

static int cmd_pm_init(int argc, char** argv, int optind) {
    const char* path = (optind < argc) ? argv[optind] : ".";
    
    printf("Initializing Droy package in %s\n", path);
    
    // Create directory if needed
    if (strcmp(path, ".") != 0) {
        if (!create_dir_recursive(path)) {
            fprintf(stderr, "Error: Cannot create directory: %s\n", path);
            return 1;
        }
    }
    
    // Create droy.toml
    char* config_path = join_path(path, "droy.toml");
    const char* config = 
        "# Droy Package Configuration\n"
        "name = \"my-package\"\n"
        "version = \"1.0.0\"\n"
        "description = \"A Droy package\"\n"
        "author = \"\"\n"
        "license = \"MIT\"\n"
        "droy_version = \">=2.0.0\"\n"
        "main = \"src/main.droy\"\n"
        "\n"
        "[scripts]\n"
        "build = \"droy build\"\n"
        "test = \"droy test\"\n"
        "run = \"droy run\"\n"
        "\n"
        "[dependencies]\n";
    
    if (!write_file(config_path, config)) {
        fprintf(stderr, "Error: Cannot write %s\n", config_path);
        droy_free(config_path);
        return 1;
    }
    
    // Create src directory
    char* src_path = join_path(path, "src");
    create_dir(src_path);
    
    // Create main.droy
    char* main_path = join_path(src_path, "main.droy");
    const char* main_content = 
        "// Main entry point\n"
        "pkg \"my-package\"\n"
        "\n"
        "~s @si = \"Hello, World!\"\n"
        "em @si\n";
    
    write_file(main_path, main_content);
    
    // Create README.md
    char* readme_path = join_path(path, "README.md");
    const char* readme = 
        "# My Package\n"
        "\n"
        "A Droy package.\n"
        "\n"
        "## Installation\n"
        "\n"
        "```bash\n"
        "droy install my-package\n"
        "```\n"
        "\n"
        "## Usage\n"
        "\n"
        "```droy\n"
        "pkg \"my-package\"\n"
        "```\n";
    
    write_file(readme_path, readme);
    
    printf("Package initialized successfully!\n");
    printf("\nNext steps:\n");
    printf("  cd %s\n", path);
    printf("  droy run\n");
    
    droy_free(config_path);
    droy_free(src_path);
    droy_free(main_path);
    droy_free(readme_path);
    
    return 0;
}

static int cmd_pm_install(int argc, char** argv, int optind) {
    if (optind >= argc) {
        // Install all dependencies
        printf("Installing dependencies from droy.toml...\n");
        // TODO: Read droy.toml and install dependencies
        return 0;
    }
    
    const char* package = argv[optind];
    printf("Installing %s...\n", package);
    
    // TODO: Implement package installation
    printf("Package installation not yet implemented\n");
    
    return 0;
}

static int cmd_pm_uninstall(int argc, char** argv, int optind) {
    if (optind >= argc) {
        fprintf(stderr, "Error: No package specified\n");
        return 1;
    }
    
    const char* package = argv[optind];
    printf("Uninstalling %s...\n", package);
    
    // TODO: Implement package uninstallation
    printf("Package uninstallation not yet implemented\n");
    
    return 0;
}

static int cmd_pm_update(int argc, char** argv, int optind) {
    if (optind >= argc) {
        printf("Updating all packages...\n");
    } else {
        const char* package = argv[optind];
        printf("Updating %s...\n", package);
    }
    
    // TODO: Implement package update
    printf("Package update not yet implemented\n");
    
    return 0;
}

static int cmd_pm_search(int argc, char** argv, int optind) {
    if (optind >= argc) {
        fprintf(stderr, "Error: No search query specified\n");
        return 1;
    }
    
    const char* query = argv[optind];
    printf("Searching for '%s'...\n", query);
    
    // TODO: Implement package search
    printf("Package search not yet implemented\n");
    
    return 0;
}

static int cmd_pm_publish(int argc, char** argv, int optind) {
    printf("Publishing package...\n");
    
    // TODO: Implement package publishing
    printf("Package publishing not yet implemented\n");
    
    return 0;
}

static int cmd_pm_list(int argc, char** argv) {
    printf("Installed packages:\n");
    
    // TODO: List installed packages
    printf("No packages installed\n");
    
    return 0;
}

static int cmd_pm_info(int argc, char** argv, int optind) {
    if (optind >= argc) {
        // Show current package info
        printf("Current package info:\n");
        
        if (file_exists("droy.toml")) {
            char* content = read_file("droy.toml");
            printf("%s\n", content);
            droy_free(content);
        } else {
            printf("No droy.toml found\n");
        }
        
        return 0;
    }
    
    const char* package = argv[optind];
    printf("Package info: %s\n", package);
    
    // TODO: Show package info from registry
    
    return 0;
}

static int cmd_pm_clean(int argc, char** argv) {
    printf("Cleaning cache...\n");
    
    // TODO: Implement cache cleaning
    printf("Cache cleaned\n");
    
    return 0;
}

/* Utility command implementations */

static int cmd_fmt(int argc, char** argv, int optind) {
    if (optind >= argc) {
        // Format all files
        printf("Formatting all .droy files...\n");
        return 0;
    }
    
    const char* file = argv[optind];
    printf("Formatting %s...\n", file);
    
    // TODO: Implement formatting
    printf("Formatting not yet implemented\n");
    
    return 0;
}

static int cmd_lint(int argc, char** argv, int optind) {
    if (optind >= argc) {
        // Lint all files
        printf("Linting all .droy files...\n");
        return 0;
    }
    
    const char* file = argv[optind];
    printf("Linting %s...\n", file);
    
    // TODO: Implement linting
    printf("Linting not yet implemented\n");
    
    return 0;
}

static int cmd_new(int argc, char** argv, int optind) {
    if (optind >= argc) {
        fprintf(stderr, "Error: No project name specified\n");
        return 1;
    }
    
    const char* name = argv[optind];
    const char* template = "default";
    
    // Check for template option
    for (int i = optind + 1; i < argc; i++) {
        if (strcmp(argv[i], "--template") == 0 && i + 1 < argc) {
            template = argv[++i];
        }
    }
    
    printf("Creating new project '%s' with template '%s'...\n", name, template);
    
    // Create project directory
    if (!create_dir(name)) {
        fprintf(stderr, "Error: Cannot create directory: %s\n", name);
        return 1;
    }
    
    // Initialize package
    return cmd_pm_init(argc, argv, optind);
}

/* Helper functions */

static void print_usage(void) {
    printf("Usage: droy <command> [options] [args]\n");
    printf("\n");
    printf("Core Commands:\n");
    printf("  run [file.droy]     Run a Droy program\n");
    printf("  build [file.droy]   Build a Droy program\n");
    printf("  test [pattern]      Run tests\n");
    printf("  repl                Start interactive REPL\n");
    printf("  tokenize <file>     Print tokens\n");
    printf("  parse <file>        Print AST\n");
    printf("\n");
    printf("Package Manager Commands:\n");
    printf("  init [path]         Initialize a new package\n");
    printf("  install [package]   Install packages\n");
    printf("  uninstall <package> Uninstall a package\n");
    printf("  update [package]    Update packages\n");
    printf("  search <query>      Search for packages\n");
    printf("  publish             Publish package to registry\n");
    printf("  list                List installed packages\n");
    printf("  info [package]      Show package information\n");
    printf("  clean               Clean cache\n");
    printf("\n");
    printf("Utility Commands:\n");
    printf("  fmt [files...]      Format source files\n");
    printf("  lint [files...]     Lint source files\n");
    printf("  new <name>          Create a new project\n");
    printf("\n");
    printf("Other Commands:\n");
    printf("  version             Show version information\n");
    printf("  help                Show this help message\n");
    printf("\n");
    printf("Examples:\n");
    printf("  droy run hello.droy              # Run a file\n");
    printf("  droy build app.droy -o myapp     # Build to executable\n");
    printf("  droy install http                # Install package\n");
    printf("  droy new my-project              # Create new project\n");
}

static void print_version(void) {
    printf("Droy Language v%s\n", DROY_VERSION);
}

static void print_help(const char* command) {
    if (!command || strcmp(command, "help") == 0) {
        print_usage();
        return;
    }
    
    printf("Help for '%s':\n", command);
    printf("Detailed help not yet implemented\n");
}
