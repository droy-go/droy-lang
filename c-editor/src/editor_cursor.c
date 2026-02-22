/**
 * Droy Code Editor - Cursor Movement Module
 * ==========================================
 * Handles all cursor navigation and positioning
 */

#include "../include/droy_editor.h"

/* ============ BASIC MOVEMENT ============ */

void cursor_move_left(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    if (buf->cursor_x > 0) {
        buf->cursor_x--;
    } else if (buf->cursor_y > 0) {
        /* Move to end of previous line */
        cursor_move_up(ed);
        cursor_move_line_end(ed);
    }
}

void cursor_move_right(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    if (buf->cursor_x < buf->current_line->length) {
        buf->cursor_x++;
    } else if (buf->cursor_y < buf->line_count - 1) {
        /* Move to start of next line */
        cursor_move_down(ed);
        cursor_move_line_start(ed);
    }
}

void cursor_move_up(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    if (buf->cursor_y > 0) {
        buf->cursor_y--;
        buf->current_line = buf->current_line->prev;

        /* Adjust cursor_x if line is shorter */
        if (buf->cursor_x > buf->current_line->length) {
            buf->cursor_x = buf->current_line->length;
        }
    }
}

void cursor_move_down(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    if (buf->cursor_y < buf->line_count - 1) {
        buf->cursor_y++;
        buf->current_line = buf->current_line->next;

        /* Adjust cursor_x if line is shorter */
        if (buf->cursor_x > buf->current_line->length) {
            buf->cursor_x = buf->current_line->length;
        }
    }
}

/* ============ LINE NAVIGATION ============ */

void cursor_move_line_start(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    /* Skip leading whitespace for ^ */
    int first_non_space = 0;
    while (first_non_space < buf->current_line->length &&
           isspace(buf->current_line->content[first_non_space])) {
        first_non_space++;
    }

    if (buf->cursor_x == first_non_space) {
        buf->cursor_x = 0;
    } else {
        buf->cursor_x = first_non_space;
    }
}

void cursor_move_line_end(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    buf->cursor_x = buf->current_line->length;
}

/* ============ WORD NAVIGATION ============ */

void cursor_move_word_forward(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    const char *line = buf->current_line->content;
    int len = buf->current_line->length;
    int pos = buf->cursor_x;

    /* Skip current word */
    if (pos < len && isalnum(line[pos])) {
        while (pos < len && isalnum(line[pos])) {
            pos++;
        }
    } else if (pos < len) {
        while (pos < len && !isalnum(line[pos]) && !isspace(line[pos])) {
            pos++;
        }
    }

    /* Skip whitespace */
    while (pos < len && isspace(line[pos])) {
        pos++;
    }

    buf->cursor_x = pos;
}

void cursor_move_word_backward(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    const char *line = buf->current_line->content;
    int pos = buf->cursor_x;

    if (pos == 0) return;

    /* Move back one character first */
    pos--;

    /* Skip whitespace */
    while (pos > 0 && isspace(line[pos])) {
        pos--;
    }

    /* Skip word */
    if (isalnum(line[pos])) {
        while (pos > 0 && isalnum(line[pos - 1])) {
            pos--;
        }
    } else {
        while (pos > 0 && !isalnum(line[pos - 1]) && !isspace(line[pos - 1])) {
            pos--;
        }
    }

    buf->cursor_x = pos;
}

/* ============ PAGE NAVIGATION ============ */

void cursor_move_page_up(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    int page_size = ed->editor_height - 1;

    for (int i = 0; i < page_size && buf->cursor_y > 0; i++) {
        cursor_move_up(ed);
    }
}

void cursor_move_page_down(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    int page_size = ed->editor_height - 1;

    for (int i = 0; i < page_size && buf->cursor_y < buf->line_count - 1; i++) {
        cursor_move_down(ed);
    }
}

/* ============ FILE NAVIGATION ============ */

void cursor_move_file_start(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    buf->cursor_y = 0;
    buf->cursor_x = 0;
    buf->current_line = buf->first_line;
    buf->scroll_y = 0;
    buf->scroll_x = 0;
}

void cursor_move_file_end(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    buf->cursor_y = buf->line_count - 1;
    buf->cursor_x = buf->last_line->length;
    buf->current_line = buf->last_line;

    /* Adjust scroll */
    if (buf->line_count > ed->editor_height) {
        buf->scroll_y = buf->line_count - ed->editor_height;
    }
}

/* ============ GOTO LINE ============ */

