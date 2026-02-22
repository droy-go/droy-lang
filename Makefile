# Droy Language - Makefile
# ========================

# Compiler settings
CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2 -I./include
CFLAGS_DEBUG = -Wall -Wextra -std=c11 -g -O0 -DDROY_DEBUG -I./include
LDFLAGS = -lm

# Directories
SRC_DIR = src
OBJ_DIR = obj
BIN_DIR = bin
LIB_DIR = lib
TEST_DIR = tests

# Source files
LEXER_SRC = $(SRC_DIR)/lexer/lexer.c
PARSER_SRC = $(SRC_DIR)/parser/parser.c
INTERPRETER_SRC = $(SRC_DIR)/interpreter/interpreter.c \
                  $(SRC_DIR)/interpreter/value.c \
                  $(SRC_DIR)/interpreter/scope.c
UTILS_SRC = $(SRC_DIR)/utils/utils.c
BUILTINS_SRC = $(SRC_DIR)/interpreter/builtins.c
MAIN_SRC = $(SRC_DIR)/main.c

SOURCES = $(LEXER_SRC) $(PARSER_SRC) $(INTERPRETER_SRC) $(UTILS_SRC) $(BUILTINS_SRC) $(MAIN_SRC)

# Object files
OBJECTS = $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SOURCES))

# Target executable
TARGET = $(BIN_DIR)/droy

# Default target
.PHONY: all clean install test debug release

all: $(TARGET)

# Create directories
$(OBJ_DIR):
	@mkdir -p $(OBJ_DIR)/lexer
	@mkdir -p $(OBJ_DIR)/parser
	@mkdir -p $(OBJ_DIR)/interpreter
	@mkdir -p $(OBJ_DIR)/utils

$(BIN_DIR):
	@mkdir -p $(BIN_DIR)

$(LIB_DIR):
	@mkdir -p $(LIB_DIR)

# Build target
$(TARGET): $(OBJ_DIR) $(BIN_DIR) $(OBJECTS)
	$(CC) $(OBJECTS) -o $(TARGET) $(LDFLAGS)
	@echo "Built: $(TARGET)"

# Object file rules
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Debug build
debug: CFLAGS = $(CFLAGS_DEBUG)
debug: clean $(TARGET)

# Release build
release: CFLAGS += -DNDEBUG
release: clean $(TARGET)

# Static library
$(LIB_DIR)/libdroy.a: $(OBJ_DIR) $(LIB_DIR) $(filter-out $(OBJ_DIR)/main.o,$(OBJECTS))
	ar rcs $@ $(filter-out $(OBJ_DIR)/main.o,$(OBJECTS))
	@echo "Built: $@"

lib: $(LIB_DIR)/libdroy.a

# Shared library
$(LIB_DIR)/libdroy.so: $(OBJ_DIR) $(LIB_DIR) $(filter-out $(OBJ_DIR)/main.o,$(OBJECTS))
	$(CC) -shared -o $@ $(filter-out $(OBJ_DIR)/main.o,$(OBJECTS)) $(LDFLAGS)
	@echo "Built: $@"

shared: $(LIB_DIR)/libdroy.so

# Tests
test: $(TARGET)
	@echo "Running tests..."
	@for test in $(TEST_DIR)/*.droy; do \
		if [ -f "$$test" ]; then \
			echo "Testing: $$test"; \
			$(TARGET) run "$$test" || exit 1; \
		fi \
	done
	@echo "All tests passed!"

# Clean
clean:
	@rm -rf $(OBJ_DIR)
	@rm -rf $(BIN_DIR)
	@rm -rf $(LIB_DIR)
	@echo "Cleaned build files"

# Install
PREFIX ?= /usr/local

install: $(TARGET)
	@install -d $(PREFIX)/bin
	@install -m 755 $(TARGET) $(PREFIX)/bin/
	@install -d $(PREFIX)/lib/droy
	@cp -r include $(PREFIX)/lib/droy/
	@echo "Installed to $(PREFIX)/bin/droy"

uninstall:
	@rm -f $(PREFIX)/bin/droy
	@rm -rf $(PREFIX)/lib/droy
	@echo "Uninstalled"

# Development helpers
run: $(TARGET)
	$(TARGET) run

repl: $(TARGET)
	$(TARGET) repl

fmt:
	@find $(SRC_DIR) -name "*.c" -o -name "*.h" | xargs clang-format -i
	@echo "Formatted source files"

# Documentation
docs:
	@echo "Generating documentation..."
	@mkdir -p docs/api
	@echo "Documentation generated in docs/"

# Package manager helpers
init: $(TARGET)
	$(TARGET) init

install-pkg: $(TARGET)
	$(TARGET) install

# Help
help:
	@echo "Droy Language Build System"
	@echo ""
	@echo "Targets:"
	@echo "  all       - Build the Droy compiler (default)"
	@echo "  debug     - Build with debug symbols"
	@echo "  release   - Build optimized release version"
	@echo "  lib       - Build static library"
	@echo "  shared    - Build shared library"
	@echo "  test      - Run tests"
	@echo "  clean     - Remove build files"
	@echo "  install   - Install to system"
	@echo "  uninstall - Remove from system"
	@echo "  fmt       - Format source code"
	@echo "  docs      - Generate documentation"
	@echo "  help      - Show this help"
	@echo ""
	@echo "Variables:"
	@echo "  CC        - C compiler (default: gcc)"
	@echo "  PREFIX    - Installation prefix (default: /usr/local)"

# Dependencies
$(OBJ_DIR)/lexer/lexer.o: $(SRC_DIR)/lexer/lexer.c include/droy.h
$(OBJ_DIR)/parser/parser.o: $(SRC_DIR)/parser/parser.c include/droy.h
$(OBJ_DIR)/interpreter/interpreter.o: $(SRC_DIR)/interpreter/interpreter.c include/droy.h
$(OBJ_DIR)/interpreter/value.o: $(SRC_DIR)/interpreter/value.c include/droy.h
$(OBJ_DIR)/interpreter/scope.o: $(SRC_DIR)/interpreter/scope.c include/droy.h
$(OBJ_DIR)/interpreter/builtins.o: $(SRC_DIR)/interpreter/builtins.c include/droy.h
$(OBJ_DIR)/utils/utils.o: $(SRC_DIR)/utils/utils.c include/droy.h
$(OBJ_DIR)/main.o: $(SRC_DIR)/main.c include/droy.h
