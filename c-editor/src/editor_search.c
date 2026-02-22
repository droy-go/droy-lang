/**
 * Droy Code Editor - Search and Replace Module
 * =============================================
 * Handles search, replace, and pattern matching
 */

#include "../include/droy_editor.h"
#include <regex.h>

/* ============ SEARCH FUNCTIONS ============ */

void editor_search(Editor *ed, const char *query) {
    if (!query || strlen(query) == 0) return;

    Buffer *buf = ed->current_buffer;

    /* Start searching from current position */
    Line *line = buf->current_line;
    int line_num = buf->cursor_y;
    int start_pos = buf->cursor_x + 1;

    /* Search in current line first */
    char *found = strstr(line->content + start_pos, query);
    if (found) {
        buf->cursor_x = found - line->content;
        cursor_center_on_screen(ed);
        return;
    }

    /* Search in subsequent lines */
    line = line->next;
    line_num++;

    while (line) {
        found = strstr(line->content, query);
        if (found) {
            buf->cursor_y = line_num;
            buf->current_line = line;
            buf->cursor_x = found - line->content;
            cursor_center_on_screen(ed);
            return;
        }
        line = line->next;
        line_num++;
    }

    /* Wrap around to beginning */
    line = buf->first_line;
    line_num = 0;

    while (line_num <= buf->cursor_y) {
        found = strstr(line->content, query);
        if (found) {
            buf->cursor_y = line_num;
            buf->current_line = line;
            buf->cursor_x = found - line->content;
            cursor_center_on_screen(ed);
            return;
        }
        line = line->next;
        line_num++;
    }

    editor_show_message(ed, "Pattern not found", COLOR_WARNING);
}

void editor_search_next(Editor *ed) {
    if (strlen(ed->last_search) == 0) {
        editor_show_message(ed, "No previous search", COLOR_WARNING);
        return;
    }
    editor_search(ed, ed->last_search);
}

void editor_search_prev(Editor *ed) {
    if (strlen(ed->last_search) == 0) {
        editor_show_message(ed, "No previous search", COLOR_WARNING);
        return;
    }

    Buffer *buf = ed->current_buffer;
    const char *query = ed->last_search;
    int query_len = strlen(query);

    /* Search backward from current position */
    Line *line = buf->current_line;
    int line_num = buf->cursor_y;

    /* Search in current line before cursor */
    for (int pos = buf->cursor_x - 1; pos >= 0; pos--) {
        if (strncmp(line->content + pos, query, query_len) == 0) {
            buf->cursor_x = pos;
            cursor_center_on_screen(ed);
            return;
        }
    }

    /* Search in previous lines */
    line = line->prev;
    line_num--;

    while (line) {
        for (int pos = line->length - query_len; pos >= 0; pos--) {
            if (strncmp(line->content + pos, query, query_len) == 0) {
                buf->cursor_y = line_num;
                buf->current_line = line;
                buf->cursor_x = pos;
                cursor_center_on_screen(ed);
                return;
            }
        }
        line = line->prev;
        line_num--;
    }

    /* Wrap around to end */
    line = buf->last_line;
    line_num = buf->line_count - 1;

    while (line_num >= buf->cursor_y) {
        for (int pos = line->length - query_len; pos >= 0; pos--) {
            if (strncmp(line->content + pos, query, query_len) == 0) {
                buf->cursor_y = line_num;
                buf->current_line = line;
                buf->cursor_x = pos;
                cursor_center_on_screen(ed);
                return;
            }
        }
        line = line->prev;
        line_num--;
    }

    editor_show_message(ed, "Pattern not found", COLOR_WARNING);
}

/* ============ REPLACE FUNCTIONS ============ */

void editor_replace(Editor *ed, const char *find, const char *replace) {
    if (!find || strlen(find) == 0) return;

    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Find and replace at cursor position */
    char *found = strstr(line->content + buf->cursor_x, find);
    if (found) {
        int find_len = strlen(find);
        int replace_len = strlen(replace);
        int pos = found - line->content;

        /* Calculate new length */
        int new_len = line->length - find_len + replace_len;

        /* Ensure capacity */
        if (new_len >= line->capacity) {
            line->capacity = new_len + 1;
            line->content = realloc(line->content, line->capacity);
        }

        /* Move remaining content */
        memmove(line->content + pos + replace_len,
                line->content + pos + find_len,
                line->length - pos - find_len + 1);

        /* Insert replacement */
        memcpy(line->content + pos, replace, replace_len);

        line->length = new_len;
        buf->cursor_x = pos + replace_len;
        buf->modified = true;

        editor_show_message(ed, "Replaced", COLOR_SUCCESS);
    } else {
        editor_show_message(ed, "Pattern not found", COLOR_WARNING);
    }
}

