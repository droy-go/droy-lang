# =============================================================================
# Droy Helper Language - Makefile
# =============================================================================
# A comprehensive build system for the Droy programming language compiler
# with LLVM backend support
#
# Usage:
#   make              - Build the compiler
#   make test         - Build and run tests
#   make clean        - Clean build artifacts
#   make install      - Install to system
#   make help         - Show all available targets
#
# Variables:
#   CXX               - C++ compiler (default: clang++)
#   CC                - C compiler (default: clang)
#   LLVM_CONFIG       - LLVM config tool (default: llvm-config)
#   BUILD_TYPE        - Build type: debug, release (default: release)
# =============================================================================

# =============================================================================
# Compiler Settings
# =============================================================================
CXX ?= clang++
CC ?= clang

# C++ Standard
CXX_STANDARD := c++17

# Base flags
CXXFLAGS := -std=$(CXX_STANDARD) -Wall -Wextra -Wpedantic
CFLAGS := -std=c11 -Wall -Wextra

# Build type detection
BUILD_TYPE ?= release

ifeq ($(BUILD_TYPE),debug)
    CXXFLAGS += -g -O0 -DDEBUG
    CFLAGS += -g -O0 -DDEBUG
else ifeq ($(BUILD_TYPE),release)
    CXXFLAGS += -O3 -DNDEBUG
    CFLAGS += -O3 -DNDEBUG
else ifeq ($(BUILD_TYPE),profile)
    CXXFLAGS += -O2 -g -pg
    CFLAGS += -O2 -g -pg
endif

# =============================================================================
# LLVM Configuration
# =============================================================================
LLVM_CONFIG ?= llvm-config

# Check if LLVM is available
LLVM_AVAILABLE := $(shell $(LLVM_CONFIG) --version 2>/dev/null && echo yes || echo no)

ifeq ($(LLVM_AVAILABLE),yes)
    LLVM_VERSION := $(shell $(LLVM_CONFIG) --version)
    LLVM_CXXFLAGS := $(shell $(LLVM_CONFIG) --cxxflags)
    LLVM_LDFLAGS := $(shell $(LLVM_CONFIG) --ldflags --libs core support analysis transformutils scalar instcombine executionengine mc mcjit target x86codegen x86asmparser x86desc x86info object bitwriter passes ipo vectorize instrumentation interpreter native asmpirnter selectiondag)
    LLVM_FOUND := 1
else
    $(warning LLVM not found. Building without LLVM backend support.)
    LLVM_FOUND := 0
endif

# =============================================================================
# Directory Structure
# =============================================================================
SRCDIR := src
INCDIR := include
LLVMDIR := llvm_backend
OBJDIR := obj
BINDIR := bin
TESTDIR := tests
EXAMPLEDIR := examples
SCRIPTDIR := scripts
BUILDDIR := build

# Create directories
DIRS := $(OBJDIR) $(BINDIR) $(BUILDDIR)

