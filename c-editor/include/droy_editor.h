/**
 * Droy Code Editor - Header File
 * ================================
 * A complete terminal-based code editor for Droy Language
 * Built with ncurses for Unix/Linux systems
 *
 * Features:
 * - Syntax highlighting for Droy language
 * - Multi-file editing
 * - Line numbers
 * - Search and replace
 * - Auto-indentation
 * - File explorer sidebar
 */

#ifndef DROY_EDITOR_H
#define DROY_EDITOR_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>
#include <ncurses.h>

/* ============ VERSION ============ */
#define DROY_EDITOR_VERSION "1.0.0"
#define DROY_EDITOR_NAME "Droy Editor"

/* ============ CONSTANTS ============ */
#define MAX_LINES 10000
#define MAX_LINE_LENGTH 4096
#define MAX_FILES 32
#define MAX_FILENAME 256
#define TAB_SIZE 4
#define SIDEBAR_WIDTH 25

/* ============ COLOR PAIRS ============ */
typedef enum {
    COLOR_DEFAULT = 1,
    COLOR_KEYWORD,
    COLOR_STRING,
    COLOR_COMMENT,
    COLOR_NUMBER,
    COLOR_VARIABLE,
    COLOR_OPERATOR,
    COLOR_FUNCTION,
    COLOR_LINENUM,
    COLOR_STATUS,
    COLOR_ERROR,
    COLOR_WARNING,
    COLOR_SUCCESS,
    COLOR_HIGHLIGHT
} ColorPair;

/* ============ EDITOR MODES ============ */
typedef enum {
    MODE_NORMAL,
    MODE_INSERT,
    MODE_COMMAND,
    MODE_SEARCH,
    MODE_REPLACE,
    MODE_VISUAL
} EditorMode;

/* ============ LINE STRUCTURE ============ */
typedef struct Line {
    char *content;
    int length;
    int capacity;
    bool dirty;
    struct Line *next;
    struct Line *prev;
} Line;

/* ============ BUFFER STRUCTURE ============ */
typedef struct Buffer {
    Line *first_line;
    Line *last_line;
    Line *current_line;
    int line_count;
    int cursor_x;
    int cursor_y;
    int scroll_x;
    int scroll_y;
    char filename[MAX_FILENAME];
    bool modified;
    struct Buffer *next;
} Buffer;

/* ============ FILE EXPLORER ============ */
typedef struct FileNode {
    char name[MAX_FILENAME];
    bool is_directory;
    bool expanded;
    int depth;
    struct FileNode *parent;
    struct FileNode *children;
    struct FileNode *next_sibling;
} FileNode;

/* ============ EDITOR STATE ============ */
typedef struct Editor {
    Buffer *buffers;
    Buffer *current_buffer;
    int buffer_count;
    int current_buffer_idx;

    EditorMode mode;
    EditorMode prev_mode;

    FileNode *file_tree;
    bool sidebar_visible;
    int sidebar_width;

    char status_msg[256];
    char command_buffer[256];
    char search_buffer[256];
    char replace_buffer[256];

    int screen_width;
    int screen_height;
    int editor_width;
    int editor_height;

    bool running;
    bool show_line_numbers;
    bool auto_indent;
    bool syntax_highlight;

    int clipboard_line_start;
    int clipboard_line_end;
    char **clipboard;
    int clipboard_size;

    char last_search[256];
    int search_direction;
} Editor;

/* ============ SYNTAX HIGHLIGHTING ============ */
typedef enum {
    TOKEN_NONE,
    TOKEN_KEYWORD,
    TOKEN_VARIABLE,
    TOKEN_STRING,
    TOKEN_NUMBER,
    TOKEN_COMMENT,
    TOKEN_OPERATOR,
    TOKEN_FUNCTION,
    TOKEN_SPECIAL
} TokenType;

typedef struct {
    const char *text;
    TokenType type;
    int start;
    int end;
} Token;

/* ============ KEYWORDS FOR DROY LANGUAGE ============ */
static const char *DROY_KEYWORDS[] = {
    "set", "~s", "ret", "~r", "em", "~e", "text", "txt", "t",
    "fe", "f", "for", "sty", "pkg", "media",
    "link", "a-link", "yoex--links", "link-go", "create-link", "open-link",
    "api", "id", "block", "key",
    NULL
};

static const char *DROY_SPECIAL_VARS[] = {
    "@si", "@ui", "@yui", "@pop", "@ep", "@epx", "@epn",
    "@yep", "@yepx", "@yepn", "@yepv", "@yepvx", "@yepvn",
    "@yepa", "@yepax", "@yepan", "@yepb", "@yepbx", "@yepbn",
    NULL
};

/* ============ FUNCTION PROTOTYPES ============ */