void editor_replace_all(Editor *ed, const char *find, const char *replace) {
    if (!find || strlen(find) == 0) return;

    Buffer *buf = ed->current_buffer;
    int find_len = strlen(find);
    int replace_len = strlen(replace);
    int count = 0;

    Line *line = buf->first_line;
    int line_num = 0;

    while (line) {
        char *found = line->content;
        int offset = 0;

        while ((found = strstr(found + offset, find)) != NULL) {
            int pos = found - line->content;

            /* Calculate new length */
            int new_len = line->length - find_len + replace_len;

            /* Ensure capacity */
            if (new_len >= line->capacity) {
                line->capacity = new_len + 1;
                line->content = realloc(line->content, line->capacity);
                found = line->content + pos;
            }

            /* Move remaining content */
            memmove(line->content + pos + replace_len,
                    line->content + pos + find_len,
                    line->length - pos - find_len + 1);

            /* Insert replacement */
            memcpy(line->content + pos, replace, replace_len);

            line->length = new_len;
            offset = pos + replace_len;
            count++;
        }

        line = line->next;
        line_num++;
    }

    buf->modified = true;

    char msg[256];
    snprintf(msg, sizeof(msg), "Replaced %d occurrence(s)", count);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

/* ============ REGEX SEARCH (Advanced) ============ */

void editor_regex_search(Editor *ed, const char *pattern) {
    /* TODO: Implement regex search using regcomp/regexec */
    editor_show_message(ed, "Regex search not yet implemented", COLOR_WARNING);
}

void editor_regex_replace(Editor *ed, const char *pattern, const char *replace) {
    /* TODO: Implement regex replace */
    editor_show_message(ed, "Regex replace not yet implemented", COLOR_WARNING);
}

/* ============ INCREMENTAL SEARCH ============ */

void editor_incremental_search(Editor *ed, const char *query) {
    /* Search as user types */
    if (!query || strlen(query) == 0) return;

    Buffer *buf = ed->current_buffer;
    int saved_x = buf->cursor_x;
    int saved_y = buf->cursor_y;

    /* Try to find the pattern */
    Line *line = buf->current_line;
    char *found = strstr(line->content + buf->cursor_x, query);

    if (found) {
        buf->cursor_x = found - line->content;
        /* Don't center - just update position for preview */
    } else {
        /* Restore position if not found */
        buf->cursor_x = saved_x;
        buf->cursor_y = saved_y;
    }
}

/* ============ HIGHLIGHT ALL MATCHES ============ */

void editor_highlight_matches(Editor *ed, const char *query) {
    /* TODO: Implement match highlighting in display */
    /* This would require storing match positions and highlighting them */
    (void)query; /* Suppress unused parameter warning */
    editor_show_message(ed, "Match highlighting not yet implemented", COLOR_WARNING);
}

/* ============ SEARCH IN FILES ============ */

void editor_search_in_files(Editor *ed, const char *query, const char *path) {
    /* TODO: Implement multi-file search */
    (void)query;
    (void)path;
    editor_show_message(ed, "Multi-file search not yet implemented", COLOR_WARNING);
}

/* ============ GOTO DEFINITION ============ */

void editor_goto_definition(Editor *ed, const char *symbol) {
    /* TODO: Implement symbol lookup */
    (void)symbol;
    editor_show_message(ed, "Goto definition not yet implemented", COLOR_WARNING);
}

/* ============ FIND REFERENCES ============ */

void editor_find_references(Editor *ed, const char *symbol) {
    /* TODO: Implement reference finding */
    (void)symbol;
    editor_show_message(ed, "Find references not yet implemented", COLOR_WARNING);
}

/* ============ UTILITY FUNCTIONS ============ */

char* get_current_word(Editor *ed) {
    Buffer *buf = ed->current_buffer;
    Line *line = buf->current_line;

    /* Find word boundaries */
    int start = buf->cursor_x;
    while (start > 0 && (isalnum(line->content[start - 1]) || line->content[start - 1] == '_')) {
        start--;
    }

    int end = buf->cursor_x;
    while (end < line->length && (isalnum(line->content[end]) || line->content[end] == '_')) {
        end++;
    }

    if (start >= end) return NULL;

    int len = end - start;
    char *word = malloc(len + 1);
    strncpy(word, line->content + start, len);
    word[len] = '\0';

    return word;
}

int get_line_display_length(const char *line) {
    int len = 0;
    for (int i = 0; line[i]; i++) {
        if (line[i] == '\t') {
            len += TAB_SIZE - (len % TAB_SIZE);
        } else {
            len++;
        }
    }
    return len;
}

int get_indent_level(const char *line) {
    int indent = 0;
    for (int i = 0; line[i] && isspace(line[i]); i++) {
        if (line[i] == '\t') {
            indent += TAB_SIZE;
        } else {
            indent++;
        }
    }
    return indent;
}

void trim_trailing_whitespace(char *str) {
    int len = strlen(str);
    while (len > 0 && isspace(str[len - 1])) {
        str[len - 1] = '\0';
        len--;
    }
}

char* duplicate_string(const char *str) {
    if (!str) return NULL;
    char *dup = malloc(strlen(str) + 1);
    if (dup) strcpy(dup, str);
    return dup;
}
