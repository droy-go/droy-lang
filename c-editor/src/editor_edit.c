/**
 * Droy Code Editor - Edit Operations Module
 * ==========================================
 * Handles text insertion, deletion, and manipulation
 */

#include "../include/droy_editor.h"

/* ============ CHARACTER OPERATIONS ============ */

void editor_insert_char(Editor *ed, char c) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    line_insert_char(line, buf->cursor_x, c);
    buf->cursor_x++;
    buf->modified = true;
}

void editor_delete_char(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    if (buf->cursor_x < line->length) {
        line_delete_char(line, buf->cursor_x);
        buf->modified = true;
    } else if (buf->cursor_y < buf->line_count - 1) {
        /* Join with next line */
        buffer_join_line(buf);
    }
}

void editor_backspace(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (buf->cursor_x > 0) {
        /* Delete character before cursor */
        buf->cursor_x--;
        line_delete_char(buf->current_line, buf->cursor_x);
        buf->modified = true;
    } else if (buf->cursor_y > 0) {
        /* Join with previous line */
        cursor_move_up(ed);
        cursor_move_line_end(ed);
        buffer_join_line(buf);
    }
}

/* ============ LINE OPERATIONS ============ */

void editor_insert_newline(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    buffer_split_line(buf);

    /* Auto-indent if enabled */
    if (ed->auto_indent && buf->current_line->prev) {
        Line *prev = buf->current_line->prev;
        int indent = 0;

        /* Count leading whitespace of previous line */
        while (indent < prev->length && isspace(prev->content[indent])) {
            indent++;
        }

        /* Check if previous line ends with opening brace */
        bool increase_indent = false;
        int prev_len = prev->length;
        while (prev_len > 0 && isspace(prev->content[prev_len - 1])) {
            prev_len--;
        }
        if (prev_len > 0 && prev->content[prev_len - 1] == '{') {
            increase_indent = true;
        }

        /* Apply indentation */
        if (indent > 0 || increase_indent) {
            char *indent_str = malloc(indent + TAB_SIZE + 1);
            int i;
            for (i = 0; i < indent; i++) {
                indent_str[i] = prev->content[i];
            }
            if (increase_indent) {
                for (int j = 0; j < TAB_SIZE; j++) {
                    indent_str[i++] = ' ';
                }
            }
            indent_str[i] = '\0';

            line_insert_string(buf->current_line, 0, indent_str);
            buf->cursor_x = i;
            free(indent_str);
        }
    }

    buf->modified = true;
}

void editor_delete_line(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    buffer_delete_line(buf, buf->cursor_y);
    buf->modified = true;
}

void editor_copy_line(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    /* Free old clipboard */
    if (ed->clipboard) {
        for (int i = 0; i < ed->clipboard_size; i++) {
            free(ed->clipboard[i]);
        }
        free(ed->clipboard);
    }

    /* Copy current line to clipboard */
    ed->clipboard = malloc(sizeof(char*));
    ed->clipboard[0] = strdup(buf->current_line->content);
    ed->clipboard_size = 1;
    ed->clipboard_line_start = buf->cursor_y;
    ed->clipboard_line_end = buf->cursor_y;

    editor_show_message(ed, "Line copied", COLOR_SUCCESS);
}

void editor_paste(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (!ed->clipboard || ed->clipboard_size == 0) {
        editor_show_message(ed, "Nothing to paste", COLOR_WARNING);
        return;
    }

    /* Insert clipboard content */
    for (int i = 0; i < ed->clipboard_size; i++) {
        buffer_insert_line(buf, buf->cursor_y + i + 1);

        /* Find the newly inserted line */
        Line *new_line = buf->first_line;
        for (int j = 0; j < buf->cursor_y + i + 1 && new_line; j++) {
            new_line = new_line->next;
        }

        if (new_line) {
            line_append_string(new_line, ed->clipboard[i]);
        }
    }

    buf->modified = true;
    editor_show_message(ed, "Pasted", COLOR_SUCCESS);
}

/* ============ INDENTATION ============ */

void editor_indent(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Insert spaces at beginning of line */
    for (int i = 0; i < TAB_SIZE; i++) {
        line_insert_char(line, 0, ' ');
    }

    buf->cursor_x += TAB_SIZE;
    buf->modified = true;
}

void editor_unindent(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Remove leading spaces */
    int removed = 0;
    while (removed < TAB_SIZE && line->length > 0 && line->content[0] == ' ') {
        line_delete_char(line, 0);
        removed++;
    }

    if (buf->cursor_x >= removed) {
        buf->cursor_x -= removed;
    } else {
        buf->cursor_x = 0;
    }

    if (removed > 0) {
        buf->modified = true;
    }
}

/* ============ UNDO/REDO (Basic Implementation) ============ */

void editor_undo(Editor *ed) {
    /* TODO: Implement full undo system with action history */
    editor_show_message(ed, "Undo not yet implemented", COLOR_WARNING);
}

void editor_redo(Editor *ed) {
    /* TODO: Implement full redo system */
    editor_show_message(ed, "Redo not yet implemented", COLOR_WARNING);
}

/* ============ COMMENT TOGGLE ============ */

