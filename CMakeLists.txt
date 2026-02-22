# =============================================================================
# Droy Helper Language - CMake Build Configuration
# =============================================================================
# A modern CMake build system for the Droy programming language compiler
# with LLVM backend support
#
# Minimum CMake version: 3.16
# Tested with: CMake 3.16+, LLVM 14-17, C++17
# =============================================================================

cmake_minimum_required(VERSION 3.16)

# =============================================================================
# Project Definition
# =============================================================================
project(DroyHelperLang
    VERSION 1.0.0
    DESCRIPTION "Droy Helper Language Compiler with LLVM Backend"
    HOMEPAGE_URL "https://github.com/droy-go/droy-lang"
    LANGUAGES CXX C
)

# =============================================================================
# C++ Standard Configuration
# =============================================================================
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Export compile commands for IDE integration
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# =============================================================================
# Build Type Configuration
# =============================================================================
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Build type" FORCE)
endif()

set(CMAKE_BUILD_TYPE_VALUES "Debug;Release;RelWithDebInfo;MinSizeRel")
set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS ${CMAKE_BUILD_TYPE_VALUES})

# =============================================================================
# Build Options
# =============================================================================
option(BUILD_TESTS "Build test suite" ON)
option(BUILD_EXAMPLES "Build example programs" ON)
option(BUILD_DOCS "Build documentation" OFF)
option(ENABLE_LLVM "Enable LLVM backend" ON)
option(ENABLE_WERROR "Treat warnings as errors" OFF)
option(ENABLE_SANITIZERS "Enable address and undefined behavior sanitizers" OFF)
option(ENABLE_COVERAGE "Enable code coverage reporting" OFF)

# =============================================================================
# Find LLVM Package
# =============================================================================
if(ENABLE_LLVM)
    find_package(LLVM REQUIRED CONFIG)
    
    message(STATUS "Found LLVM ${LLVM_PACKAGE_VERSION}")
    message(STATUS "Using LLVMConfig.cmake in: ${LLVM_DIR}")
    message(STATUS "LLVM Include Dirs: ${LLVM_INCLUDE_DIRS}")
    message(STATUS "LLVM Library Dirs: ${LLVM_LIBRARY_DIRS}")
    
    # Include LLVM directories
    include_directories(${LLVM_INCLUDE_DIRS})
    add_definitions(${LLVM_DEFINITIONS})
    
    # Link LLVM library directories
    link_directories(${LLVM_LIBRARY_DIRS})
endif()

# =============================================================================
# Include Directories
# =============================================================================
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/llvm_backend
)

# =============================================================================
# Source Files
# =============================================================================
set(DROY_SOURCES
    src/main.cpp
    src/token.cpp
    src/lexer.cpp
    src/ast.cpp
    src/parser.cpp
)

set(DROY_HEADERS
    include/token.h
    include/lexer.h
    include/ast.h
    include/parser.h
    include/droy.h
)

if(ENABLE_LLVM)
    list(APPEND DROY_SOURCES llvm_backend/llvm_generator.cpp)
    list(APPEND DROY_HEADERS include/llvm_generator.h)
endif()

# =============================================================================
# Compiler Warnings
# =============================================================================
set(DROY_WARNING_FLAGS
    -Wall
    -Wextra
    -Wpedantic
    -Wcast-align
    -Wcast-qual
    -Wconversion
    -Wctor-dtor-privacy
    -Wenum-compare
    -Wfloat-equal
    -Wnon-virtual-dtor
    -Wold-style-cast
    -Woverloaded-virtual
    -Wredundant-decls
    -Wshadow
    -Wsign-conversion
    -Wsign-promo
    -Wzero-as-null-pointer-constant
)

if(ENABLE_WERROR)
    list(APPEND DROY_WARNING_FLAGS -Werror)
endif()

# =============================================================================
# Sanitizers
# =============================================================================
if(ENABLE_SANITIZERS)
    set(SANITIZER_FLAGS
        -fsanitize=address
        -fsanitize=undefined
        -fno-omit-frame-pointer
    )
    add_compile_options(${SANITIZER_FLAGS})
    add_link_options(${SANITIZER_FLAGS})
    message(STATUS "Sanitizers enabled")
endif()

# =============================================================================
# Code Coverage
# =============================================================================
if(ENABLE_COVERAGE)
    if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
        add_compile_options(--coverage -O0 -g)
        add_link_options(--coverage)
        message(STATUS "Code coverage enabled")
    else()
        message(WARNING "Code coverage only supported with GCC or Clang")
    endif()
endif()

# =============================================================================
# Main Executable
# =============================================================================
add_executable(droy-helper ${DROY_SOURCES} ${DROY_HEADERS})

# Set target properties
set_target_properties(droy-helper PROPERTIES
    VERSION ${PROJECT_VERSION}
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
)

# Apply compiler warnings
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(droy-helper PRIVATE ${DROY_WARNING_FLAGS})
endif()

# Platform-specific settings
if(WIN32)
    target_compile_definitions(droy-helper PRIVATE _CRT_SECURE_NO_WARNINGS)
endif()

# Build type specific options
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_options(droy-helper PRIVATE -g -O0)
    target_compile_definitions(droy-helper PRIVATE DEBUG)
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    target_compile_options(droy-helper PRIVATE -O3)
    target_compile_definitions(droy-helper PRIVATE NDEBUG)
elseif(CMAKE_BUILD_TYPE STREQUAL "RelWithDebInfo")
    target_compile_options(droy-helper PRIVATE -O2 -g)
