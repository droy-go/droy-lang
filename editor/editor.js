// Droy Code Editor - Main JavaScript
// ====================================

// Default code template
const defaultCode = `// Droy Language - Welcome!
// =========================

// Set variables using shorthand or full syntax
~s @si = "Hello"
set @ui = "World"

// Output text
text @si
text @ui

// Expressions
em @si + " " + @ui + "!"

// Math operations
set a = 10
set b = 5
em "Sum: " + (a + b)
em "Product: " + (a * b)

// Create links
link id: "homepage" api: "https://example.com"
create-link: "homepage"

// Execute commands
*/employment
*/Running

// Return value
ret @si + " " + @ui
`;

// Example files content
const exampleFiles = {
    'hello.droy': `// Droy Language - Hello World Example
// ===================================

// Using shorthand syntax
~s @si = "Hello"
~s @ui = "World"

// Using full syntax
set @yui = "!"

// Output text
text @si
text @ui
text @yui

// Using em to output expression
em @si + " " + @ui + @yui

// Return the greeting
ret @si + " " + @ui + @yui
`,
    'variables.droy': `// Droy Language - Variables Example
// ==================================

// Setting variables using different syntaxes
set name = "Droy"
~s version = "1.0.0"
txt description = "A powerful markup language"

// Special variables
@si = 100
@ui = 200
@yui = "special"
@pop = "variable"
@abc = "test"

// Output variables
text "Language: " + name
text "Version: " + version
text "Description: " + description

// Using special variables
em @si + @ui

// Complex expressions
set result = @si + @ui * 2
em "Result: " + result
`,
    'math.droy': `// Droy Language - Math Operations Example
// ========================================

// Basic arithmetic
set a = 10
set b = 5

// Addition
set sum = a + b
em "10 + 5 = " + sum

// Subtraction
set diff = a - b
em "10 - 5 = " + diff

// Multiplication
set product = a * b
em "10 * 5 = " + product

// Division
set quotient = a / b
em "10 / 5 = " + quotient

// Complex expression
set complex = (a + b) * 2 - 5
em "Complex: (10 + 5) * 2 - 5 = " + complex

// Using special variables in math
@si = 25
@ui = 4
set result = @si / @ui
em "25 / 4 = " + result
`,
    'links.droy': `// Droy Language - Links System Example
// =====================================

// Create a link with id and api
link id: "homepage" api: "https://example.com"
create-link: "homepage"

// Create another link
link id: "api_endpoint" api: "https://api.example.com/v1"
create-link: "api_endpoint"

// Open a link
open-link: "homepage"
link-go: "homepage"

// Using yoex--links (extended links)
yoex--links id: "external" api: "https://external.com"

// a-link (anchor link)
a-link id: "section1" api: "#section1"

// Execute commands
*/employment
*/Running
*/pressure
*/pressure
*/lock
`,
    'blocks.droy': `// Droy Language - Blocks and Styling Example
// ===========================================

// Define a block with key
block: key("main", "container") {
    // Inside the block
    set title = "Main Block"
    text title
    
    // Nested styling
    sty {
        set color = "blue"
        set size = "large"
        em "Style: " + color + ", " + size
    }
}

// Package declaration
pkg "main-package"

// Media element
media "https://example.com/image.png"

// Media with id and api
media id: "hero-image" api: "https://cdn.example.com/hero.png"

// For loop example
for i in 5 {
    text "Iteration: " + i
}
`
};

// Editor instance
let editor;
let currentFile = 'untitled.droy';
let openFiles = { 'untitled.droy': defaultCode };

// Initialize editor
document.addEventListener('DOMContentLoaded', function() {
    initEditor();
    initEventListeners();
    updateStatusBar();
});

