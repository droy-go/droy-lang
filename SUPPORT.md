# Support

Need help with Droy Language? We're here to help!

## 📚 Documentation

Before reaching out, please check our documentation:

- **[Getting Started Guide](https://droy-go.github.io/droy-lang/getting-started/)** - Learn the basics
- **[Language Reference](https://droy-go.github.io/droy-lang/language/)** - Complete language documentation
- **[API Documentation](https://droy-go.github.io/droy-lang/api/)** - API reference
- **[Examples](examples/)** - Code examples

## 💬 Community Support

### GitHub Discussions

Join our community discussions:

- [Q&A](https://github.com/droy-go/droy-lang/discussions/categories/q-a) - Ask questions
- [Ideas](https://github.com/droy-go/droy-lang/discussions/categories/ideas) - Share ideas
- [Show and Tell](https://github.com/droy-go/droy-lang/discussions/categories/show-and-tell) - Share your projects
- [General](https://github.com/droy-go/droy-lang/discussions/categories/general) - General chat

### Issues

If you found a bug or have a feature request:

- [Bug Report](https://github.com/droy-go/droy-lang/issues/new?template=bug_report.yml)
- [Feature Request](https://github.com/droy-go/droy-lang/issues/new?template=feature_request.yml)
- [Question](https://github.com/droy-go/droy-lang/issues/new?template=question.yml)

## 🔧 Common Issues

### Installation Problems

#### LLVM Not Found

```bash
# Ubuntu/Debian
sudo apt-get install llvm llvm-dev

# macOS
brew install llvm

# Specify LLVM path
cmake -B build -DLLVM_DIR=/usr/lib/llvm-17/lib/cmake/llvm
```

#### Build Failures

```bash
# Clean and rebuild
make clean
make

# Or with CMake
rm -rf build
mkdir build && cd build
cmake ..
make
```

### Runtime Issues

#### Segmentation Fault

- Check if you're using the correct build type (Debug for development)
- Run with AddressSanitizer: `make BUILD_TYPE=debug && ./bin/droy-helper program.droy`
- Report the issue with a minimal reproduction

#### Memory Leaks

- Run with Valgrind: `valgrind --leak-check=full ./bin/droy-helper program.droy`
- Check for proper cleanup in your code

## 📧 Contact

### Security Issues

For security-related issues, please see our [Security Policy](SECURITY.md).

### Other Inquiries

- **General Questions**: [GitHub Discussions](https://github.com/droy-go/droy-lang/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/droy-go/droy-lang/issues)
- **Email**: [droy.go@example.com](mailto:droy.go@example.com) (for private inquiries)

## ⏰ Response Times

We aim to respond to:

- **Security issues**: Within 24 hours
- **Bug reports**: Within 3 days
- **Feature requests**: Within 7 days
- **Questions**: Within 3 days

Please note that these are goals, not guarantees. We're a small team and appreciate your patience!

## 🤝 Commercial Support

For commercial support or consulting:

- Contact: [droy.go@example.com](mailto:droy.go@example.com)
- Services available:
  - Custom language features
  - Integration support
  - Training and workshops
  - Priority bug fixes

## 🙏 Contributing to Support

Help us help others! You can:

- Answer questions in [Discussions](https://github.com/droy-go/droy-lang/discussions)
- Improve [documentation](https://github.com/droy-go/droy-lang/tree/main/docs)
- Share your experience in [Show and Tell](https://github.com/droy-go/droy-lang/discussions/categories/show-and-tell)

---

**Thank you for using Droy Language!** 🎉
