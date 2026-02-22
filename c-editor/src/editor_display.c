/**
 * Droy Code Editor - Display Module
 * ==================================
 * Handles all screen drawing and rendering
 */

#include "../include/droy_editor.h"

/* ============ MAIN DRAW FUNCTION ============ */

void editor_draw(Editor *ed) {
    clear();

    /* Draw sidebar if visible */
    if (ed->sidebar_visible) {
        editor_draw_sidebar(ed);
    }

    /* Draw current buffer */
    if (ed->current_buffer) {
        editor_draw_buffer(ed, ed->current_buffer);
    }

    /* Draw status bar */
    editor_draw_status_bar(ed);

    /* Draw command line */
    editor_draw_command_line(ed);

    /* Position cursor */
    int cursor_screen_x = ed->sidebar_visible ? ed->sidebar_width : 0;
    if (ed->show_line_numbers) {
        cursor_screen_x += 6; /* Line number width */
    }
    cursor_screen_x += ed->current_buffer->cursor_x - ed->current_buffer->scroll_x;

    int cursor_screen_y = ed->current_buffer->cursor_y - ed->current_buffer->scroll_y;

    move(cursor_screen_y, cursor_screen_x);

    refresh();
}

/* ============ SIDEBAR DRAWING ============ */

void editor_draw_sidebar(Editor *ed) {
    int x = 0;
    int width = ed->sidebar_width;

    /* Draw sidebar background */
    attron(COLOR_PAIR(COLOR_DEFAULT));
    for (int y = 0; y < ed->screen_height - 2; y++) {
        mvprintw(y, x, "%-*s", width - 1, "");
    }

    /* Draw border */
    for (int y = 0; y < ed->screen_height - 2; y++) {
        mvaddch(y, width - 1, ACS_VLINE);
    }

    /* Draw title */
    attron(A_BOLD);
    mvprintw(0, 1, "%-*.*s", width - 2, width - 2, "EXPLORER");
    attroff(A_BOLD);

    /* Draw file tree (simplified) */
    attron(COLOR_PAIR(COLOR_DEFAULT));
    mvprintw(2, 1, "%-*.*s", width - 2, width - 2, ed->current_buffer->filename);

    /* Draw mode indicator */
    int mode_y = ed->screen_height - 4;
    const char *mode_str;
    switch (ed->mode) {
        case MODE_NORMAL: mode_str = "NORMAL"; break;
        case MODE_INSERT: mode_str = "INSERT"; break;
        case MODE_COMMAND: mode_str = "COMMAND"; break;
        case MODE_SEARCH: mode_str = "SEARCH"; break;
        case MODE_REPLACE: mode_str = "REPLACE"; break;
        case MODE_VISUAL: mode_str = "VISUAL"; break;
        default: mode_str = "UNKNOWN";
    }

    attron(COLOR_PAIR(COLOR_KEYWORD));
    mvprintw(mode_y, 1, "%-*.*s", width - 2, width - 2, mode_str);
    attroff(COLOR_PAIR(COLOR_KEYWORD));

    /* Draw help hint */
    attron(COLOR_PAIR(COLOR_COMMENT));
    mvprintw(mode_y + 1, 1, "%-*.*s", width - 2, width - 2, "Press ? for help");
    attroff(COLOR_PAIR(COLOR_COMMENT));
}

/* ============ BUFFER DRAWING ============ */

void editor_draw_buffer(Editor *ed, Buffer *buf) {
    int start_x = ed->sidebar_visible ? ed->sidebar_width : 0;
    int start_y = 0;
    int width = ed->editor_width;
    int height = ed->editor_height;

    /* Calculate visible range */
    int first_visible = buf->scroll_y;
    int last_visible = buf->scroll_y + height;

    /* Find first visible line */
    Line *line = buf->first_line;
    int line_num = 0;
    while (line && line_num < first_visible) {
        line = line->next;
        line_num++;
    }

    /* Draw visible lines */
    for (int y = 0; y < height && line; y++) {
        int screen_y = start_y + y;

        /* Draw line number */
        if (ed->show_line_numbers) {
            editor_draw_line_number(ed, line_num + 1, screen_y);
        }

        /* Draw line content */
        int content_x = start_x + (ed->show_line_numbers ? 6 : 0);
        editor_draw_line_content(ed, line, screen_y, content_x);

        line = line->next;
        line_num++;
    }

    /* Clear remaining space */
    attron(COLOR_PAIR(COLOR_DEFAULT));
    for (int y = line_num - first_visible; y < height; y++) {
        int screen_y = start_y + y;
        int content_x = start_x + (ed->show_line_numbers ? 6 : 0);
        mvprintw(screen_y, content_x, "%-*s", width - (ed->show_line_numbers ? 6 : 0), "~");
    }
}