void editor_toggle_comment(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Check if line starts with comment */
    int pos = 0;
    while (pos < line->length && isspace(line->content[pos])) {
        pos++;
    }

    if (strncmp(line->content + pos, "//", 2) == 0) {
        /* Remove comment */
        int remove_len = 2;
        while (pos + remove_len < line->length &&
               isspace(line->content[pos + remove_len])) {
            remove_len++;
        }

        memmove(line->content + pos, line->content + pos + remove_len,
                line->length - pos - remove_len + 1);
        line->length -= remove_len;
    } else {
        /* Add comment */
        line_insert_string(line, pos, "// ");
    }

    buf->modified = true;
}

/* ============ DUPLICATE LINE ============ */

void editor_duplicate_line(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    buffer_insert_line(buf, buf->cursor_y);

    /* Copy content to new line */
    Line *curr = buf->current_line;
    Line *prev = curr->prev;
    if (prev) {
        line_append_string(curr, prev->content);
    }

    buf->modified = true;
}

/* ============ MOVE LINE ============ */

void editor_move_line_up(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (buf->cursor_y == 0) return;

    /* Swap current line with previous */
    Line *curr = buf->current_line;
    Line *prev = curr->prev;

    if (!prev) return;

    /* Swap content */
    char *temp = curr->content;
    curr->content = prev->content;
    prev->content = temp;

    int temp_len = curr->length;
    curr->length = prev->length;
    prev->length = temp_len;

    int temp_cap = curr->capacity;
    curr->capacity = prev->capacity;
    prev->capacity = temp_cap;

    cursor_move_up(ed);
    buf->modified = true;
}

void editor_move_line_down(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (buf->cursor_y >= buf->line_count - 1) return;

    /* Swap current line with next */
    Line *curr = buf->current_line;
    Line *next = curr->next;

    if (!next) return;

    /* Swap content */
    char *temp = curr->content;
    curr->content = next->content;
    next->content = temp;

    int temp_len = curr->length;
    curr->length = next->length;
    next->length = temp_len;

    int temp_cap = curr->capacity;
    curr->capacity = next->capacity;
    next->capacity = temp_cap;

    cursor_move_down(ed);
    buf->modified = true;
}

/* ============ TRANSPOSE ============ */

void editor_transpose_chars(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    if (buf->cursor_x == 0 || buf->cursor_x >= line->length) return;

    /* Swap characters at cursor-1 and cursor */
    char temp = line->content[buf->cursor_x - 1];
    line->content[buf->cursor_x - 1] = line->content[buf->cursor_x];
    line->content[buf->cursor_x] = temp;

    cursor_move_right(ed);
    buf->modified = true;
}

void editor_transpose_words(Editor *ed) {
    /* TODO: Implement word transposition */
    editor_show_message(ed, "Transpose words not yet implemented", COLOR_WARNING);
}

/* ============ CASE CONVERSION ============ */

void editor_uppercase_word(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Find word boundaries */
    int start = buf->cursor_x;
    while (start > 0 && isalnum(line->content[start - 1])) {
        start--;
    }

    int end = buf->cursor_x;
    while (end < line->length && isalnum(line->content[end])) {
        end++;
    }

    /* Convert to uppercase */
    for (int i = start; i < end; i++) {
        line->content[i] = toupper(line->content[i]);
    }

    buf->modified = true;
}

void editor_lowercase_word(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Find word boundaries */
    int start = buf->cursor_x;
    while (start > 0 && isalnum(line->content[start - 1])) {
        start--;
    }

    int end = buf->cursor_x;
    while (end < line->length && isalnum(line->content[end])) {
        end++;
    }

    /* Convert to lowercase */
    for (int i = start; i < end; i++) {
        line->content[i] = tolower(line->content[i]);
    }

    buf->modified = true;
}

/* ============ JOIN LINES ============ */

void editor_join_lines(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    buffer_join_line(buf);
}

/* ============ INSERT FROM TEMPLATE ============ */

void editor_insert_template(Editor *ed, const char *template) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    line_insert_string(line, buf->cursor_x, template);
    buf->cursor_x += strlen(template);
    buf->modified = true;
}

/* ============ DELETE TO ============ */

void editor_delete_to_end_of_line(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    if (buf->cursor_x < line->length) {
        line->content[buf->cursor_x] = '\0';
        line->length = buf->cursor_x;
        buf->modified = true;
    }
}

void editor_delete_to_start_of_line(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    if (buf->cursor_x > 0) {
        memmove(line->content, line->content + buf->cursor_x,
                line->length - buf->cursor_x + 1);
        line->length -= buf->cursor_x;
        buf->cursor_x = 0;
        buf->modified = true;
    }
}

/* ============ YANK (COPY) REGION ============ */

void editor_yank_region(Editor *ed, int start_line, int end_line) {
    Buffer *buf = ed->current_buffer;

    /* Free old clipboard */
    if (ed->clipboard) {
        for (int i = 0; i < ed->clipboard_size; i++) {
            free(ed->clipboard[i]);
        }
        free(ed->clipboard);
    }

    /* Calculate number of lines */
    int num_lines = end_line - start_line + 1;
    if (num_lines <= 0) return;

    /* Allocate clipboard */
    ed->clipboard = malloc(num_lines * sizeof(char*));
    ed->clipboard_size = num_lines;
    ed->clipboard_line_start = start_line;
    ed->clipboard_line_end = end_line;

    /* Copy lines */
    Line *line = buf->first_line;
    int current = 0;

    while (line && current < start_line) {
        line = line->next;
        current++;
    }

    for (int i = 0; i < num_lines && line; i++) {
        ed->clipboard[i] = strdup(line->content);
        line = line->next;
    }

    char msg[256];
    snprintf(msg, sizeof(msg), "%d lines copied", num_lines);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}