function initEditor() {
    const textarea = document.getElementById('code-editor');
    textarea.value = defaultCode;
    
    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'droy',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: {
            'Ctrl-Space': 'autocomplete',
            'Ctrl-S': function(cm) { saveFile(); },
            'Ctrl-O': function(cm) { openFile(); },
            'Ctrl-N': function(cm) { newFile(); },
            'F5': function(cm) { runCode(); }
        }
    });
    
    // Update cursor position
    editor.on('cursorActivity', updateStatusBar);
    
    // Enable auto-completion on typing
    editor.on('inputRead', function(cm, change) {
        if (change.text.length === 1 && /[\w@~]/.test(change.text[0])) {
            CodeMirror.commands.autocomplete(cm);
        }
    });
}

function initEventListeners() {
    // Header buttons
    document.getElementById('btn-new').addEventListener('click', newFile);
    document.getElementById('btn-open').addEventListener('click', openFile);
    document.getElementById('btn-save').addEventListener('click', saveFile);
    document.getElementById('btn-run').addEventListener('click', runCode);
    
    // File tree
    document.querySelectorAll('.file').forEach(file => {
        file.addEventListener('click', function() {
            const filename = this.dataset.file;
            loadExampleFile(filename);
        });
    });
    
    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const panel = this.dataset.panel;
            switchPanel(panel);
        });
    });
    
    // File input
    document.getElementById('file-input').addEventListener('change', handleFileSelect);
}

function updateStatusBar() {
    const cursor = editor.getCursor();
    document.getElementById('cursor-pos').textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
}

function newFile() {
    const filename = 'untitled-' + Date.now() + '.droy';
    openFiles[filename] = '';
    currentFile = filename;
    editor.setValue('');
    addTab(filename);
}

function openFile() {
    document.getElementById('file-input').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const filename = file.name;
        openFiles[filename] = content;
        currentFile = filename;
        editor.setValue(content);
        addTab(filename);
    };
    reader.readAsText(file);
}

function saveFile() {
    const content = editor.getValue();
    openFiles[currentFile] = content;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showNotification('File saved: ' + currentFile);
}

function loadExampleFile(filename) {
    if (exampleFiles[filename]) {
        openFiles[filename] = exampleFiles[filename];
        currentFile = filename;
        editor.setValue(exampleFiles[filename]);
        addTab(filename);
    }
}

function addTab(filename) {
    const tabsContainer = document.getElementById('tabs');
    
    // Remove active class from all tabs
    tabsContainer.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Check if tab already exists
    let existingTab = tabsContainer.querySelector(`[data-file="${filename}"]`);
    if (existingTab) {
        existingTab.classList.add('active');
        return;
    }
    
    // Create new tab
    const tab = document.createElement('div');
    tab.className = 'tab active';
    tab.dataset.file = filename;
    tab.innerHTML = `
        <span class="tab-name">${filename}</span>
        <span class="tab-close">×</span>
    `;
    
    tab.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-close')) {
            closeTab(filename);
        } else {
            switchTab(filename);
        }
    });
    
    tabsContainer.appendChild(tab);
}

function switchTab(filename) {
    // Save current content
    openFiles[currentFile] = editor.getValue();
    
    // Switch to new file
    currentFile = filename;
    editor.setValue(openFiles[filename] || '');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.file === filename);
    });
}

function closeTab(filename) {
    const tabsContainer = document.getElementById('tabs');
    const tab = tabsContainer.querySelector(`[data-file="${filename}"]`);
    if (tab) {
        tab.remove();
    }
    
    delete openFiles[filename];
    
    // Switch to another tab if this was active
    if (currentFile === filename) {
        const remainingTabs = tabsContainer.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            const newFile = remainingTabs[0].dataset.file;
            switchTab(newFile);
        } else {
            newFile();
        }
    }
}

function switchPanel(panel) {
    // Update tab buttons
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panel);
    });
    
    // Update panel content
    document.querySelectorAll('.panel-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(panel + '-panel').classList.add('active');
}

