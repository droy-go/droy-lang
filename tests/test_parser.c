/**
 * Droy Language - Parser Tests
 * =============================
 * Unit tests for the Droy parser
 */

#include <stdio.h>
#include <string.h>
#include <assert.h>
#include "../include/droy.h"

/* Test counter */
static int tests_passed = 0;
static int tests_failed = 0;

/* Test macro */
#define TEST(name) void test_##name()
#define RUN_TEST(name) do { \
    printf("  Running test_%s... ", #name); \
    test_##name(); \
    printf("PASSED\\n"); \
    tests_passed++; \
} while(0)

#define ASSERT(cond) do { \
    if (!(cond)) { \
        printf("FAILED\\n  Assertion failed: %s at line %d\\n", #cond, __LINE__); \
        tests_failed++; \
        return; \
    } \
} while(0)

/* Test 1: Parse variable declaration */
TEST(variable_declaration) {
    const char* input = "set x = 5";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_VAR_DECL);
    
    free_ast(node);
}

/* Test 2: Parse output statement */
TEST(output_statement) {
    const char* input = "em \"Hello\"";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_EMIT);
    
    free_ast(node);
}

/* Test 3: Parse text statement */
TEST(text_statement) {
    const char* input = "text \"World\"";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_TEXT);
    
    free_ast(node);
}

/* Test 4: Parse return statement */
TEST(return_statement) {
    const char* input = "ret @si";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_RETURN);
    
    free_ast(node);
}

/* Test 5: Parse binary expression */
TEST(binary_expression) {
    const char* input = "set sum = 5 + 3";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_VAR_DECL);
    
    free_ast(node);
}

/* Test 6: Parse special variable assignment */
TEST(special_variable_assignment) {
    const char* input = "@si = 100";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    
    free_ast(node);
}

/* Test 7: Parse link statement */
TEST(link_statement) {
    const char* input = "link id: \"test\" api: \"https://example.com\"";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_LINK);
    
    free_ast(node);
}

/* Test 8: Parse block */
TEST(block_statement) {
    const char* input = "block: key(\"main\") { set x = 5 }";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_BLOCK);
    
    free_ast(node);
}

/* Test 9: Parse style block */
TEST(style_block) {
    const char* input = "sty { set color = \"blue\" }";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node = parse_statement(&lexer);
    ASSERT(node != NULL);
    ASSERT(node->type == AST_STYLE);
    
    free_ast(node);
}

/* Test 10: Parse multiple statements */
TEST(multiple_statements) {
    const char* input = "set x = 5\\nset y = 10\\nem x + y";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    ASTNode* node1 = parse_statement(&lexer);
    ASSERT(node1 != NULL);
    ASSERT(node1->type == AST_VAR_DECL);
    free_ast(node1);
    
    ASTNode* node2 = parse_statement(&lexer);
    ASSERT(node2 != NULL);
    ASSERT(node2->type == AST_VAR_DECL);
    free_ast(node2);
    
    ASTNode* node3 = parse_statement(&lexer);
    ASSERT(node3 != NULL);
    ASSERT(node3->type == AST_EMIT);
    free_ast(node3);
}

/* Main test runner */
int main() {
    printf("=====================================\\n");
    printf("Droy Language - Parser Tests\\n");
    printf("=====================================\\n\\n");
    
    RUN_TEST(variable_declaration);
    RUN_TEST(output_statement);
    RUN_TEST(text_statement);
    RUN_TEST(return_statement);
    RUN_TEST(binary_expression);
    RUN_TEST(special_variable_assignment);
    RUN_TEST(link_statement);
    RUN_TEST(block_statement);
    RUN_TEST(style_block);
    RUN_TEST(multiple_statements);
    
    printf("\\n=====================================\\n");
    printf("Results: %d passed, %d failed\\n", tests_passed, tests_failed);
    printf("=====================================\\n");
    
    return tests_failed > 0 ? 1 : 0;
}
