// Droy Language Compiler v3.0 - Advanced Edition
// Advanced concepts: SET/SETUP naming, TOOL, GET_SET, Color Blending, DATA, SERVER
// Syntax: set=topbar=s+d, setup=get: sty, tool=get:, value-set=(a=1,s=2,c+s=3)

export type TokenType = 
  // Core
  | 'SET' | 'GET' | 'VAR' | 'FUNC' | 'RETURN' | 'IF' | 'ELSE' | 'FOR' | 'WHILE'
  | 'PRINT' | 'INPUT' | 'LINK' | 'ARRAY' | 'CLASS' | 'IMPORT' | 'EXPORT'
  // Advanced SET/SETUP
  | 'SETUP' | 'GET_SET' | 'VALUE_SET' | 'TOOL_SET'
  // UI Components
  | 'UI' | 'BTN' | 'COLOR' | 'BG' | 'BACKGROUND' | 'ICON' | 'IMG' | 'IMAGE'
  | 'VIDEO' | 'AUDIO' | 'TEXT' | 'TITLE' | 'SUBTITLE' | 'CONTAINER' | 'GRID'
  | 'FLEX' | 'ROW' | 'COL' | 'COLUMN' | 'CARD' | 'MODAL' | 'TOAST' | 'TOOLTIP'
  | 'TOPBAR' | 'SIDEBAR' | 'FOOTER' | 'HEADER' | 'NAV' | 'MENU'
  // Tools
  | 'TOOL' | 'TOOLS' | 'UTIL' | 'UTILS' | 'HELPER' | 'PLUGIN' | 'EXT'
  // Data
  | 'DATA' | 'DB' | 'DATABASE' | 'STORE' | 'CACHE' | 'STATE' | 'PROPS'
  | 'JSON' | 'CSV' | 'XML' | 'YAML'
  // Server/Network
  | 'SERVER' | 'API' | 'HTTP' | 'HTTPS' | 'WS' | 'WEBSOCKET'
  | 'FETCH' | 'POST' | 'GET_REQUEST' | 'PUT' | 'DELETE' | 'PATCH'
  | 'ROUTE' | 'ROUTER' | 'ENDPOINT' | 'MIDDLEWARE' | 'AUTH'
  // Group/ID/Name
  | 'GROUP' | 'ID' | 'NAME' | 'TAG' | 'CLASS_NAME' | 'ATTR'
  | 'SELECTOR' | 'QUERY' | 'FIND' | 'FILTER' | 'SORT'
  // Color & Style
  | 'BLEND' | 'BLEND_MODE' | 'GRADIENT' | 'THEME' | 'THEME_MODE'
  | 'DARK' | 'LIGHT' | 'MODE' | 'SCHEME'
  // Number & Math
  | 'NUMBER' | 'INT' | 'FLOAT' | 'DOUBLE' | 'MATH' | 'CALC'
  | 'RANDOM' | 'ROUND' | 'FLOOR' | 'CEIL' | 'ABS' | 'MIN' | 'MAX'
  | 'SUM' | 'AVG' | 'COUNT'
  // Animation
  | 'ANIMATE' | 'TRANSITION' | 'DELAY' | 'DURATION' | 'EASING' | 'KEYFRAME'
  // Layout
  | 'WIDTH' | 'HEIGHT' | 'PADDING' | 'MARGIN' | 'BORDER' | 'RADIUS'
  | 'SHADOW' | 'OPACITY' | 'SIZE' | 'POSITION' | 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM'
  | 'Z_INDEX' | 'DISPLAY' | 'VISIBLE' | 'HIDDEN'
  // Events
  | 'KEY' | 'KEYDOWN' | 'KEYUP' | 'CLICK' | 'HOVER' | 'FOCUS' | 'BLUR'
  | 'SUBMIT' | 'CHANGE' | 'ON' | 'OFF' | 'BIND' | 'REF' | 'WATCH' | 'EMIT'
  // Data Types
  | 'STRING' | 'STR' | 'BOOLEAN' | 'BOOL' | 'NULL' | 'UNDEFINED'
  | 'IDENTIFIER' | 'HEX_COLOR' | 'RGB' | 'RGBA' | 'HSL'
  // Operators
  | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'MODULO' | 'POWER'
  | 'ASSIGN' | 'COLON_ASSIGN' | 'ARROW_ASSIGN' | 'EQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE'
  | 'AND' | 'OR' | 'NOT' | 'IN' | 'OF' | 'IS' | 'AS'
  | 'DOT' | 'SPREAD' | 'OPTIONAL' | 'NULLISH'
  // Brackets
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACKET' | 'RBRACKET'
  | 'COMMA' | 'COLON' | 'SEMICOLON' | 'PIPE' | 'ARROW' | 'FAT_ARROW'
  // Special
  | 'COMMENT' | 'NEWLINE' | 'EOF' | 'TILDE' | 'AT' | 'HASH' | 'DOLLAR'
  | 'QUESTION' | 'EXCLAMATION' | 'PERCENT' | 'AMPERSAND';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