# =============================================================================
# Source Files
# =============================================================================
# Core source files
CORE_SOURCES := $(wildcard $(SRCDIR)/*.cpp)
CORE_OBJECTS := $(patsubst $(SRCDIR)/%.cpp,$(OBJDIR)/%.o,$(CORE_SOURCES))

# LLVM backend sources
ifeq ($(LLVM_FOUND),1)
    LLVM_SOURCES := $(wildcard $(LLVMDIR)/*.cpp)
    LLVM_OBJECTS := $(patsubst $(LLVMDIR)/%.cpp,$(OBJDIR)/%.o,$(LLVM_SOURCES))
else
    LLVM_SOURCES :=
    LLVM_OBJECTS :=
endif

# All objects
OBJECTS := $(CORE_OBJECTS) $(LLVM_OBJECTS)

# Test sources
TEST_CPP_SOURCES := $(wildcard $(TESTDIR)/*.cpp)
TEST_C_SOURCES := $(wildcard $(TESTDIR)/*.c)

# =============================================================================
# Targets
# =============================================================================
TARGET := $(BINDIR)/droy-helper
TEST_TARGET := $(BINDIR)/droy-test
TEST_LEXER := $(BINDIR)/droy-test-lexer
TEST_PARSER := $(BINDIR)/droy-test-parser

# =============================================================================
# Colors for output
# =============================================================================
ifdef NO_COLOR
    COLOR_RESET   :=
    COLOR_RED     :=
    COLOR_GREEN   :=
    COLOR_YELLOW  :=
    COLOR_BLUE    :=
    COLOR_CYAN    :=
else
    COLOR_RESET   := \033[0m
    COLOR_RED     := \033[31m
    COLOR_GREEN   := \033[32m
    COLOR_YELLOW  := \033[33m
    COLOR_BLUE    := \033[34m
    COLOR_CYAN    := \033[36m
endif

# =============================================================================
# Phony Targets
# =============================================================================
.PHONY: all clean test examples install uninstall dirs help \
        debug release profile cmake format lint check \
        test-lexer test-parser test-interpreter test-all \
        coverage docs dist info

# Default target
all: dirs $(TARGET)

# =============================================================================
# Directory Creation
# =============================================================================
dirs:
	@mkdir -p $(DIRS)
	@echo "$(COLOR_GREEN)Created build directories$(COLOR_RESET)"

# =============================================================================
# Main Executable
# =============================================================================
$(TARGET): $(OBJECTS)
	@echo "$(COLOR_CYAN)Linking $@...$(COLOR_RESET)"
	@$(CXX) $(OBJECTS) -o $@ $(LLVM_LDFLAGS)
	@echo "$(COLOR_GREEN)✓ Build complete: $@$(COLOR_RESET)"

# =============================================================================
# Object Files - Core
# =============================================================================
$(OBJDIR)/%.o: $(SRCDIR)/%.cpp | dirs
	@echo "$(COLOR_BLUE)Compiling $<...$(COLOR_RESET)"
	@$(CXX) $(CXXFLAGS) $(LLVM_CXXFLAGS) -I$(INCDIR) -I$(LLVMDIR) -c $< -o $@

# =============================================================================
# Object Files - LLVM Backend
# =============================================================================
$(OBJDIR)/%.o: $(LLVMDIR)/%.cpp | dirs
ifeq ($(LLVM_FOUND),1)
	@echo "$(COLOR_BLUE)Compiling LLVM backend: $<...$(COLOR_RESET)"
	@$(CXX) $(CXXFLAGS) $(LLVM_CXXFLAGS) -I$(INCDIR) -I$(LLVMDIR) -c $< -o $@
else
	@echo "$(COLOR_YELLOW)Skipping LLVM backend (not available)$(COLOR_RESET)"
endif

# =============================================================================
# Test Executables
# =============================================================================
$(TEST_LEXER): $(filter-out $(OBJDIR)/main.o,$(OBJECTS)) $(TESTDIR)/test_lexer.cpp | dirs
	@echo "$(COLOR_CYAN)Building lexer test...$(COLOR_RESET)"
	@$(CXX) $(CXXFLAGS) $(LLVM_CXXFLAGS) -I$(INCDIR) -I$(LLVMDIR) \
		$(TESTDIR)/test_lexer.cpp $(filter-out $(OBJDIR)/main.o,$(OBJECTS)) \
		-o $@ $(LLVM_LDFLAGS)
	@echo "$(COLOR_GREEN)✓ Lexer test built$(COLOR_RESET)"

$(TEST_PARSER): $(filter-out $(OBJDIR)/main.o,$(OBJECTS)) $(TESTDIR)/test_parser.cpp | dirs
	@echo "$(COLOR_CYAN)Building parser test...$(COLOR_RESET)"
	@$(CXX) $(CXXFLAGS) $(LLVM_CXXFLAGS) -I$(INCDIR) -I$(LLVMDIR) \
		$(TESTDIR)/test_parser.cpp $(filter-out $(OBJDIR)/main.o,$(OBJECTS)) \
		-o $@ $(LLVM_LDFLAGS)
	@echo "$(COLOR_GREEN)✓ Parser test built$(COLOR_RESET)"

# =============================================================================
# Build Variants
# =============================================================================
debug:
	@$(MAKE) BUILD_TYPE=debug all

release:
	@$(MAKE) BUILD_TYPE=release all

profile:
	@$(MAKE) BUILD_TYPE=profile all

# =============================================================================
# CMake Build
# =============================================================================
cmake:
	@mkdir -p $(BUILDDIR)
	@cd $(BUILDDIR) && cmake .. -DCMAKE_BUILD_TYPE=$(shell echo $(BUILD_TYPE) | tr '[:lower:]' '[:upper:]')
	@cd $(BUILDDIR) && $(MAKE)

cmake-clean:
	@rm -rf $(BUILDDIR)
	@echo "$(COLOR_GREEN)CMake build directory cleaned$(COLOR_RESET)"

# =============================================================================
# Testing
# =============================================================================
test: test-all

test-all: $(TEST_LEXER) $(TEST_PARSER)
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)  Running All Tests$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@$(MAKE) test-lexer
	@echo ""
	@$(MAKE) test-parser

test-lexer: $(TEST_LEXER)
	@echo "$(COLOR_CYAN)Running lexer tests...$(COLOR_RESET)"
	@./$(TEST_LEXER) lexer

test-parser: $(TEST_PARSER)
	@echo "$(COLOR_CYAN)Running parser tests...$(COLOR_RESET)"
	@./$(TEST_PARSER) parser

test-interpreter:
	@if [ -f $(TESTDIR)/test_interpreter.c ]; then \
		echo "$(COLOR_CYAN)Building interpreter tests...$(COLOR_RESET)"; \
		$(CC) $(CFLAGS) -I$(INCDIR) $(TESTDIR)/test_interpreter.c -o $(BINDIR)/test-interpreter; \
		./$(BINDIR)/test-interpreter; \
	else \
		echo "$(COLOR_YELLOW)Interpreter tests not found$(COLOR_RESET)"; \
	fi

# =============================================================================
# Examples
# =============================================================================
examples: $(TARGET)
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)  Running Example Programs$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@for file in $(EXAMPLEDIR)/*.droy; do \
		if [ -f "$$file" ]; then \
			echo ""; \
			echo "$(COLOR_YELLOW)=== $$file ===$(COLOR_RESET)"; \
			$(TARGET) "$$file" -o "$(BINDIR)/$$(basename $$file .droy).ll"; \
		fi \
	done

# =============================================================================
# Code Quality
# =============================================================================
format:
	@echo "$(COLOR_CYAN)Formatting source files...$(COLOR_RESET)"
	@find $(SRCDIR) $(INCDIR) $(LLVMDIR) $(TESTDIR) -name "*.cpp" -o -name "*.h" -o -name "*.c" 2>/dev/null | \
		xargs -I {} sh -c 'echo "Formatting {}" && clang-format -i {} 2>/dev/null || true'
	@echo "$(COLOR_GREEN)✓ Formatting complete$(COLOR_RESET)"

lint:
	@echo "$(COLOR_CYAN)Running static analysis...$(COLOR_RESET)"
	@cppcheck --enable=all --error-exitcode=0 \
		--suppress=missingIncludeSystem \
		--suppress=unusedFunction \
		$(SRCDIR) $(INCDIR) 2>&1 | head -50 || true
	@echo "$(COLOR_GREEN)✓ Static analysis complete$(COLOR_RESET)"

check: lint
	@echo "$(COLOR_CYAN)Running all checks...$(COLOR_RESET)"
	@$(MAKE) test

# =============================================================================
# Coverage
# =============================================================================
coverage:
	@echo "$(COLOR_CYAN)Building with coverage...$(COLOR_RESET)"
	@$(MAKE) clean
	@$(MAKE) CXXFLAGS="$(CXXFLAGS) --coverage -O0" all test
	@echo "$(COLOR_GREEN)✓ Coverage data generated$(COLOR_RESET)"
	@echo "Run 'gcov' or 'lcov' to generate reports"

# =============================================================================
# Documentation
# =============================================================================
docs:
	@if command -v doxygen >/dev/null 2>&1; then \
		echo "$(COLOR_CYAN)Generating documentation...$(COLOR_RESET)"; \
		doxygen docs/Doxyfile 2>/dev/null || echo "$(COLOR_YELLOW)Doxyfile not found$(COLOR_RESET)"; \
	else \
		echo "$(COLOR_YELLOW)Doxygen not installed$(COLOR_RESET)"; \
	fi

# =============================================================================
# Installation
# =============================================================================
PREFIX ?= /usr/local

install: $(TARGET)
	@echo "$(COLOR_CYAN)Installing to $(PREFIX)...$(COLOR_RESET)"
	@install -d $(PREFIX)/bin
	@install -d $(PREFIX)/include/droy
	@install -m 755 $(TARGET) $(PREFIX)/bin/
	@install -m 644 $(INCDIR)/*.h $(PREFIX)/include/droy/ 2>/dev/null || true
	@echo "$(COLOR_GREEN)✓ Installation complete$(COLOR_RESET)"

uninstall:
	@echo "$(COLOR_CYAN)Uninstalling from $(PREFIX)...$(COLOR_RESET)"
	@rm -f $(PREFIX)/bin/droy-helper
	@rm -rf $(PREFIX)/include/droy
	@echo "$(COLOR_GREEN)✓ Uninstall complete$(COLOR_RESET)"

# =============================================================================
# Distribution
# =============================================================================
dist: clean
	@echo "$(COLOR_CYAN)Creating distribution archive...$(COLOR_RESET)"
	@mkdir -p dist
	@tar -czf dist/droy-lang-$(shell date +%Y%m%d).tar.gz \
		--exclude='.git' --exclude='dist' --exclude='obj' --exclude='bin' \
		--exclude='build' .
	@echo "$(COLOR_GREEN)✓ Distribution created in dist/$(COLOR_RESET)"

# =============================================================================
# Clean
# =============================================================================
clean:
	@echo "$(COLOR_CYAN)Cleaning build artifacts...$(COLOR_RESET)"
	@rm -rf $(OBJDIR) $(BINDIR) $(BUILDDIR)
	@find . -name "*.o" -delete 2>/dev/null || true
	@find . -name "*.gcov" -delete 2>/dev/null || true
	@find . -name "*.gcda" -delete 2>/dev/null || true
	@find . -name "*.gcno" -delete 2>/dev/null || true
	@echo "$(COLOR_GREEN)✓ Clean complete$(COLOR_RESET)"

distclean: clean cmake-clean
	@rm -rf dist
	@echo "$(COLOR_GREEN)✓ Deep clean complete$(COLOR_RESET)"

# =============================================================================
# Project Info
# =============================================================================
info:
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)  Droy Helper Language - Project Information$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo ""
	@echo "Compiler:       $(CXX)"
	@echo "C++ Standard:   $(CXX_STANDARD)"
	@echo "Build Type:     $(BUILD_TYPE)"
	@echo "LLVM Config:    $(LLVM_CONFIG)"
ifeq ($(LLVM_FOUND),1)
	@echo "LLVM Version:   $(LLVM_VERSION)"
	@echo "LLVM Backend:   Enabled"
else
	@echo "LLVM Backend:   Disabled (not found)"
endif
	@echo ""
	@echo "Directories:"
	@echo "  Source:       $(SRCDIR)"
	@echo "  Include:      $(INCDIR)"
	@echo "  LLVM Backend: $(LLVMDIR)"
	@echo "  Tests:        $(TESTDIR)"
	@echo "  Examples:     $(EXAMPLEDIR)"
	@echo ""
	@echo "Targets:"
	@echo "  Binary:       $(TARGET)"
	@echo "  Test Lexer:   $(TEST_LEXER)"
	@echo "  Test Parser:  $(TEST_PARSER)"

# =============================================================================
# Help
# =============================================================================
help:
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)  Droy Helper Language - Build System$(COLOR_RESET)"
	@echo "$(COLOR_CYAN)═══════════════════════════════════════════════════$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_GREEN)Build Targets:$(COLOR_RESET)"
	@echo "  make              - Build the compiler (default: release)"
	@echo "  make debug        - Build with debug symbols"
	@echo "  make release      - Build optimized version"
	@echo "  make profile      - Build with profiling support"
	@echo "  make cmake        - Build using CMake"
	@echo ""
	@echo "$(COLOR_GREEN)Test Targets:$(COLOR_RESET)"
	@echo "  make test         - Build and run all tests"
	@echo "  make test-all     - Same as 'make test'"
	@echo "  make test-lexer   - Run lexer tests only"
	@echo "  make test-parser  - Run parser tests only"
	@echo "  make examples     - Run example programs"
	@echo ""
	@echo "$(COLOR_GREEN)Code Quality:$(COLOR_RESET)"
	@echo "  make format       - Format source code with clang-format"
	@echo "  make lint         - Run static analysis with cppcheck"
	@echo "  make check        - Run all checks and tests"
	@echo "  make coverage     - Build with code coverage"
	@echo ""
	@echo "$(COLOR_GREEN)Maintenance:$(COLOR_RESET)"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make distclean    - Deep clean including CMake files"
	@echo "  make install      - Install to /usr/local (or PREFIX)"
	@echo "  make uninstall    - Remove from /usr/local"
	@echo "  make dist         - Create distribution archive"
	@echo ""
	@echo "$(COLOR_GREEN)Documentation:$(COLOR_RESET)"
	@echo "  make docs         - Generate API documentation"
	@echo "  make info         - Show project information"
	@echo "  make help         - Show this help message"
	@echo ""
	@echo "$(COLOR_GREEN)Variables:$(COLOR_RESET)"
	@echo "  CXX=compiler      - Set C++ compiler"
	@echo "  LLVM_CONFIG=path  - Set llvm-config path"
	@echo "  BUILD_TYPE=type   - Set build type (debug/release/profile)"
	@echo "  PREFIX=path       - Set installation prefix"
	@echo "  NO_COLOR=1        - Disable colored output"
	@echo ""
	@echo "$(COLOR_YELLOW)Examples:$(COLOR_RESET)"
	@echo "  make CXX=g++ LLVM_CONFIG=/usr/local/bin/llvm-config"
	@echo "  make debug test"
	@echo "  make install PREFIX=/opt/droy"