// Droy Interpreter (JavaScript version)
class DroyInterpreter {
    constructor() {
        this.variables = {};
        this.links = {};
        this.output = [];
        this.commands = {
            employment: false,
            running: false,
            pressure: 0,
            lock: false
        };
    }
    
    tokenize(code) {
        const tokens = [];
        const lines = code.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let col = 0;
            
            while (col < line.length) {
                // Skip whitespace
                while (col < line.length && /\s/.test(line[col])) {
                    col++;
                }
                
                if (col >= line.length) break;
                
                // Comments
                if (line.substr(col, 2) === '//') {
                    break;
                }
                
                // Strings
                if (line[col] === '"' || line[col] === "'") {
                    const quote = line[col];
                    let str = '';
                    col++;
                    while (col < line.length && line[col] !== quote) {
                        str += line[col];
                        col++;
                    }
                    col++;
                    tokens.push({ type: 'STRING', value: str, line: i + 1, col: col + 1 });
                    continue;
                }
                
                // Numbers
                if (/\d/.test(line[col])) {
                    let num = '';
                    while (col < line.length && (/\d/.test(line[col]) || line[col] === '.')) {
                        num += line[col];
                        col++;
                    }
                    tokens.push({ type: 'NUMBER', value: num, line: i + 1, col: col + 1 });
                    continue;
                }
                
                // Commands (*/command)
                if (line.substr(col, 2) === '*/') {
                    let cmd = '';
                    col += 2;
                    while (col < line.length && /[a-zA-Z]/.test(line[col])) {
                        cmd += line[col];
                        col++;
                    }
                    tokens.push({ type: 'COMMAND', value: '*/' + cmd, line: i + 1, col: col + 1 });
                    continue;
                }
                
                // Special variables (@si, @ui, etc.)
                if (line[col] === '@') {
                    let varName = '@';
                    col++;
                    while (col < line.length && /[a-zA-Z0-9_]/.test(line[col])) {
                        varName += line[col];
                        col++;
                    }
                    tokens.push({ type: 'SPECIAL_VAR', value: varName, line: i + 1, col: col + 1 });
                    continue;
                }
                
                // Shorthand (~s, ~r, ~e)
                if (line[col] === '~') {
                    const shorthand = line.substr(col, 2);
                    if (['~s', '~r', '~e'].includes(shorthand)) {
                        tokens.push({ type: 'KEYWORD', value: shorthand, line: i + 1, col: col + 1 });
                        col += 2;
                        continue;
                    }
                }
                
                // Keywords and identifiers
                if (/[a-zA-Z]/.test(line[col])) {
                    let word = '';
                    while (col < line.length && /[a-zA-Z0-9_-]/.test(line[col])) {
                        word += line[col];
                        col++;
                    }
                    
                    const keywords = ['set', 'ret', 'em', 'text', 'txt', 't', 'fe', 'f', 'for',
                                     'sty', 'pkg', 'media', 'link', 'a-link', 'yoex--links',
                                     'link-go', 'create-link', 'open-link', 'api', 'id', 'block', 'key'];
                    
                    if (keywords.includes(word)) {
                        tokens.push({ type: 'KEYWORD', value: word, line: i + 1, col: col + 1 });
                    } else {
                        tokens.push({ type: 'IDENTIFIER', value: word, line: i + 1, col: col + 1 });
                    }
                    continue;
                }
                
                // Operators
                if (/[+\-=*/]/.test(line[col])) {
                    tokens.push({ type: 'OPERATOR', value: line[col], line: i + 1, col: col + 1 });
                    col++;
                    continue;
                }
                
                // Delimiters
                if (/[{}()\[\]:;,]/.test(line[col])) {
                    tokens.push({ type: 'DELIMITER', value: line[col], line: i + 1, col: col + 1 });
                    col++;
                    continue;
                }
                
                col++;
            }
        }
        