// ============================================
// LEXER - Tokenizer
// ============================================
export class DroyLexerV3 {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  private keywords: Map<string, TokenType> = new Map([
    // Core
    ['set', 'SET'], ['get', 'GET'], ['var', 'VAR'], ['func', 'FUNC'],
    ['return', 'RETURN'], ['if', 'IF'], ['else', 'ELSE'],
    ['for', 'FOR'], ['while', 'WHILE'], ['print', 'PRINT'],
    ['input', 'INPUT'], ['link', 'LINK'], ['array', 'ARRAY'],
    ['class', 'CLASS'], ['import', 'IMPORT'], ['export', 'EXPORT'],
    // Advanced
    ['setup', 'SETUP'], ['get_set', 'GET_SET'], ['value_set', 'VALUE_SET'],
    ['tool_set', 'TOOL_SET'], ['tool', 'TOOL'], ['tools', 'TOOLS'],
    ['util', 'UTIL'], ['utils', 'UTILS'], ['helper', 'HELPER'],
    ['plugin', 'PLUGIN'], ['ext', 'EXT'],
    // UI Layout
    ['ui', 'UI'], ['btn', 'BTN'], ['button', 'BTN'],
    ['topbar', 'TOPBAR'], ['sidebar', 'SIDEBAR'], ['footer', 'FOOTER'],
    ['header', 'HEADER'], ['nav', 'NAV'], ['menu', 'MENU'],
    ['color', 'COLOR'], ['bg', 'BG'], ['background', 'BACKGROUND'],
    ['icon', 'ICON'], ['img', 'IMG'], ['image', 'IMAGE'],
    ['video', 'VIDEO'], ['audio', 'AUDIO'], ['text', 'TEXT'],
    ['title', 'TITLE'], ['subtitle', 'SUBTITLE'],
    ['container', 'CONTAINER'], ['grid', 'GRID'],
    ['flex', 'FLEX'], ['row', 'ROW'], ['col', 'COL'], ['column', 'COLUMN'],
    ['card', 'CARD'], ['modal', 'MODAL'], ['toast', 'TOAST'], ['tooltip', 'TOOLTIP'],
    // Data
    ['data', 'DATA'], ['db', 'DB'], ['database', 'DATABASE'],
    ['store', 'STORE'], ['cache', 'CACHE'], ['state', 'STATE'], ['props', 'PROPS'],
    ['json', 'JSON'], ['csv', 'CSV'], ['xml', 'XML'], ['yaml', 'YAML'],
    // Server
    ['server', 'SERVER'], ['api', 'API'], ['http', 'HTTP'], ['https', 'HTTPS'],
    ['ws', 'WS'], ['websocket', 'WEBSOCKET'],
    ['fetch', 'FETCH'], ['post', 'POST'], ['put', 'PUT'],
    ['delete', 'DELETE'], ['patch', 'PATCH'],
    ['route', 'ROUTE'], ['router', 'ROUTER'], ['endpoint', 'ENDPOINT'],
    ['middleware', 'MIDDLEWARE'], ['auth', 'AUTH'],
    // Group/ID
    ['group', 'GROUP'], ['id', 'ID'], ['name', 'NAME'], ['tag', 'TAG'],
    ['class_name', 'CLASS_NAME'], ['attr', 'ATTR'],
    ['selector', 'SELECTOR'], ['query', 'QUERY'], ['find', 'FIND'],
    ['filter', 'FILTER'], ['sort', 'SORT'],
    // Color
    ['blend', 'BLEND'], ['blend_mode', 'BLEND_MODE'], ['gradient', 'GRADIENT'],
    ['theme', 'THEME'], ['theme_mode', 'THEME_MODE'],
    ['dark', 'DARK'], ['light', 'LIGHT'], ['mode', 'MODE'], ['scheme', 'SCHEME'],
    // Number/Math
    ['number', 'NUMBER'], ['int', 'INT'], ['float', 'FLOAT'], ['double', 'DOUBLE'],
    ['math', 'MATH'], ['calc', 'CALC'], ['random', 'RANDOM'],
    ['round', 'ROUND'], ['floor', 'FLOOR'], ['ceil', 'CEIL'],
    ['abs', 'ABS'], ['min', 'MIN'], ['max', 'MAX'],
    ['sum', 'SUM'], ['avg', 'AVG'], ['count', 'COUNT'],
    // Animation
    ['animate', 'ANIMATE'], ['transition', 'TRANSITION'],
    ['delay', 'DELAY'], ['duration', 'DURATION'], ['easing', 'EASING'],
    ['keyframe', 'KEYFRAME'],
    // Layout
    ['width', 'WIDTH'], ['height', 'HEIGHT'], ['padding', 'PADDING'], ['margin', 'MARGIN'],
    ['border', 'BORDER'], ['radius', 'RADIUS'], ['shadow', 'SHADOW'], ['opacity', 'OPACITY'],
    ['size', 'SIZE'], ['position', 'POSITION'], ['z_index', 'Z_INDEX'],
    ['display', 'DISPLAY'], ['visible', 'VISIBLE'], ['hidden', 'HIDDEN'],
    ['top', 'TOP'], ['left', 'LEFT'], ['right', 'RIGHT'], ['bottom', 'BOTTOM'],
    // Events
    ['key', 'KEY'], ['keydown', 'KEYDOWN'], ['keyup', 'KEYUP'],
    ['click', 'CLICK'], ['hover', 'HOVER'], ['focus', 'FOCUS'], ['blur', 'BLUR'],
    ['submit', 'SUBMIT'], ['change', 'CHANGE'],
    ['on', 'ON'], ['off', 'OFF'], ['bind', 'BIND'], ['ref', 'REF'],
    ['watch', 'WATCH'], ['emit', 'EMIT'],
    // Types
    ['str', 'STR'], ['string', 'STRING'], ['bool', 'BOOL'], ['boolean', 'BOOLEAN'],
    ['null', 'NULL'], ['undefined', 'UNDEFINED'],
    ['in', 'IN'], ['of', 'OF'], ['is', 'IS'], ['as', 'AS'],
    // RGB/HSL
    ['rgb', 'RGB'], ['rgba', 'RGBA'], ['hsl', 'HSL'],
  ]);

  constructor(source: string) {
    this.source = source;
  }

  private peek(offset: number = 0): string {
    const pos = this.position + offset;
    return pos < this.source.length ? this.source[pos] : '\0';
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (/\s/.test(this.peek()) && this.peek() !== '\n') {
      this.advance();
    }
  }

