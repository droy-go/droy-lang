# =============================================================================
# Droy Language - Dockerfile
# =============================================================================
# Multi-stage build for Droy Language compiler
# =============================================================================

# =============================================================================
# Build Stage
# =============================================================================
FROM ubuntu:22.04 AS builder

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    llvm-15 \
    llvm-15-dev \
    clang-15 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /build

# Copy source code
COPY . .

# Build the project
RUN mkdir -p build && cd build && \
    cmake .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_C_COMPILER=clang-15 \
    -DCMAKE_CXX_COMPILER=clang++-15 \
    -DLLVM_DIR=/usr/lib/llvm-15/lib/cmake/llvm \
    -DBUILD_TESTS=OFF \
    -DBUILD_EXAMPLES=OFF && \
    make -j$(nproc)

# =============================================================================
# Runtime Stage
# =============================================================================
FROM ubuntu:22.04 AS runtime

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    llvm-15 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash droy

# Set working directory
WORKDIR /app

# Copy built binary from builder stage
COPY --from=builder /build/build/bin/droy-helper /usr/local/bin/
COPY --from=builder /build/include /usr/local/include/droy

# Change ownership
RUN chown -R droy:droy /app

# Switch to non-root user
USER droy

# Set entrypoint
ENTRYPOINT ["droy-helper"]

# Default command (show help)
CMD ["--help"]

# =============================================================================
# Development Stage
# =============================================================================
FROM builder AS development

# Install development tools
RUN apt-get update && apt-get install -y \
    gdb \
    valgrind \
    cppcheck \
    clang-format \
    clang-tidy \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]

# =============================================================================
# Testing Stage
# =============================================================================
FROM builder AS testing

# Build with tests enabled
RUN cd build && \
    cmake .. \
    -DCMAKE_BUILD_TYPE=Debug \
    -DBUILD_TESTS=ON \
    -DENABLE_SANITIZERS=ON && \
    make -j$(nproc)

# Run tests
CMD ["cd", "build", "&&", "ctest", "--output-on-failure"]