        return tokens;
    }
    
    execute(code) {
        this.output = [];
        const tokens = this.tokenize(code);
        
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            
            // set/~s: Set variable
            if (token.type === 'KEYWORD' && (token.value === 'set' || token.value === '~s')) {
                i++;
                const varName = tokens[i]?.value;
                i += 2; // Skip '='
                const value = this.evaluateExpression(tokens, i);
                this.variables[varName] = value;
                this.output.push(`[SET] ${varName} = ${value}`);
                while (i < tokens.length && tokens[i].line === token.line) i++;
                continue;
            }
            
            // ret/~r: Return value
            if (token.type === 'KEYWORD' && (token.value === 'ret' || token.value === '~r')) {
                i++;
                const value = this.evaluateExpression(tokens, i);
                this.output.push(`[RET] ${value}`);
                while (i < tokens.length && tokens[i].line === token.line) i++;
                continue;
            }
            
            // em/~e: Emit value
            if (token.type === 'KEYWORD' && (token.value === 'em' || token.value === '~e')) {
                i++;
                const value = this.evaluateExpression(tokens, i);
                this.output.push(`[EM] ${value}`);
                while (i < tokens.length && tokens[i].line === token.line) i++;
                continue;
            }
            
            // text/txt/t: Output text
            if (token.type === 'KEYWORD' && ['text', 'txt', 't'].includes(token.value)) {
                i++;
                const value = this.evaluateExpression(tokens, i);
                this.output.push(`[TEXT] ${value}`);
                while (i < tokens.length && tokens[i].line === token.line) i++;
                continue;
            }
            
            // Commands
            if (token.type === 'COMMAND') {
                const cmd = token.value.substring(2);
                this.executeCommand(cmd);
                i++;
                continue;
            }
            
            i++;
        }
        
        return {
            output: this.output.join('\n'),
            tokens: tokens,
            variables: this.variables,
            links: this.links,
            commands: this.commands
        };
    }
    
    evaluateExpression(tokens, startIndex) {
        let result = '';
        let i = startIndex;
        
        while (i < tokens.length) {
            const token = tokens[i];
            
            if (token.type === 'STRING') {
                result += token.value;
            } else if (token.type === 'NUMBER') {
                result += token.value;
            } else if (token.type === 'SPECIAL_VAR') {
                result += this.variables[token.value] || token.value;
            } else if (token.type === 'IDENTIFIER') {
                result += this.variables[token.value] || token.value;
            } else if (token.type === 'OPERATOR' && token.value === '+') {
                // Concatenation
            }
            
            i++;
        }
        
        return result || '';
    }
    
    executeCommand(cmd) {
        switch (cmd) {
            case 'employment':
                this.commands.employment = true;
                this.output.push('[CMD] Employment status activated');
                break;
            case 'Running':
                this.commands.running = true;
                this.output.push('[CMD] System running');
                break;
            case 'pressure':
                this.commands.pressure++;
                this.output.push(`[CMD] Pressure level increased to ${this.commands.pressure}`);
                break;
            case 'lock':
                this.commands.lock = true;
                this.output.push('[CMD] System locked');
                break;
        }
    }
}

function runCode() {
    const code = editor.getValue();
    const interpreter = new DroyInterpreter();
    
    try {
        const result = interpreter.execute(code);
        
        // Display output
        document.getElementById('output-content').textContent = result.output;
        
        // Display tokens
        document.getElementById('tokens-content').textContent = 
            result.tokens.map(t => `[${t.line}:${t.col}] ${t.type}: ${t.value}`).join('\n');
        
        // Display AST (simplified)
        document.getElementById('ast-content').textContent = 
            JSON.stringify({
                variables: result.variables,
                links: result.links,
                commands: result.commands
            }, null, 2);
        
        // Switch to output panel
        switchPanel('output');
        
    } catch (error) {
        document.getElementById('output-content').textContent = 
            `Error: ${error.message}`;
        switchPanel('output');
    }
}

function showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'tooltip';
    notification.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