  private readString(quote: string): string {
    let value = '';
    this.advance();
    while (this.peek() !== quote && this.peek() !== '\0') {
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escaped;
        }
      } else {
        value += this.advance();
      }
    }
    this.advance();
    return value;
  }

  private readNumber(): string {
    let value = '';
    let hasDot = false;
    while (/[0-9.]/.test(this.peek())) {
      if (this.peek() === '.') {
        if (hasDot) break;
        hasDot = true;
      }
      value += this.advance();
    }
    return value;
  }

  private readIdentifier(): string {
    let value = '';
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.advance();
    }
    return value;
  }

  private readHexColor(): string {
    let value = '#';
    this.advance();
    while (/[0-9a-fA-F]/.test(this.peek()) && value.length < 7) {
      value += this.advance();
    }
    return value;
  }

  private readComment(): string {
    let value = '';
    while (this.peek() !== '\n' && this.peek() !== '\0') {
      value += this.advance();
    }
    return value;
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length,
    });
  }

  public tokenize(): Token[] {
    while (this.position < this.source.length) {
      const char = this.peek();

      if (/\s/.test(char) && char !== '\n') {
        this.skipWhitespace();
        continue;
      }

      if (char === '\n') {
        this.addToken('NEWLINE', '\n');
        this.advance();
        continue;
      }

      if (char === '#') {
        if (/[0-9a-fA-F]/.test(this.peek(1))) {
          const color = this.readHexColor();
          this.addToken('HEX_COLOR', color);
        } else {
          this.readComment();
        }
        continue;
      }

      // Tilde prefix
      if (char === '~') {
        this.advance();
        const next = this.peek();
        
        if (/[a-zA-Z]/.test(next)) {
          const word = this.readIdentifier();
          const keywordType = this.keywords.get(word);
          if (keywordType) {
            this.addToken(keywordType, `~${word}`);
          } else {
            this.addToken('IDENTIFIER', `~${word}`);
          }
          continue;
        }
        
        if (next === 's') {
          this.advance();
          this.addToken('SET', '~s');
          continue;
        }
        if (next === 'g') {
          this.advance();
          this.addToken('GET', '~g');
          continue;
        }
        
        this.addToken('TILDE', '~');
        continue;
      }

      // At prefix for events
      if (char === '@') {
        this.advance();
        const word = this.readIdentifier();
        const keywordType = this.keywords.get(word);
        if (keywordType) {
          this.addToken(keywordType, `@${word}`);
        } else {
          this.addToken('AT', `@${word}`);
        }
        continue;
      }

      // Dollar prefix
      if (char === '$') {
        this.advance();
        const word = this.readIdentifier();
        this.addToken('IDENTIFIER', `$${word}`);
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        const value = this.readString(char);
        this.addToken('STRING', value);
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        const value = this.readNumber();
        this.addToken('NUMBER', value);
        continue;
      }

      // Identifiers
      if (/[a-zA-Z_]/.test(char)) {
        const value = this.readIdentifier();
        const type = this.keywords.get(value) || 'IDENTIFIER';
        this.addToken(type, value);
        continue;
      }

      // Operators
      switch (char) {
        case '+':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '+=');
          } else {
            this.addToken('PLUS', '+');
          }
          break;
        case '-':
          this.advance();
          if (this.peek() === '>') {
            this.advance();
            this.addToken('ARROW', '->');
          } else if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '-=');
          } else {
            this.addToken('MINUS', '-');
          }
          break;
        case '*':
          this.advance();
          if (this.peek() === '*') {
            this.advance();
            this.addToken('POWER', '**');
          } else if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '*=');
          } else {
            this.addToken('MULTIPLY', '*');
          }
          break;
        case '/':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '/=');
          } else if (this.peek() === '/') {
            this.readComment();
          } else {
            this.addToken('DIVIDE', '/');
          }
          break;
        case '%':
          this.advance();
          this.addToken('MODULO', '%');
          break;
        case '=':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('EQ', '==');
          } else if (this.peek() === '>') {
            this.advance();
            this.addToken('FAT_ARROW', '=>');
          } else {
            this.addToken('ASSIGN', '=');
          }
          break;
        case ':':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('COLON_ASSIGN', ':=');
          } else {
            this.addToken('COLON', ':');
          }
          break;
        case '!':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('NEQ', '!=');
          } else {
            this.addToken('EXCLAMATION', '!');
          }
          break;
        case '?':
          this.advance();
          if (this.peek() === '?') {
            this.advance();
            this.addToken('NULLISH', '??');
          } else if (this.peek() === '.') {
            this.advance();
            this.addToken('OPTIONAL', '?.');
          } else {
            this.addToken('QUESTION', '?');
          }
          break;
        case '<':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('LTE', '<=');
          } else if (this.peek() === '-') {
            this.advance();
            this.addToken('ARROW_ASSIGN', '<-');
          } else {
            this.addToken('LT', '<');
          }
          break;
        case '>':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('GTE', '>=');
          } else {
            this.addToken('GT', '>');
          }
          break;
        case '&':
          this.advance();
          if (this.peek() === '&') {
            this.advance();
            this.addToken('AND', '&&');
          } else {
            this.addToken('AMPERSAND', '&');
          }
          break;
        case '|':
          this.advance();
          if (this.peek() === '|') {
            this.advance();
            this.addToken('OR', '||');
          } else if (this.peek() === '>') {
            this.advance();
            this.addToken('PIPE', '|>');
          } else {
            this.addToken('PIPE', '|');
          }
          break;
        case '.':
          this.advance();
          if (this.peek() === '.' && this.peek(1) === '.') {
            this.advance();
            this.advance();
            this.addToken('SPREAD', '...');
          } else {
            this.addToken('DOT', '.');
          }
          break;
        case '(':
          this.advance();
          this.addToken('LPAREN', '(');
          break;
        case ')':
          this.advance();
          this.addToken('RPAREN', ')');
          break;
        case '{':
          this.advance();
          this.addToken('LBRACE', '{');
          break;
        case '}':
          this.advance();
          this.addToken('RBRACE', '}');
          break;
        case '[':
          this.advance();
          this.addToken('LBRACKET', '[');
          break;
        case ']':
          this.advance();
          this.addToken('RBRACKET', ']');
          break;
        case ',':
          this.advance();
          this.addToken('COMMA', ',');
          break;
        case ';':
          this.advance();
          this.addToken('SEMICOLON', ';');
          break;
        default:
          this.advance();
      }
    }

    this.addToken('EOF', '');
    return this.tokens;
  }
}

