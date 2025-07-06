# create-addon

🚀 Create Node.js native addons with ease

A modern CLI tool for scaffolding Node.js native addon projects with an interactive interface. Generate boilerplate code for C++, Objective-C, and Swift addons with platform-specific templates.

## Features

- 🎯 **Interactive CLI** - Beautiful terminal UI built with React and Ink
- 🏗️ **Multiple Templates** - Support for C++, Objective-C, and Swift
- 🔧 **Platform-Specific** - Templates optimized for Linux, Windows, and macOS
- ⚡ **Modern N-API** - Uses `node-addon-api` for modern native bindings
- 🎨 **EventEmitter Pattern** - Built-in event system for native-to-JS communication
- 📦 **Ready to Build** - Pre-configured with node-gyp and build scripts

## Installation

```bash
npm install -g create-addon
```

Or use directly with npx:

```bash
npx create-addon my-project
```

## Quick Start

### Interactive Mode

Launch the interactive CLI to create a new project:

```bash
create-addon
```

### Semi-Interactive Mode

Provide a project name and select a template interactively:

```bash
create-addon my-awesome-addon
```

### Non-Interactive Mode

Create a project with all options specified:

```bash
create-addon my-awesome-addon --template cpp-linux
```

## Templates

### 🐧 cpp-linux
C++ addon optimized for Linux platforms with GTK+ integration.

**Features:**
- GTK+ GUI components
- Event-driven architecture
- Todo management functionality
- Platform detection and safety checks

### 🪟 cpp-win32
C++ addon designed for Windows platforms.

**Features:**
- Windows-specific APIs
- Native Win32 integration
- Event system for UI interactions
- Build configuration for Windows

### 🍎 objective-c
Objective-C addon for macOS with native Cocoa integration.

**Features:**
- Native macOS UI components
- Todo management with Objective-C classes
- Bridge between Objective-C and JavaScript
- macOS-specific functionality

### 🦉 swift
Swift addon for macOS with modern Swift integration.

**Features:**
- Modern Swift code
- Native Swift-to-JavaScript bridge
- Event-driven communication
- macOS platform optimization

## Usage Examples

### Creating Different Types of Addons

```bash
# Create a C++ addon for Linux
create-addon my-cpp-addon --template cpp-linux

# Create a Swift addon for macOS
create-addon my-swift-addon --template swift

# Create an Objective-C addon
create-addon my-objc-addon --template objective-c

# Create a Windows C++ addon
create-addon my-win-addon --template cpp-win32
```

### Skip Dependency Installation

```bash
create-addon my-project --skip-install
```

### Command Line Options

```bash
create-addon [project-name] [options]

Options:
  -t, --template <template>  Template to use (cpp-linux, cpp-win32, objective-c, swift)
  --skip-install            Skip installing dependencies
  -h, --help               Show help
```

## Generated Project Structure

Each generated project includes:

```
my-project/
├── binding.gyp          # node-gyp build configuration
├── package.json         # Project configuration and scripts
├── src/                 # Native source code
│   ├── addon.cc         # Main addon implementation
│   └── ...              # Additional source files
├── include/             # Header files
│   └── *.h              # Platform-specific headers
└── js/
    └── index.js         # JavaScript wrapper with EventEmitter
```

## Building Your Addon

After creating your project:

```bash
cd my-project

# Install dependencies
npm install

# Build the native addon
npm run build

# Clean build artifacts
npm run clean

# Build for Electron (if needed)
npm run build-electron
```

## Using Your Addon

Generated addons follow a consistent EventEmitter pattern:

```javascript
const addon = require('./js/index.js');

// Basic usage
console.log(addon.helloWorld('Hello from Node.js!'));

// GUI interaction (platform-specific)
addon.helloGui();

// Event handling
addon.on('todoAdded', (todo) => {
  console.log('New todo:', todo);
});

addon.on('todoUpdated', (todo) => {
  console.log('Updated todo:', todo);
});

addon.on('todoDeleted', (todo) => {
  console.log('Deleted todo:', todo);
});
```

## Development

### Prerequisites

- Node.js 16+ 
- Python 3.x (for node-gyp)
- Platform-specific build tools:
  - **Linux**: build-essential, GTK+ development libraries
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools

### Building the CLI

```bash
# Clone the repository
git clone https://github.com/himself65/create-addon.git
cd create-addon

# Install dependencies
pnpm install

# Build the CLI
pnpm run build

# Test locally
node dist/bin.js
```

### Development Mode

```bash
# Build with watch mode
pnpm run dev
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`pnpm run build`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT © [himself65](https://github.com/himself65)

## Support

- 🐛 [Report Issues](https://github.com/himself65/create-addon/issues)
- 💡 [Feature Requests](https://github.com/himself65/create-addon/issues)
- 📖 [Documentation](https://github.com/himself65/create-addon#readme)

---

Made with ❤️ by [himself65](https://github.com/himself65)