void editor_draw_line_number(Editor *ed, int line_num, int y) {
    int start_x = ed->sidebar_visible ? ed->sidebar_width : 0;

    attron(COLOR_PAIR(COLOR_LINENUM));
    mvprintw(y, start_x, "%5d ", line_num);
    attroff(COLOR_PAIR(COLOR_LINENUM));
}

void editor_draw_line_content(Editor *ed, Line *line, int y, int x_offset) {
    if (!line || !line->content) return;

    int width = ed->editor_width - (ed->show_line_numbers ? 6 : 0);
    int start_col = ed->current_buffer->scroll_x;

    if (ed->syntax_highlight && ed->mode != MODE_COMMAND) {
        draw_syntax_highlighted(ed, line->content, y, x_offset, width);
    } else {
        attron(COLOR_PAIR(COLOR_DEFAULT));

        /* Calculate visible portion */
        int len = line->length - start_col;
        if (len < 0) len = 0;
        if (len > width) len = width;

        if (len > 0) {
            char temp[MAX_LINE_LENGTH];
            strncpy(temp, line->content + start_col, len);
            temp[len] = '\0';
            mvprintw(y, x_offset, "%s", temp);
        }

        /* Clear rest of line */
        int printed = len;
        while (printed < width) {
            mvaddch(y, x_offset + printed, ' ');
            printed++;
        }

        attroff(COLOR_PAIR(COLOR_DEFAULT));
    }
}

/* ============ SYNTAX HIGHLIGHTING ============ */

void draw_syntax_highlighted(Editor *ed, const char *line, int y, int x, int max_width) {
    int len = strlen(line);
    int col = ed->current_buffer->scroll_x;
    int screen_x = x;
    int screen_col = 0;

    while (col < len && screen_col < max_width) {
        int token_len;
        TokenType type = get_token_type(line, col, &token_len);

        /* Determine color */
        int color_pair;
        switch (type) {
            case TOKEN_KEYWORD: color_pair = COLOR_KEYWORD; break;
            case TOKEN_VARIABLE: color_pair = COLOR_VARIABLE; break;
            case TOKEN_STRING: color_pair = COLOR_STRING; break;
            case TOKEN_NUMBER: color_pair = COLOR_NUMBER; break;
            case TOKEN_COMMENT: color_pair = COLOR_COMMENT; break;
            case TOKEN_OPERATOR: color_pair = COLOR_OPERATOR; break;
            case TOKEN_FUNCTION: color_pair = COLOR_FUNCTION; break;
            case TOKEN_SPECIAL: color_pair = COLOR_VARIABLE; break;
            default: color_pair = COLOR_DEFAULT;
        }

        /* Draw token */
        attron(COLOR_PAIR(color_pair));
        for (int i = 0; i < token_len && screen_col < max_width; i++) {
            if (line[col + i] == '\t') {
                int spaces = TAB_SIZE - (screen_col % TAB_SIZE);
                for (int s = 0; s < spaces && screen_col < max_width; s++) {
                    mvaddch(y, screen_x++, ' ');
                    screen_col++;
                }
            } else {
                mvaddch(y, screen_x++, line[col + i]);
                screen_col++;
            }
        }
        attroff(COLOR_PAIR(color_pair));

        col += token_len;
    }

    /* Clear rest of line */
    attron(COLOR_PAIR(COLOR_DEFAULT));
    while (screen_col < max_width) {
        mvaddch(y, screen_x++, ' ');
        screen_col++;
    }
    attroff(COLOR_PAIR(COLOR_DEFAULT));
}