void cursor_goto_line(Editor *ed, int line_num) {
    Buffer *buf = ed->current_buffer;

    /* Clamp to valid range */
    if (line_num < 1) line_num = 1;
    if (line_num > buf->line_count) line_num = buf->line_count;

    /* Navigate to line */
    buf->cursor_y = line_num - 1;
    buf->current_line = buf->first_line;
    for (int i = 0; i < buf->cursor_y && buf->current_line; i++) {
        buf->current_line = buf->current_line->next;
    }

    /* Reset cursor to start of line */
    buf->cursor_x = 0;

    /* Adjust scroll */
    if (buf->cursor_y < buf->scroll_y) {
        buf->scroll_y = buf->cursor_y;
    } else if (buf->cursor_y >= buf->scroll_y + ed->editor_height) {
        buf->scroll_y = buf->cursor_y - ed->editor_height + 1;
    }
}

/* ============ GOTO COLUMN ============ */

void cursor_goto_column(Editor *ed, int col) {
    Buffer *buf = ed->current_buffer;

    /* Clamp to valid range */
    if (col < 0) col = 0;
    if (col > buf->current_line->length) {
        col = buf->current_line->length;
    }

    buf->cursor_x = col;

    /* Adjust scroll */
    if (buf->cursor_x < buf->scroll_x) {
        buf->scroll_x = buf->cursor_x;
    } else if (buf->cursor_x >= buf->scroll_x + ed->editor_width - 10) {
        buf->scroll_x = buf->cursor_x - ed->editor_width + 11;
    }
}

/* ============ GOTO POSITION ============ */

void cursor_goto_position(Editor *ed, int line, int col) {
    cursor_goto_line(ed, line);
    cursor_goto_column(ed, col);
}

/* ============ MATCHING BRACKET ============ */

void cursor_goto_matching_bracket(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    const char *line = buf->current_line->content;
    int pos = buf->cursor_x;

    if (pos >= buf->current_line->length) return;

    char bracket = line[pos];
    char match;
    int direction;
    int depth = 1;

    /* Determine matching bracket and direction */
    switch (bracket) {
        case '(': match = ')'; direction = 1; break;
        case ')': match = '('; direction = -1; break;
        case '[': match = ']'; direction = 1; break;
        case ']': match = '['; direction = -1; break;
        case '{': match = '}'; direction = 1; break;
        case '}': match = '{'; direction = -1; break;
        default: return;
    }

    if (direction == 1) {
        /* Search forward */
        pos++;
        while (pos < buf->current_line->length && depth > 0) {
            if (line[pos] == bracket) depth++;
            else if (line[pos] == match) depth--;
            pos++;
        }
    } else {
        /* Search backward */
        pos--;
        while (pos >= 0 && depth > 0) {
            if (line[pos] == bracket) depth++;
            else if (line[pos] == match) depth--;
            pos--;
        }
        pos++;
    }

    if (depth == 0) {
        buf->cursor_x = pos - (direction == 1 ? 1 : 0);
    }
}

/* ============ SCREEN CENTER ============ */

void cursor_center_on_screen(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    int half_height = ed->editor_height / 2;

    buf->scroll_y = buf->cursor_y - half_height;
    if (buf->scroll_y < 0) buf->scroll_y = 0;
    if (buf->scroll_y > buf->line_count - ed->editor_height) {
        buf->scroll_y = buf->line_count - ed->editor_height;
    }
    if (buf->scroll_y < 0) buf->scroll_y = 0;
}

/* ============ SCROLL WITHOUT MOVING CURSOR ============ */

void editor_scroll_up(Editor *ed, int lines) {
    Buffer *buf = ed->current_buffer;
    buf->scroll_y -= lines;
    if (buf->scroll_y < 0) buf->scroll_y = 0;
}

void editor_scroll_down(Editor *ed, int lines) {
    Buffer *buf = ed->current_buffer;
    buf->scroll_y += lines;
    if (buf->scroll_y > buf->line_count - ed->editor_height) {
        buf->scroll_y = buf->line_count - ed->editor_height;
    }
    if (buf->scroll_y < 0) buf->scroll_y = 0;
}

void editor_scroll_left(Editor *ed, int cols) {
    Buffer *buf = ed->current_buffer;
    buf->scroll_x -= cols;
    if (buf->scroll_x < 0) buf->scroll_x = 0;
}

void editor_scroll_right(Editor *ed, int cols) {
    Buffer *buf = ed->current_buffer;
    buf->scroll_x += cols;
}
