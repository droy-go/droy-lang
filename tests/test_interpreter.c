/**
 * Droy Language - Interpreter Tests
 * ==================================
 * Unit tests for the Droy interpreter
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

/* Test 1: Interpret variable declaration */
TEST(variable_declaration) {
    const char* input = "set x = 5";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* x_val = get_variable(&interpreter, "x");
    ASSERT(x_val != NULL);
    ASSERT(x_val->type == VALUE_NUMBER);
    ASSERT(x_val->number == 5);
}

/* Test 2: Interpret string assignment */
TEST(string_assignment) {
    const char* input = "set name = \"Droy\"";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* name_val = get_variable(&interpreter, "name");
    ASSERT(name_val != NULL);
    ASSERT(name_val->type == VALUE_STRING);
    ASSERT(strcmp(name_val->string, "Droy") == 0);
}

/* Test 3: Interpret special variable */
TEST(special_variable) {
    const char* input = "@si = 100";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* si_val = get_variable(&interpreter, "@si");
    ASSERT(si_val != NULL);
    ASSERT(si_val->type == VALUE_NUMBER);
    ASSERT(si_val->number == 100);
}

/* Test 4: Interpret addition */
TEST(addition) {
    const char* input = "set a = 10\\nset b = 20\\nset sum = a + b";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* sum_val = get_variable(&interpreter, "sum");
    ASSERT(sum_val != NULL);
    ASSERT(sum_val->type == VALUE_NUMBER);
    ASSERT(sum_val->number == 30);
}

/* Test 5: Interpret subtraction */
TEST(subtraction) {
    const char* input = "set a = 50\\nset b = 20\\nset diff = a - b";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* diff_val = get_variable(&interpreter, "diff");
    ASSERT(diff_val != NULL);
    ASSERT(diff_val->type == VALUE_NUMBER);
    ASSERT(diff_val->number == 30);
}

/* Test 6: Interpret multiplication */
TEST(multiplication) {
    const char* input = "set a = 5\\nset b = 6\\nset prod = a * b";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* prod_val = get_variable(&interpreter, "prod");
    ASSERT(prod_val != NULL);
    ASSERT(prod_val->type == VALUE_NUMBER);
    ASSERT(prod_val->number == 30);
}

/* Test 7: Interpret division */
TEST(division) {
    const char* input = "set a = 100\\nset b = 4\\nset quot = a / b";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* quot_val = get_variable(&interpreter, "quot");
    ASSERT(quot_val != NULL);
    ASSERT(quot_val->type == VALUE_NUMBER);
    ASSERT(quot_val->number == 25);
}

/* Test 8: Interpret string concatenation */
TEST(string_concatenation) {
    const char* input = "set first = \"Hello\"\\nset second = \"World\"\\nset result = first + \" \" + second";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* result_val = get_variable(&interpreter, "result");
    ASSERT(result_val != NULL);
    ASSERT(result_val->type == VALUE_STRING);
    ASSERT(strcmp(result_val->string, "Hello World") == 0);
}

/* Test 9: Interpret complex expression */
TEST(complex_expression) {
    const char* input = "set x = 5\\nset y = 3\\nset z = (x + y) * 2";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type != VALUE_ERROR);
    
    Value* z_val = get_variable(&interpreter, "z");
    ASSERT(z_val != NULL);
    ASSERT(z_val->type == VALUE_NUMBER);
    ASSERT(z_val->number == 16);
}

/* Test 10: Interpret return statement */
TEST(return_statement) {
    const char* input = "set x = 10\\nret x";
    Interpreter interpreter;
    init_interpreter(&interpreter);
    
    Value result = interpret(&interpreter, input);
    ASSERT(result.type == VALUE_NUMBER);
    ASSERT(result.number == 10);
}

/* Main test runner */
int main() {
    printf("=====================================\\n");
    printf("Droy Language - Interpreter Tests\\n");
    printf("=====================================\\n\\n");
    
    RUN_TEST(variable_declaration);
    RUN_TEST(string_assignment);
    RUN_TEST(special_variable);
    RUN_TEST(addition);
    RUN_TEST(subtraction);
    RUN_TEST(multiplication);
    RUN_TEST(division);
    RUN_TEST(string_concatenation);
    RUN_TEST(complex_expression);
    RUN_TEST(return_statement);
    
    printf("\\n=====================================\\n");
    printf("Results: %d passed, %d failed\\n", tests_passed, tests_failed);
    printf("=====================================\\n");
    
    return tests_failed > 0 ? 1 : 0;
}