elseif(CMAKE_BUILD_TYPE STREQUAL "MinSizeRel")
    target_compile_options(droy-helper PRIVATE -Os)
endif()

# =============================================================================
# Link LLVM Libraries
# =============================================================================
if(ENABLE_LLVM)
    llvm_map_components_to_libnames(llvm_libs
        Core
        Support
        Analysis
        TransformUtils
        Scalar
        InstCombine
        ExecutionEngine
        MC
        MCJIT
        Target
        X86CodeGen
        X86AsmParser
        X86Desc
        X86Info
        Object
        BitWriter
        Passes
        IPO
        Vectorize
        Instrumentation
        Interpreter
        Native
        AsmPrinter
        SelectionDAG
    )
    
    target_link_libraries(droy-helper ${llvm_libs})
endif()

# =============================================================================
# Installation
# =============================================================================
include(GNUInstallDirs)

install(TARGETS droy-helper
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
)

install(FILES ${DROY_HEADERS}
    DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/droy
)

# =============================================================================
# Testing
# =============================================================================
if(BUILD_TESTS)
    enable_testing()
    
    # Test executable
    set(TEST_SOURCES
        tests/test_lexer.cpp
        tests/test_parser.cpp
        src/token.cpp
        src/lexer.cpp
        src/ast.cpp
        src/parser.cpp
    )
    
    add_executable(droy-test ${TEST_SOURCES})
    target_include_directories(droy-test PRIVATE ${CMAKE_SOURCE_DIR}/include)
    
    if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
        target_compile_options(droy-test PRIVATE ${DROY_WARNING_FLAGS})
    endif()
    
    if(ENABLE_LLVM)
        target_link_libraries(droy-test ${llvm_libs})
    endif()
    
    set_target_properties(droy-test PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
    )
    
    # Add tests
    add_test(NAME LexerTest COMMAND droy-test lexer)
    add_test(NAME ParserTest COMMAND droy-test parser)
endif()

# =============================================================================
# Examples
# =============================================================================
if(BUILD_EXAMPLES)
    file(GLOB EXAMPLE_FILES "${CMAKE_SOURCE_DIR}/examples/*.droy")
    foreach(example_file ${EXAMPLE_FILES})
        get_filename_component(example_name ${example_file} NAME_WE)
        add_test(NAME Example_${example_name}
            COMMAND droy-helper ${example_file} -o ${CMAKE_BINARY_DIR}/${example_name}.ll
        )
        set_tests_properties(Example_${example_name} PROPERTIES
            DEPENDS droy-helper
        )
    endforeach()
endif()

# =============================================================================
# Documentation
# =============================================================================
if(BUILD_DOCS)
    find_package(Doxygen OPTIONAL_COMPONENTS dot)
    if(DOXYGEN_FOUND)
        set(DOXYGEN_IN ${CMAKE_SOURCE_DIR}/docs/Doxyfile.in)
        set(DOXYGEN_OUT ${CMAKE_BINARY_DIR}/Doxyfile)
        
        if(EXISTS ${DOXYGEN_IN})
            configure_file(${DOXYGEN_IN} ${DOXYGEN_OUT} @ONLY)
            add_custom_target(docs
                COMMAND ${DOXYGEN_EXECUTABLE} ${DOXYGEN_OUT}
                WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
                COMMENT "Generating API documentation with Doxygen"
                VERBATIM
            )
        endif()
    else()
        message(WARNING "Doxygen not found, documentation will not be built")
    endif()
endif()

# =============================================================================
# Package Configuration
# =============================================================================
include(CMakePackageConfigHelpers)

write_basic_package_version_file(
    "${CMAKE_BINARY_DIR}/DroyHelperLangConfigVersion.cmake"
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY SameMajorVersion
)

# =============================================================================
# Configuration Summary
# =============================================================================
message(STATUS "")
message(STATUS "╔══════════════════════════════════════════════════════════════════════╗")
message(STATUS "║          Droy Helper Language - Build Configuration                  ║")
message(STATUS "╠══════════════════════════════════════════════════════════════════════╣")
message(STATUS "║  Version:           ${PROJECT_VERSION}                                          ║")
message(STATUS "║  C++ Standard:      C++${CMAKE_CXX_STANDARD}                                          ║")
message(STATUS "║  Build Type:        ${CMAKE_BUILD_TYPE}                                    ║")
message(STATUS "║  Install Prefix:    ${CMAKE_INSTALL_PREFIX}                            ║")
message(STATUS "╠══════════════════════════════════════════════════════════════════════╣")
if(ENABLE_LLVM)
message(STATUS "║  LLVM Version:      ${LLVM_PACKAGE_VERSION}                                      ║")
endif()
message(STATUS "║  Build Tests:       ${BUILD_TESTS}                                         ║")
message(STATUS "║  Build Examples:    ${BUILD_EXAMPLES}                                      ║")
message(STATUS "║  Build Docs:        ${BUILD_DOCS}                                          ║")
message(STATUS "║  LLVM Backend:      ${ENABLE_LLVM}                                         ║")
message(STATUS "║  Warnings as Error: ${ENABLE_WERROR}                                       ║")
message(STATUS "║  Sanitizers:        ${ENABLE_SANITIZERS}                                   ║")
message(STATUS "║  Code Coverage:     ${ENABLE_COVERAGE}                                     ║")
message(STATUS "╚══════════════════════════════════════════════════════════════════════╝")
message(STATUS "")