// ============================================
// PARSER - AST Builder
// ============================================
export class DroyParserV3 {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset: number = 0): Token {
    const pos = this.position + offset;
    return pos < this.tokens.length ? this.tokens[pos] : this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    return this.tokens[this.position++];
  }

  private expect(type: TokenType): Token {
    const token = this.advance();
    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type} at line ${token.line}`);
    }
    return token;
  }

  private match(...types: TokenType[]): boolean {
    return types.includes(this.peek().type);
  }

  private skipNewlines(): void {
    while (this.match('NEWLINE')) {
      this.advance();
    }
  }

  public parse(): ASTNode {
    const statements: ASTNode[] = [];
    this.skipNewlines();
    
    while (!this.match('EOF')) {
      const stmt = this.parseStatement();
      if (stmt.type !== 'Empty') {
        statements.push(stmt);
      }
      this.skipNewlines();
    }

    return { type: 'Program', body: statements };
  }

  private parseStatement(): ASTNode {
    this.skipNewlines();

    // SET naming: set=topbar=s+d
    if (this.match('SET')) {
      const next = this.peek(1);
      if (next.type === 'ASSIGN') {
        return this.parseSetNaming();
      }
      return this.parseSet();
    }

    // SETUP: setup=get: sty
    if (this.match('SETUP')) {
      return this.parseSetup();
    }

    // TOOL: tool=get:
    if (this.match('TOOL')) {
      return this.parseTool();
    }

    // GET_SET
    if (this.match('GET_SET')) {
      return this.parseGetSet();
    }

    // VALUE_SET: value-set=(a=1,s=2,c+s=3)
    if (this.match('VALUE_SET')) {
      return this.parseValueSet();
    }

    // DATA
    if (this.match('DATA')) {
      return this.parseData();
    }

    // SERVER
    if (this.match('SERVER')) {
      return this.parseServer();
    }

    // GROUP/ID/NAME
    if (this.match('GROUP', 'ID', 'NAME')) {
      return this.parseGroupIdName();
    }

    // Color blending
    if (this.match('BLEND', 'BLEND_MODE', 'GRADIENT')) {
      return this.parseColorBlend();
    }

    // Math operations
    if (this.match('MATH', 'CALC', 'SUM', 'AVG', 'MIN', 'MAX', 'RANDOM')) {
      return this.parseMathOperation();
    }

    // UI Components
    if (this.match('BTN', 'IMG', 'IMAGE', 'VIDEO', 'AUDIO', 'ICON', 
                   'COLOR', 'BG', 'BACKGROUND', 'TEXT', 'TITLE', 'SUBTITLE',
                   'CONTAINER', 'GRID', 'FLEX', 'ROW', 'COL', 'COLUMN',
                   'CARD', 'MODAL', 'TOAST', 'TOOLTIP',
                   'TOPBAR', 'SIDEBAR', 'FOOTER', 'HEADER', 'NAV', 'MENU')) {
      return this.parseUIComponent();
    }

    // Events
    if (this.match('CLICK', 'HOVER', 'FOCUS', 'BLUR', 'KEYDOWN', 'KEYUP', 
                   'SUBMIT', 'CHANGE', 'ON', 'OFF')) {
      return this.parseEventHandler();
    }

    // Core statements
    if (this.match('GET')) return this.parseGet();
    if (this.match('VAR')) return this.parseVar();
    if (this.match('FUNC')) return this.parseFunc();
    if (this.match('IF')) return this.parseIf();
    if (this.match('FOR')) return this.parseFor();
    if (this.match('WHILE')) return this.parseWhile();
    if (this.match('RETURN')) return this.parseReturn();
    if (this.match('PRINT')) return this.parsePrint();
    if (this.match('CLASS')) return this.parseClass();
    if (this.match('IMPORT')) return this.parseImport();
    if (this.match('EXPORT')) return this.parseExport();
    if (this.match('BIND')) return this.parseBind();
    if (this.match('REF')) return this.parseRef();
    if (this.match('WATCH')) return this.parseWatch();
    if (this.match('EMIT')) return this.parseEmit();

    // Server requests
    if (this.match('FETCH', 'POST', 'PUT', 'DELETE', 'PATCH')) {
      return this.parseServerRequest();
    }

    // Layout properties
    if (this.match('WIDTH', 'HEIGHT', 'PADDING', 'MARGIN', 'BORDER', 
                   'RADIUS', 'SHADOW', 'OPACITY', 'SIZE', 'POSITION',
                   'TOP', 'LEFT', 'RIGHT', 'BOTTOM', 'Z_INDEX')) {
      return this.parseLayoutProperty();
    }

    if (this.match('IDENTIFIER')) {
      return this.parseExpressionStatement();
    }

    this.advance();
    return { type: 'Empty' };
  }

  // SET naming: set=topbar=s+d
  private parseSetNaming(): ASTNode {
    this.advance(); // SET
    this.expect('ASSIGN');
    const name = this.expect('IDENTIFIER').value;
    
    let expression = null;
    if (this.match('ASSIGN')) {
      this.advance();
      expression = this.parseExpression();
    }

    return {
      type: 'SetNaming',
      name,
      expression,
    };
  }

  // SETUP: setup=get: sty
  private parseSetup(): ASTNode {
    this.advance(); // SETUP
    
    let action = null;
    let target = null;
    
    if (this.match('ASSIGN')) {
      this.advance();
      action = this.advance().value;
      if (this.match('COLON')) {
        this.advance();
        target = this.parseExpression();
      }
    }

    return {
      type: 'Setup',
      action,
      target,
    };
  }

  // TOOL: tool=get:
  private parseTool(): ASTNode {
    this.advance(); // TOOL
    
    let action = null;
    let config = null;
    
    if (this.match('ASSIGN')) {
      this.advance();
      action = this.advance().value;
      if (this.match('COLON')) {
        this.advance();
        config = this.parseExpression();
      }
    }

    return {
      type: 'Tool',
      action,
      config,
    };
  }

  // GET_SET
  private parseGetSet(): ASTNode {
    this.advance(); // GET_SET
    
    let properties: Record<string, any> = {};
    
    while (this.match('IDENTIFIER') || this.match('STRING') || this.match('NUMBER')) {
      const key = this.advance().value;
      if (this.match('COLON') || this.match('ASSIGN')) {
        this.advance();
        properties[key] = this.parseExpression();
      }
    }

    return {
      type: 'GetSet',
      properties,
    };
  }

  // VALUE_SET: value-set=(a=1,s=2,c+s=3)
  private parseValueSet(): ASTNode {
    this.advance(); // VALUE_SET
    
    let assignments: Array<{ name: string; value: ASTNode; operation?: string }> = [];
    
    if (this.match('ASSIGN')) {
      this.advance();
      this.expect('LPAREN');
      
      while (!this.match('RPAREN') && !this.match('EOF')) {
        const name = this.expect('IDENTIFIER').value;
        
        let operation: string | undefined = undefined;
        if (this.match('PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE')) {
          operation = this.advance().value;
          this.expect('IDENTIFIER'); // consume second identifier
        }
        
        this.expect('ASSIGN');
        const value = this.parseExpression();
        
        assignments.push({ name, value, operation });
        
        if (this.match('COMMA')) {
          this.advance();
        }
      }
      
      this.expect('RPAREN');
    }

    return {
      type: 'ValueSet',
      assignments,
    };
  }

  // DATA
  private parseData(): ASTNode {
    this.advance(); // DATA
    
    let name = null;
    let source = null;
    let format = 'json';
    
    if (this.match('IDENTIFIER')) {
      name = this.advance().value;
    }
    
    if (this.match('ASSIGN')) {
      this.advance();
      source = this.parseExpression();
    }
    
    if (this.match('COLON')) {
      this.advance();
      if (this.match('JSON', 'CSV', 'XML', 'YAML')) {
        format = this.advance().value.toLowerCase();
      }
    }

    return {
      type: 'Data',
      name,
      source,
      format,
    };
  }

  // SERVER
  private parseServer(): ASTNode {
    this.advance(); // SERVER
    
    let config: Record<string, any> = {};
    
    if (this.match('ASSIGN')) {
      this.advance();
      config.endpoint = this.parseExpression();
    }
    
    // Parse additional config
    while (this.match('IDENTIFIER')) {
      const key = this.advance().value;
      if (this.match('COLON') || this.match('ASSIGN')) {
        this.advance();
        config[key] = this.parseExpression();
      }
    }

    return {
      type: 'Server',
      config,
    };
  }

  // GROUP/ID/NAME
  private parseGroupIdName(): ASTNode {
    const type = this.advance().type;
    
    let name = null;
    let value = null;
    
    if (this.match('ASSIGN')) {
      this.advance();
      name = this.parseExpression();
    }
    
    if (this.match('COLON')) {
      this.advance();
      value = this.parseExpression();
    }

    return {
      type: 'GroupIdName',
      kind: type.toLowerCase(),
      name,
      value,
    };
  }

  // Color blending
  private parseColorBlend(): ASTNode {
    const blendType = this.advance().type;
    
    let colors: string[] = [];
    let mode = 'normal';
    
    if (this.match('COLON')) {
      this.advance();
      
      while (this.match('HEX_COLOR', 'IDENTIFIER') || this.match('STRING')) {
        colors.push(this.advance().value);
        if (this.match('COMMA')) {
          this.advance();
        }
      }
    }
    
    if (this.match('BLEND_MODE')) {
      this.advance();
      if (this.match('COLON')) {
        this.advance();
        mode = this.expect('IDENTIFIER').value;
      }
    }

    return {
      type: 'ColorBlend',
      blendType: blendType.toLowerCase(),
      colors,
      mode,
    };
  }

  // Math operations
  private parseMathOperation(): ASTNode {
    const op = this.advance().type;
    
    let values: ASTNode[] = [];
    
    if (this.match('LPAREN')) {
      this.advance();
      while (!this.match('RPAREN') && !this.match('EOF')) {
        values.push(this.parseExpression());
        if (this.match('COMMA')) {
          this.advance();
        }
      }
      this.expect('RPAREN');
    } else if (this.match('COLON')) {
      this.advance();
      values.push(this.parseExpression());
    }

    return {
      type: 'MathOperation',
      operation: op.toLowerCase(),
      values,
    };
  }

  // Server requests
  private parseServerRequest(): ASTNode {
    const method = this.advance().type;
    
    let url = null;
    let options: Record<string, any> = {};
    
    if (this.match('COLON')) {
      this.advance();
      url = this.parseExpression();
    }
    
    // Parse options
    while (this.match('IDENTIFIER')) {
      const key = this.advance().value;
      if (this.match('COLON') || this.match('ASSIGN')) {
        this.advance();
        options[key] = this.parseExpression();
      }
    }

    return {
      type: 'ServerRequest',
      method: method.toLowerCase(),
      url,
      options,
    };
  }

  private parseUIComponent(): ASTNode {
    const componentType = this.advance().type;
    const props: Record<string, any> = {};
    let children: ASTNode[] = [];

    while (this.match('COLON') || this.match('IDENTIFIER') || 
           this.match('STRING') || this.match('HEX_COLOR') ||
           this.match('NUMBER') ||
           this.match('WIDTH') || this.match('HEIGHT') ||
           this.match('COLOR') || this.match('BG') || this.match('BACKGROUND')) {
      
      if (this.match('COLON')) {
        this.advance();
        const value = this.parseExpression();
        props.value = value;
      } else if (this.match('IDENTIFIER')) {
        const key = this.advance().value;
        if (this.match('COLON') || this.match('ASSIGN')) {
          this.advance();
          props[key] = this.parseExpression();
        }
      } else if (this.match('STRING')) {
        props.text = this.advance().value;
      } else if (this.match('HEX_COLOR')) {
        props.color = this.advance().value;
      } else if (this.match('NUMBER')) {
        props.value = parseFloat(this.advance().value);
      } else if (this.match('WIDTH', 'HEIGHT', 'COLOR', 'BG', 'BACKGROUND')) {
        const key = this.advance().value.toLowerCase();
        if (this.match('COLON') || this.match('ASSIGN')) {
          this.advance();
          props[key] = this.parseExpression();
        }
      } else {
        break;
      }
    }

    if (this.match('LBRACE')) {
      this.advance();
      while (!this.match('RBRACE') && !this.match('EOF')) {
        children.push(this.parseStatement());
        this.skipNewlines();
      }
      this.expect('RBRACE');
    }

    return {
      type: 'UIComponent',
      component: componentType,
      props,
      children,
    };
  }

  private parseEventHandler(): ASTNode {
    const event = this.advance().value;
    let handler: ASTNode | null = null;

    if (this.match('FAT_ARROW')) {
      this.advance();
      if (this.match('LBRACE')) {
        this.advance();
        const body: ASTNode[] = [];
        while (!this.match('RBRACE') && !this.match('EOF')) {
          body.push(this.parseStatement());
          this.skipNewlines();
        }
        this.expect('RBRACE');
        handler = { type: 'BlockStatement', body };
      } else {
        handler = this.parseExpression();
      }
    }

    return {
      type: 'EventHandler',
      event,
      handler,
    };
  }

  private parseSet(): ASTNode {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    this.expect('ASSIGN');
    const value = this.parseExpression();
    
    return {
      type: 'SetDeclaration',
      name,
      value,
    };
  }

  private parseGet(): ASTNode {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    
    return {
      type: 'GetExpression',
      name,
    };
  }

  private parseVar(): ASTNode {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    this.expect('ASSIGN');
    const value = this.parseExpression();
    
    return {
      type: 'VariableDeclaration',
      name,
      value,
    };
  }

  private parseFunc(): ASTNode {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    this.expect('LPAREN');
    
    const params: string[] = [];
    while (!this.match('RPAREN') && !this.match('EOF')) {
      params.push(this.expect('IDENTIFIER').value);
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    this.expect('RPAREN');
    
    this.expect('LBRACE');
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    };
  }

  private parseIf(): ASTNode {
    this.advance();
    const condition = this.parseExpression();
    this.expect('LBRACE');
    
    const consequent: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      consequent.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    let alternate: ASTNode[] | null = null;
    if (this.match('ELSE')) {
      this.advance();
      if (this.match('IF')) {
        alternate = [this.parseIf()];
      } else {
        this.expect('LBRACE');
        alternate = [];
        while (!this.match('RBRACE') && !this.match('EOF')) {
          alternate.push(this.parseStatement());
          this.skipNewlines();
        }
        this.expect('RBRACE');
      }
    }
    
    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate,
    };
  }

  private parseFor(): ASTNode {
    this.advance();
    const iterator = this.expect('IDENTIFIER').value;
    this.expect('IDENTIFIER'); // 'in'
    const iterable = this.parseExpression();
    this.expect('LBRACE');
    
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'ForLoop',
      iterator,
      iterable,
      body,
    };
  }

  private parseWhile(): ASTNode {
    this.advance();
    const condition = this.parseExpression();
    this.expect('LBRACE');
    
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'WhileLoop',
      condition,
      body,
    };
  }

  private parseReturn(): ASTNode {
    this.advance();
    const value = this.parseExpression();
    return {
      type: 'ReturnStatement',
      value,
    };
  }

  private parsePrint(): ASTNode {
    this.advance();
    const value = this.parseExpression();
    return {
      type: 'PrintStatement',
      value,
    };
  }

  private parseClass(): ASTNode {
    this.advance();
    const name = this.expect('IDENTIFIER').value;
    this.expect('LBRACE');
    
    const methods: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      methods.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'ClassDeclaration',
      name,
      methods,
    };
  }

  private parseImport(): ASTNode {
    this.advance();
    const path = this.expect('STRING').value;
    return {
      type: 'ImportStatement',
      path,
    };
  }

  private parseExport(): ASTNode {
    this.advance();
    const declaration = this.parseStatement();
    return {
      type: 'ExportStatement',
      declaration,
    };
  }

  private parseBind(): ASTNode {
    this.advance();
    const target = this.match('IDENTIFIER') ? this.advance().value : null;
    let source = null;
    
    if (this.match('COLON')) {
      this.advance();
      source = this.parseExpression();
    }

    return {
      type: 'Binding',
      target,
      source,
    };
  }

  private parseRef(): ASTNode {
    this.advance();
    const name = this.match('IDENTIFIER') ? this.advance().value : null;

    return {
      type: 'Ref',
      name,
    };
  }

  private parseWatch(): ASTNode {
    this.advance();
    const target = this.parseExpression();
    let handler = null;
    
    if (this.match('FAT_ARROW')) {
      this.advance();
      handler = this.parseExpression();
    }

    return {
      type: 'Watch',
      target,
      handler,
    };
  }

  private parseEmit(): ASTNode {
    this.advance();
    const event = this.parseExpression();
    let data = null;
    
    if (this.match('COMMA')) {
      this.advance();
      data = this.parseExpression();
    }

    return {
      type: 'Emit',
      event,
      data,
    };
  }

  private parseLayoutProperty(): ASTNode {
    const property = this.advance().value;
    let value: ASTNode | null = null;

    if (this.match('COLON') || this.match('ASSIGN')) {
      this.advance();
      value = this.parseExpression();
    }

    return {
      type: 'LayoutProperty',
      property: property.toLowerCase(),
      value,
    };
  }

  private parseExpressionStatement(): ASTNode {
    const expr = this.parseExpression();
    return {
      type: 'ExpressionStatement',
      expression: expr,
    };
  }

  private parseExpression(): ASTNode {
    return this.parsePipe();
  }

  private parsePipe(): ASTNode {
    let left = this.parseOr();
    
    while (this.match('PIPE')) {
      this.advance();
      const right = this.parseOr();
      left = {
        type: 'PipeExpression',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();
    
    while (this.match('OR')) {
      this.advance();
      const right = this.parseAnd();
      left = {
        type: 'LogicalExpression',
        operator: '||',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseEquality();
    
    while (this.match('AND')) {
      this.advance();
      const right = this.parseEquality();
      left = {
        type: 'LogicalExpression',
        operator: '&&',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseComparison();
    
    while (this.match('EQ', 'NEQ')) {
      const op = this.advance().value;
      const right = this.parseComparison();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parseAdditive();
    
    while (this.match('LT', 'GT', 'LTE', 'GTE')) {
      const op = this.advance().value;
      const right = this.parseAdditive();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    
    while (this.match('PLUS', 'MINUS')) {
      const op = this.advance().value;
      const right = this.parseMultiplicative();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parsePower();
    
    while (this.match('MULTIPLY', 'DIVIDE', 'MODULO')) {
      const op = this.advance().value;
      const right = this.parsePower();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parsePower(): ASTNode {
    let left = this.parseUnary();
    
    while (this.match('POWER')) {
      this.advance();
      const right = this.parseUnary();
      left = {
        type: 'BinaryExpression',
        operator: '**',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match('NOT', 'MINUS')) {
      const op = this.advance().value;
      const operand = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator: op,
        operand,
      };
    }
    
    return this.parseCall();
  }

  private parseCall(): ASTNode {
    let callee = this.parsePrimary();
    
    if (this.match('LPAREN')) {
      this.advance();
      const args: ASTNode[] = [];
      while (!this.match('RPAREN') && !this.match('EOF')) {
        args.push(this.parseExpression());
        if (this.match('COMMA')) {
          this.advance();
        }
      }
      this.expect('RPAREN');
      
      return {
        type: 'CallExpression',
        callee,
        arguments: args,
      };
    }
    
    return callee;
  }

  private parsePrimary(): ASTNode {
    if (this.match('NUMBER')) {
      const value = this.advance().value;
      return {
        type: 'NumberLiteral',
        value: parseFloat(value),
      };
    }
    
    if (this.match('STRING')) {
      const value = this.advance().value;
      return {
        type: 'StringLiteral',
        value,
      };
    }
    
    if (this.match('HEX_COLOR')) {
      const value = this.advance().value;
      return {
        type: 'ColorLiteral',
        value,
      };
    }
    
    if (this.match('BOOLEAN')) {
      const value = this.advance().value;
      return {
        type: 'BooleanLiteral',
        value: value === 'true',
      };
    }
    
    if (this.match('NULL')) {
      this.advance();
      return {
        type: 'NullLiteral',
        value: null,
      };
    }
    
    if (this.match('GET', 'IDENTIFIER')) {
      const name = this.advance().value;
      return {
        type: 'Identifier',
        name,
      };
    }
    
    if (this.match('LPAREN')) {
      this.advance();
      const expr = this.parseExpression();
      this.expect('RPAREN');
      return expr;
    }
    
    if (this.match('LBRACKET')) {
      return this.parseArray();
    }
    
    if (this.match('LBRACE')) {
      return this.parseObject();
    }
    
    this.advance();
    return { type: 'Empty' };
  }

  private parseArray(): ASTNode {
    this.advance();
    const elements: ASTNode[] = [];
    
    while (!this.match('RBRACKET') && !this.match('EOF')) {
      elements.push(this.parseExpression());
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    
    this.expect('RBRACKET');
    return {
      type: 'ArrayLiteral',
      elements,
    };
  }

  private parseObject(): ASTNode {
    this.advance();
    const properties: { key: string; value: ASTNode }[] = [];
    
    while (!this.match('RBRACE') && !this.match('EOF')) {
      const key = this.expect('IDENTIFIER').value;
      this.expect('COLON');
      const value = this.parseExpression();
      properties.push({ key, value });
      
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    
    this.expect('RBRACE');
    return {
      type: 'ObjectLiteral',
      properties,
    };
  }
}

// ============================================
// UI GENERATOR
// ============================================
export class DroyUIGeneratorV3 {
  private output: string = '';
  private styles: string = '';
  private styleCounter: number = 0;
  private scripts: string = '';

  private generateClassName(): string {
    return `droy-${this.styleCounter++}`;
  }

  public generate(ast: ASTNode): { html: string; css: string; js: string } {
    if (ast.type === 'Program') {
      const htmlParts: string[] = [];
      
      for (const stmt of ast.body) {
        const result = this.generateStatement(stmt);
        if (result) {
          htmlParts.push(result);
        }
      }
      
      this.output = htmlParts.join('\n');
    }

    return {
      html: this.output,
      css: this.styles,
      js: this.scripts,
    };
  }

  private generateStatement(node: ASTNode): string {
    switch (node.type) {
      case 'UIComponent':
        return this.generateUIComponent(node);
      case 'SetNaming':
        return `<!-- set: ${node.name} -->`;
      case 'Setup':
        return `<!-- setup: ${node.action} -->`;
      case 'Tool':
        return `<!-- tool: ${node.action} -->`;
      case 'Data':
        return this.generateData(node);
      case 'Server':
        return this.generateServer(node);
      case 'ServerRequest':
        return this.generateServerRequest(node);
      case 'ColorBlend':
        return this.generateColorBlend(node);
      case 'MathOperation':
        return `<!-- math: ${node.operation} -->`;
      case 'VariableDeclaration':
      case 'SetDeclaration':
        return `<!-- ${node.name} = ${JSON.stringify(node.value)} -->`;
      case 'PrintStatement':
        return `<script>console.log(${this.generateExpression(node.value)})</script>`;
      default:
        return '';
    }
  }

  private generateUIComponent(node: ASTNode): string {
    const className = this.generateClassName();
    const component = node.component.toLowerCase();
    const props = node.props || {};
    const children = node.children || [];

    let tag = 'div';
    let attributes = `class="${className}"`;
    let content = '';

    let cssRules = `.${className} {`;

    // Layout components
    switch (component) {
      case 'topbar':
        cssRules += `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${props.bg || '#1e293b'};
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;`;
        break;

      case 'sidebar':
        cssRules += `
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props.width || '250px'};
  background: ${props.bg || '#1e293b'};
  padding: 20px;
  z-index: 999;`;
        break;

      case 'footer':
        cssRules += `
  background: ${props.bg || '#0f172a'};
  padding: 40px 20px;
  text-align: center;`;
        break;

      case 'header':
        cssRules += `
  background: ${props.bg || 'linear-gradient(135deg, #6366f1, #a855f7)'};
  padding: 60px 20px;
  text-align: center;`;
        break;

      case 'nav':
        cssRules += `
  display: flex;
  gap: 20px;
  align-items: center;`;
        break;

      case 'menu':
        cssRules += `
  list-style: none;
  padding: 0;
  margin: 0;`;
        tag = 'ul';
        break;

      case 'btn':
      case 'button':
        tag = 'button';
        cssRules += `
  padding: 12px 24px;
  border: none;
  border-radius: ${props.radius || '8px'};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  background: ${props.color || 'linear-gradient(135deg, #6366f1, #a855f7)'};
  color: white;`;
        content = props.text || props.value || 'Button';
        break;

      case 'img':
      case 'image':
        tag = 'img';
        const src = props.src || props.value || '';
        attributes += ` src="${src}" alt="${props.alt || ''}"`;
        cssRules += `
  max-width: 100%;
  height: auto;
  border-radius: ${props.radius || '8px'};`;
        break;

      case 'video':
        tag = 'video';
        const videoSrc = props.src || props.value || '';
        attributes += ` src="${videoSrc}" controls`;
        if (props.autoplay) attributes += ' autoplay';
        if (props.loop) attributes += ' loop';
        if (props.muted) attributes += ' muted';
        cssRules += `
  max-width: 100%;
  border-radius: ${props.radius || '8px'};`;
        break;

      case 'audio':
        tag = 'audio';
        const audioSrc = props.src || props.value || '';
        attributes += ` src="${audioSrc}" controls`;
        break;

      case 'icon':
        tag = 'span';
        cssRules += `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props.size || '24px'};
  height: ${props.size || '24px'};`;
        content = props.text || '★';
        break;

      case 'text':
        tag = 'p';
        cssRules += `
  margin: 0;
  line-height: 1.6;
  color: ${props.color || 'inherit'};`;
        if (props.size) {
          cssRules += `
  font-size: ${props.size};`;
        }
        content = props.text || props.value || '';
        break;

      case 'title':
        tag = 'h1';
        cssRules += `
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: ${props.color || 'inherit'};`;
        content = props.text || props.value || 'Title';
        break;

      case 'subtitle':
        tag = 'h2';
        cssRules += `
  margin: 0;
  font-size: 1.5rem;
  color: ${props.color || 'inherit'};`;
        content = props.text || props.value || 'Subtitle';
        break;

      case 'container':
        cssRules += `
  padding: ${props.padding || '20px'};
  margin: ${props.margin || '0'};
  background: ${props.bg || 'transparent'};
  border-radius: ${props.radius || '0'};`;
        break;

      case 'card':
        cssRules += `
  padding: 24px;
  border-radius: 16px;
  background: ${props.bg || 'white'};
  box-shadow: ${props.shadow || '0 4px 20px rgba(0,0,0,0.1)'};`;
        break;

      case 'grid':
        cssRules += `
  display: grid;
  grid-template-columns: repeat(${props.cols || '3'}, 1fr);
  gap: ${props.gap || '16px'};`;
        break;

      case 'flex':
      case 'row':
        cssRules += `
  display: flex;
  flex-direction: ${component === 'row' ? 'row' : 'column'};
  gap: ${props.gap || '16px'};`;
        if (props.align) {
          cssRules += `
  align-items: ${props.align};`;
        }
        if (props.justify) {
          cssRules += `
  justify-content: ${props.justify};`;
        }
        break;

      case 'col':
      case 'column':
        cssRules += `
  display: flex;
  flex-direction: column;
  gap: ${props.gap || '16px'};`;
        break;

      case 'modal':
        cssRules += `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  z-index: 1000;`;
        break;

      case 'color':
        tag = 'div';
        cssRules += `
  width: ${props.width || '100px'};
  height: ${props.height || '100px'};
  background: ${props.value || props.color || '#6366f1'};
  border-radius: ${props.radius || '8px'};`;
        break;

      case 'bg':
      case 'background':
        tag = 'div';
        cssRules += `
  position: fixed;
  inset: 0;
  background: ${props.value || props.color || 'linear-gradient(135deg, #6366f1, #a855f7)'};
  z-index: -1;`;
        break;

      default:
        cssRules += `
  padding: 16px;`;
    }

    if (props.width) cssRules += `
  width: ${props.width};`;
    if (props.height) cssRules += `
  height: ${props.height};`;
    if (props.margin) cssRules += `
  margin: ${props.margin};`;
    if (props.padding) cssRules += `
  padding: ${props.padding};`;
    if (props.radius || props.borderradius) cssRules += `
  border-radius: ${props.radius || props.borderradius};`;
    if (props.shadow) cssRules += `
  box-shadow: ${props.shadow};`;
    if (props.opacity !== undefined) cssRules += `
  opacity: ${props.opacity};`;
    if (props.z_index) cssRules += `
  z-index: ${props.z_index};`;

    cssRules += '\n}';
    this.styles += cssRules + '\n';

    const childrenHtml = children.map((child: ASTNode) => this.generateStatement(child)).join('\n');

    if (tag === 'img' || tag === 'video' || tag === 'audio' || tag === 'input') {
      return `<${tag} ${attributes} />`;
    }

    return `<${tag} ${attributes}>${content}${childrenHtml}</${tag}>`;
  }

  private generateData(node: ASTNode): string {
    const dataId = `data-${Math.random().toString(36).substr(2, 9)}`;
    this.scripts += `