/* Editor Lifecycle */
Editor* editor_create(void);
void editor_destroy(Editor *ed);
void editor_init_colors(void);
void editor_run(Editor *ed);

/* Buffer Management */
Buffer* buffer_create(const char *filename);
void buffer_destroy(Buffer *buf);
void buffer_load_file(Buffer *buf, const char *filename);
bool buffer_save(Buffer *buf);
void buffer_insert_line(Buffer *buf, int at);
void buffer_delete_line(Buffer *buf, int at);
void buffer_join_line(Buffer *buf);
void buffer_split_line(Buffer *buf);

/* Line Operations */
Line* line_create(void);
void line_destroy(Line *line);
void line_insert_char(Line *line, int pos, char c);
void line_delete_char(Line *line, int pos);
void line_append_string(Line *line, const char *str);
void line_insert_string(Line *line, int pos, const char *str);

/* Display */
void editor_draw(Editor *ed);
void editor_draw_sidebar(Editor *ed);
void editor_draw_buffer(Editor *ed, Buffer *buf);
void editor_draw_line_number(Editor *ed, int line_num, int y);
void editor_draw_line_content(Editor *ed, Line *line, int y, int x_offset);
void editor_draw_status_bar(Editor *ed);
void editor_draw_command_line(Editor *ed);
void editor_refresh_screen(Editor *ed);

/* Syntax Highlighting */
TokenType get_token_type(const char *line, int pos, int *len);
void draw_syntax_highlighted(Editor *ed, const char *line, int y, int x, int max_width);
bool is_keyword(const char *word);
bool is_special_var(const char *word);
bool is_operator(char c);

/* Input Handling */
void editor_process_input(Editor *ed);
void handle_normal_mode(Editor *ed, int ch);
void handle_insert_mode(Editor *ed, int ch);
void handle_command_mode(Editor *ed, int ch);
void handle_search_mode(Editor *ed, int ch);

/* Cursor Movement */
void cursor_move_left(Editor *ed);
void cursor_move_right(Editor *ed);
void cursor_move_up(Editor *ed);
void cursor_move_down(Editor *ed);
void cursor_move_line_start(Editor *ed);
void cursor_move_line_end(Editor *ed);
void cursor_move_word_forward(Editor *ed);
void cursor_move_word_backward(Editor *ed);
void cursor_move_page_up(Editor *ed);
void cursor_move_page_down(Editor *ed);
void cursor_move_file_start(Editor *ed);
void cursor_move_file_end(Editor *ed);

/* Editing Operations */
void editor_insert_char(Editor *ed, char c);
void editor_delete_char(Editor *ed);
void editor_backspace(Editor *ed);
void editor_insert_newline(Editor *ed);
void editor_delete_line(Editor *ed);
void editor_copy_line(Editor *ed);
void editor_paste(Editor *ed);
void editor_undo(Editor *ed);
void editor_redo(Editor *ed);
void editor_indent(Editor *ed);
void editor_unindent(Editor *ed);

/* Search and Replace */
void editor_search(Editor *ed, const char *query);
void editor_search_next(Editor *ed);
void editor_search_prev(Editor *ed);
void editor_replace(Editor *ed, const char *find, const char *replace);
void editor_replace_all(Editor *ed, const char *find, const char *replace);

/* File Operations */
void editor_open_file(Editor *ed, const char *filename);
void editor_save_file(Editor *ed);
void editor_save_as(Editor *ed, const char *filename);
void editor_new_file(Editor *ed);
void editor_close_buffer(Editor *ed);
void editor_next_buffer(Editor *ed);
void editor_prev_buffer(Editor *ed);

/* Command Mode */
void editor_execute_command(Editor *ed, const char *cmd);
void editor_show_message(Editor *ed, const char *msg, ColorPair color);

/* File Explorer */
FileNode* file_tree_create(const char *path);
void file_tree_destroy(FileNode *node);
void file_tree_refresh(FileNode *node);
void file_tree_toggle_expand(FileNode *node);
void file_tree_select_next(Editor *ed);
void file_tree_select_prev(Editor *ed);
void file_tree_open_selected(Editor *ed);

/* Utility Functions */
int get_line_display_length(const char *line);
int get_indent_level(const char *line);
char* get_current_word(Editor *ed);
void trim_trailing_whitespace(char *str);
char* duplicate_string(const char *str);
bool file_exists(const char *filename);
long get_file_size(const char *filename);

/* Key Bindings */
#define KEY_CTRL(c) ((c) & 0x1F)
#define KEY_ESC 27
#define KEY_TAB 9

/* Use ncurses key constants directly for navigation */
#ifndef KEY_PPAGE
#define KEY_PPAGE 339
#endif
#ifndef KEY_NPAGE
#define KEY_NPAGE 338
#endif

#endif /* DROY_EDITOR_H */
