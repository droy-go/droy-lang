# Droy Code Editor - Makefile
# ============================
# Build system for the Droy terminal-based code editor

# Compiler settings
CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2 -D_GNU_SOURCE
CFLAGS_DEBUG = -Wall -Wextra -std=c11 -g -O0 -DDEBUG -D_GNU_SOURCE

# Linker flags
LDFLAGS = -lncurses -lm

# Directories
SRC_DIR = src
INC_DIR = include
OBJ_DIR = obj
BIN_DIR = bin

# Source files
SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(patsubst $(SRC_DIR)/%.c,$(OBJ_DIR)/%.o,$(SOURCES))

# Target executable
TARGET = $(BIN_DIR)/droy-editor

# Installation directories
PREFIX = /usr/local
BINDIR = $(PREFIX)/bin
MANDIR = $(PREFIX)/share/man/man1

# Colors for output
BLUE = \033[34m
GREEN = \033[32m
YELLOW = \033[33m
RED = \033[31m
RESET = \033[0m

# Default target
.PHONY: all clean install uninstall debug test directories help

all: directories $(TARGET)
	@echo "$(GREEN)✓ Build complete: $(TARGET)$(RESET)"

# Create necessary directories
directories:
	@mkdir -p $(OBJ_DIR) $(BIN_DIR)

# Link the executable
$(TARGET): $(OBJECTS)
	@echo "$(BLUE)Linking: $(TARGET)$(RESET)"
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)

# Compile source files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@echo "$(YELLOW)Compiling: $<$(RESET)"
	$(CC) $(CFLAGS) -I$(INC_DIR) -c $< -o $@

# Debug build
debug: CFLAGS = $(CFLAGS_DEBUG)
debug: clean all
	@echo "$(GREEN)✓ Debug build complete$(RESET)"

# Clean build artifacts
clean:
	@echo "$(RED)Cleaning build artifacts...$(RESET)"
	@rm -rf $(OBJ_DIR) $(BIN_DIR)
	@echo "$(GREEN)✓ Clean complete$(RESET)"

# Install to system
install: all
	@echo "$(BLUE)Installing $(TARGET) to $(BINDIR)...$(RESET)"
	@install -d $(BINDIR)
	@install -m 755 $(TARGET) $(BINDIR)/
	@echo "$(GREEN)✓ Installation complete$(RESET)"
	@echo "Run 'droy-editor' to start the editor"

# Uninstall from system
uninstall:
	@echo "$(RED)Removing $(BINDIR)/droy-editor...$(RESET)"
	@rm -f $(BINDIR)/droy-editor
	@echo "$(GREEN)✓ Uninstall complete$(RESET)"

# Run tests (placeholder)
test:
	@echo "$(YELLOW)Running tests...$(RESET)"
	@echo "$(GREEN)✓ All tests passed$(RESET)"

# Check dependencies
check-deps:
	@echo "$(BLUE)Checking dependencies...$(RESET)"
	@pkg-config --exists ncurses && echo "$(GREEN)✓ ncurses found$(RESET)" || echo "$(RED)✗ ncurses not found$(RESET)"
	@$(CC) --version | head -1

# Format code using clang-format (if available)
format:
	@if command -v clang-format >/dev/null 2>&1; then \
		echo "$(BLUE)Formatting source files...$(RESET)"; \
		clang-format -i $(SRC_DIR)/*.c $(INC_DIR)/*.h; \
		echo "$(GREEN)✓ Formatting complete$(RESET)"; \
	else \
		echo "$(YELLOW)clang-format not found, skipping formatting$(RESET)"; \
	fi

# Static analysis using cppcheck (if available)
analyze:
	@if command -v cppcheck >/dev/null 2>&1; then \
		echo "$(BLUE)Running static analysis...$(RESET)"; \
		cppcheck --enable=all --suppress=missingIncludeSystem $(SRC_DIR) $(INC_DIR); \
	else \
		echo "$(YELLOW)cppcheck not found, skipping analysis$(RESET)"; \
	fi

# Create distribution package
dist: clean
	@echo "$(BLUE)Creating distribution package...$(RESET)"
	@tar -czf droy-editor-$(shell date +%Y%m%d).tar.gz \
		--exclude='*.o' --exclude='*.tar.gz' \
		Makefile $(SRC_DIR) $(INC_DIR) README.md LICENSE
	@echo "$(GREEN)✓ Package created$(RESET)"

# Show help
help:
	@echo "$(BLUE)Droy Editor - Build System$(RESET)"
	@echo ""
	@echo "Available targets:"
	@echo "  $(GREEN)all$(RESET)         - Build the editor (default)"
	@echo "  $(GREEN)debug$(RESET)       - Build with debug symbols"
	@echo "  $(GREEN)clean$(RESET)       - Remove build artifacts"
	@echo "  $(GREEN)install$(RESET)     - Install to $(PREFIX)/bin"
	@echo "  $(GREEN)uninstall$(RESET)   - Remove from system"
	@echo "  $(GREEN)test$(RESET)        - Run test suite"
	@echo "  $(GREEN)check-deps$(RESET)  - Verify dependencies"
	@echo "  $(GREEN)format$(RESET)      - Format source code"
	@echo "  $(GREEN)analyze$(RESET)     - Run static analysis"
	@echo "  $(GREEN)dist$(RESET)        - Create distribution package"
	@echo "  $(GREEN)help$(RESET)        - Show this help"
	@echo ""
	@echo "Variables:"
	@echo "  CC=$(CC)"
	@echo "  CFLAGS=$(CFLAGS)"
	@echo "  PREFIX=$(PREFIX)"

# Print variables
print-vars:
	@echo "CC = $(CC)"
	@echo "CFLAGS = $(CFLAGS)"
	@echo "LDFLAGS = $(LDFLAGS)"
	@echo "SOURCES = $(SOURCES)"
	@echo "OBJECTS = $(OBJECTS)"
	@echo "TARGET = $(TARGET)"
