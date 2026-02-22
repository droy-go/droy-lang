/**
 * Droy Language - Lexer Tests
 * ============================
 * Unit tests for the Droy lexer
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

/* Test 1: Basic keyword tokenization */
TEST(basic_keywords) {
    const char* input = "set ret em text";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_SET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_RET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_EM);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_TEXT);
}

/* Test 2: Number tokenization */
TEST(number_tokens) {
    const char* input = "123 45.67 0";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_NUMBER);
    ASSERT(strcmp(token.value, "123") == 0);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_NUMBER);
    ASSERT(strcmp(token.value, "45.67") == 0);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_NUMBER);
    ASSERT(strcmp(token.value, "0") == 0);
}

/* Test 3: String tokenization */
TEST(string_tokens) {
    const char* input = "\"Hello World\" \"Test\"";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_STRING);
    ASSERT(strcmp(token.value, "Hello World") == 0);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_STRING);
    ASSERT(strcmp(token.value, "Test") == 0);
}

/* Test 4: Special variables */
TEST(special_variables) {
    const char* input = "@si @ui @yui @pop @abc";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_SI);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_UI);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_YUI);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_POP);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_ABC);
}

/* Test 5: Operators */
TEST(operators) {
    const char* input = "+ - * / =";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_PLUS);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_MINUS);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_MUL);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_DIV);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_ASSIGN);
}

/* Test 6: Shorthand syntax */
TEST(shorthand_syntax) {
    const char* input = "~s ~r ~e txt t";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_SET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_RET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_EM);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_TEXT);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_TEXT);
}

/* Test 7: Comments */
TEST(comments) {
    const char* input = "// This is a comment\\nset x = 5";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_SET);
}

/* Test 8: Empty input */
TEST(empty_input) {
    const char* input = "";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_EOF);
}

/* Test 9: Whitespace handling */
TEST(whitespace) {
    const char* input = "set    x   =    5";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_SET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_IDENTIFIER);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_ASSIGN);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_NUMBER);
}

/* Test 10: Complex expression */
TEST(complex_expression) {
    const char* input = "set result = @si + @ui * 10";
    Lexer lexer;
    init_lexer(&lexer, input);
    
    Token token = next_token(&lexer);
    ASSERT(token.type == TOKEN_SET);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_IDENTIFIER);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_ASSIGN);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_SI);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_PLUS);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_VAR_UI);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_MUL);
    
    token = next_token(&lexer);
    ASSERT(token.type == TOKEN_NUMBER);
}

/* Main test runner */
int main() {
    printf("=====================================\\n");
    printf("Droy Language - Lexer Tests\\n");
    printf("=====================================\\n\\n");
    
    RUN_TEST(basic_keywords);
    RUN_TEST(number_tokens);
    RUN_TEST(string_tokens);
    RUN_TEST(special_variables);
    RUN_TEST(operators);
    RUN_TEST(shorthand_syntax);
    RUN_TEST(comments);
    RUN_TEST(empty_input);
    RUN_TEST(whitespace);
    RUN_TEST(complex_expression);
    
    printf("\\n=====================================\\n");
    printf("Results: %d passed, %d failed\\n", tests_passed, tests_failed);
    printf("=====================================\\n");
    
    return tests_failed > 0 ? 1 : 0;
}