TokenType get_token_type(const char *line, int pos, int *len) {
    char c = line[pos];

    /* Skip whitespace */
    if (isspace(c)) {
        *len = 1;
        while (isspace(line[pos + *len])) (*len)++;
        return TOKEN_NONE;
    }

    /* Comments */
    if (c == '/' && line[pos + 1] == '/') {
        *len = strlen(line) - pos;
        return TOKEN_COMMENT;
    }

    /* Strings */
    if (c == '"') {
        *len = 1;
        while (line[pos + *len] && line[pos + *len] != '"') {
            if (line[pos + *len] == '\\' && line[pos + *len + 1]) {
                *len += 2;
            } else {
                (*len)++;
            }
        }
        if (line[pos + *len] == '"') (*len)++;
        return TOKEN_STRING;
    }

    /* Numbers */
    if (isdigit(c)) {
        *len = 1;
        while (isdigit(line[pos + *len]) || line[pos + *len] == '.') {
            (*len)++;
        }
        return TOKEN_NUMBER;
    }

    /* Special variables (@si, @ui, etc.) */
    if (c == '@') {
        *len = 1;
        while (isalnum(line[pos + *len]) || line[pos + *len] == '_') {
            (*len)++;
        }
        char word[64];
        strncpy(word, line + pos, *len);
        word[*len] = '\0';
        if (is_special_var(word)) {
            return TOKEN_SPECIAL;
        }
        return TOKEN_VARIABLE;
    }

    /* Identifiers and keywords */
    if (isalpha(c) || c == '_' || c == '~') {
        *len = 1;
        while (isalnum(line[pos + *len]) || line[pos + *len] == '_' || line[pos + *len] == '-') {
            (*len)++;
        }

        char word[64];
        strncpy(word, line + pos, *len);
        word[*len] = '\0';

        if (is_keyword(word)) {
            return TOKEN_KEYWORD;
        }

        /* Check if followed by '(' for function */
        int next_pos = pos + *len;
        while (isspace(line[next_pos])) next_pos++;
        if (line[next_pos] == '(') {
            return TOKEN_FUNCTION;
        }

        return TOKEN_NONE;
    }

    /* Operators */
    if (is_operator(c)) {
        *len = 1;
        if ((c == '+' || c == '-' || c == '*' || c == '/' || c == '=') &&
            line[pos + 1] == '=') {
            *len = 2;
        }
        return TOKEN_OPERATOR;
    }

    /* Default */
    *len = 1;
    return TOKEN_NONE;
}

bool is_keyword(const char *word) {
    for (int i = 0; DROY_KEYWORDS[i]; i++) {
        if (strcmp(word, DROY_KEYWORDS[i]) == 0) {
            return true;
        }
    }
    return false;
}

bool is_special_var(const char *word) {
    for (int i = 0; DROY_SPECIAL_VARS[i]; i++) {
        if (strcmp(word, DROY_SPECIAL_VARS[i]) == 0) {
            return true;
        }
    }
    return false;
}

bool is_operator(char c) {
    return strchr("+-*/=<>!&|", c) != NULL;
}

/* ============ STATUS BAR ============ */

void editor_draw_status_bar(Editor *ed) {
    int y = ed->screen_height - 2;

    /* Get buffer info */
    Buffer *buf = ed->current_buffer;
    char info[256];

    snprintf(info, sizeof(info), " %s %s | Line %d/%d | Col %d | %s",
             buf->modified ? "[+]" : "",
             buf->filename,
             buf->cursor_y + 1,
             buf->line_count,
             buf->cursor_x + 1,
             ed->mode == MODE_INSERT ? "-- INSERT --" : "");

    /* Draw status bar */
    attron(COLOR_PAIR(COLOR_STATUS));
    mvprintw(y, 0, "%-*s", ed->screen_width, info);
    attroff(COLOR_PAIR(COLOR_STATUS));
}

/* ============ COMMAND LINE ============ */

void editor_draw_command_line(Editor *ed) {
    int y = ed->screen_height - 1;

    attron(COLOR_PAIR(COLOR_DEFAULT));

    if (ed->mode == MODE_COMMAND) {
        mvprintw(y, 0, ":%s", ed->command_buffer);
    } else if (ed->mode == MODE_SEARCH) {
        mvprintw(y, 0, "/%s", ed->search_buffer);
    } else if (ed->mode == MODE_REPLACE) {
        mvprintw(y, 0, "Replace: %s -> %s", ed->search_buffer, ed->replace_buffer);
    } else if (strlen(ed->status_msg) > 0) {
        mvprintw(y, 0, "%s", ed->status_msg);
    } else {
        mvprintw(y, 0, "%*s", ed->screen_width, "");
    }

    attroff(COLOR_PAIR(COLOR_DEFAULT));
}

void editor_show_message(Editor *ed, const char *msg, ColorPair color) {
    strncpy(ed->status_msg, msg, sizeof(ed->status_msg) - 1);
    ed->status_msg[sizeof(ed->status_msg) - 1] = '\0';

    /* Temporarily show message */
    attron(COLOR_PAIR(color));
    mvprintw(ed->screen_height - 1, 0, "%s", ed->status_msg);
    attroff(COLOR_PAIR(color));
    refresh();

    /* Clear after delay (handled in main loop) */
}