// Data: ${node.name}
const ${node.name || dataId} = ${JSON.stringify(node.source || {})};
`;
    return `<script>/* Data: ${node.name} */</script>`;
  }

  private generateServer(node: ASTNode): string {
    this.scripts += `
// Server config
const serverConfig = ${JSON.stringify(node.config || {})};
`;
    return `<!-- Server configured -->`;
  }

  private generateServerRequest(node: ASTNode): string {
    this.scripts += `
// ${node.method.toUpperCase()} request
fetch('${node.url}', {
  method: '${node.method.toUpperCase()}',
  ...${JSON.stringify(node.options || {})}
});
`;
    return `<!-- ${node.method.toUpperCase()} ${node.url} -->`;
  }

  private generateColorBlend(node: ASTNode): string {
    const className = this.generateClassName();
    const colors = node.colors || [];
    
    let gradient = '';
    if (node.blendType === 'gradient') {
      gradient = `linear-gradient(135deg, ${colors.join(', ')})`;
    } else if (node.blendType === 'blend') {
      gradient = `mix-blend-mode: ${node.mode}; background: ${colors[0] || '#000'}`;
    }

    this.styles += `.${className} {
  background: ${gradient};
  width: 200px;
  height: 200px;
  border-radius: 12px;
}\n`;

    return `<div class="${className}"></div>`;
  }

  private generateExpression(node: ASTNode): string {
    switch (node.type) {
      case 'NumberLiteral':
        return String(node.value);
      case 'StringLiteral':
        return `"${node.value}"`;
      case 'ColorLiteral':
        return `"${node.value}"`;
      case 'BooleanLiteral':
        return String(node.value);
      case 'NullLiteral':
        return 'null';
      case 'Identifier':
        return node.name;
      default:
        return 'null';
    }
  }
}

// Main Compiler class
export class DroyCompilerV3 {
  public compile(source: string): { 
    tokens: Token[]; 
    ast: ASTNode; 
    html: string;
    css: string;
    js: string;
  } {
    const lexer = new DroyLexerV3(source);
    const tokens = lexer.tokenize();

    const parser = new DroyParserV3(tokens);
    const ast = parser.parse();

    const uiGenerator = new DroyUIGeneratorV3();
    const { html, css, js } = uiGenerator.generate(ast);

    return { tokens, ast, html, css, js };
  }

  public tokenize(source: string): Token[] {
    const lexer = new DroyLexerV3(source);
    return lexer.tokenize();
  }

  public parse(source: string): ASTNode {
    const lexer = new DroyLexerV3(source);
    const tokens = lexer.tokenize();
    const parser = new DroyParserV3(tokens);
    return parser.parse();
  }

  public generateUI(source: string): { html: string; css: string; js: string } {
    const ast = this.parse(source);
    const generator = new DroyUIGeneratorV3();
    return generator.generate(ast);
  }
}

export default DroyCompilerV3;
