/**
 * Droy Code Editor - Main Implementation
 * =======================================
 * A complete terminal-based code editor for Droy Language
 * Built with ncurses for Unix/Linux systems
 */

#include "../include/droy_editor.h"
#include <unistd.h>
#include <sys/stat.h>
#include <dirent.h>
#include <errno.h>

/* ============ EDITOR LIFECYCLE ============ */

Editor* editor_create(void) {
    Editor *ed = (Editor*)calloc(1, sizeof(Editor));
    if (!ed) {
        fprintf(stderr, "Failed to allocate editor\n");
        return NULL;
    }

    /* Initialize ncurses */
    initscr();
    raw();
    noecho();
    keypad(stdscr, TRUE);
    set_escdelay(25);

    /* Initialize colors */
    if (has_colors()) {
        start_color();
        use_default_colors();
        editor_init_colors();
        ed->syntax_highlight = true;
    } else {
        ed->syntax_highlight = false;
    }

    /* Get screen dimensions */
    getmaxyx(stdscr, ed->screen_height, ed->screen_width);

    /* Initialize settings */
    ed->mode = MODE_NORMAL;
    ed->show_line_numbers = true;
    ed->auto_indent = true;
    ed->sidebar_visible = true;
    ed->sidebar_width = SIDEBAR_WIDTH;
    ed->running = true;
    ed->search_direction = 1;

    /* Calculate editor dimensions */
    ed->editor_width = ed->screen_width - (ed->sidebar_visible ? ed->sidebar_width : 0);
    ed->editor_height = ed->screen_height - 2; /* Status bar + command line */

    /* Create initial buffer */
    ed->buffers = buffer_create(NULL);
    ed->current_buffer = ed->buffers;
    ed->buffer_count = 1;
    ed->current_buffer_idx = 0;

    /* Initialize file tree */
    ed->file_tree = file_tree_create(".");

    editor_show_message(ed, "Welcome to Droy Editor v" DROY_EDITOR_VERSION "! Press ? for help.", COLOR_SUCCESS);

    return ed;
}

void editor_destroy(Editor *ed) {
    if (!ed) return;

    /* Destroy all buffers */
    Buffer *buf = ed->buffers;
    while (buf) {
        Buffer *next = buf->next;
        buffer_destroy(buf);
        buf = next;
    }

    /* Destroy file tree */
    file_tree_destroy(ed->file_tree);

    /* Cleanup ncurses */
    endwin();

    free(ed);
}

void editor_init_colors(void) {
    /* Initialize color pairs */
    init_pair(COLOR_DEFAULT, COLOR_WHITE, -1);
    init_pair(COLOR_KEYWORD, COLOR_MAGENTA, -1);
    init_pair(COLOR_STRING, COLOR_GREEN, -1);
    init_pair(COLOR_COMMENT, COLOR_BLUE, -1);
    init_pair(COLOR_NUMBER, COLOR_YELLOW, -1);
    init_pair(COLOR_VARIABLE, COLOR_CYAN, -1);
    init_pair(COLOR_OPERATOR, COLOR_RED, -1);
    init_pair(COLOR_FUNCTION, COLOR_YELLOW, -1);
    init_pair(COLOR_LINENUM, COLOR_BLACK, -1);
    init_pair(COLOR_STATUS, COLOR_BLACK, COLOR_WHITE);
    init_pair(COLOR_ERROR, COLOR_WHITE, COLOR_RED);
    init_pair(COLOR_WARNING, COLOR_BLACK, COLOR_YELLOW);
    init_pair(COLOR_SUCCESS, COLOR_BLACK, COLOR_GREEN);
    init_pair(COLOR_HIGHLIGHT, COLOR_BLACK, COLOR_YELLOW);
}

void editor_run(Editor *ed) {
    while (ed->running) {
        editor_draw(ed);
        editor_process_input(ed);
    }
}

/* ============ BUFFER MANAGEMENT ============ */

Buffer* buffer_create(const char *filename) {
    Buffer *buf = (Buffer*)calloc(1, sizeof(Buffer));
    if (!buf) return NULL;

    /* Create first empty line */
    buf->first_line = line_create();
    buf->last_line = buf->first_line;
    buf->current_line = buf->first_line;
    buf->line_count = 1;
    buf->cursor_x = 0;
    buf->cursor_y = 0;
    buf->modified = false;

    if (filename) {
        strncpy(buf->filename, filename, MAX_FILENAME - 1);
        buffer_load_file(buf, filename);
    } else {
        strcpy(buf->filename, "untitled.droy");
    }

    return buf;
}

void buffer_destroy(Buffer *buf) {
    if (!buf) return;

    Line *line = buf->first_line;
    while (line) {
        Line *next = line->next;
        line_destroy(line);
        line = next;
    }

    free(buf);
}

void buffer_load_file(Buffer *buf, const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (!fp) {
        /* File doesn't exist, start with empty buffer */
        return;
    }

    /* Clear existing lines */
    Line *line = buf->first_line;
    while (line) {
        Line *next = line->next;
        line_destroy(line);
        line = next;
    }
    buf->first_line = NULL;
    buf->last_line = NULL;
    buf->line_count = 0;

    /* Read file line by line */
    char temp[MAX_LINE_LENGTH];
    Line *prev = NULL;

    while (fgets(temp, sizeof(temp), fp)) {
        /* Remove newline */
        size_t len = strlen(temp);
        if (len > 0 && temp[len-1] == '\n') {
            temp[len-1] = '\0';
            len--;
        }

        Line *new_line = line_create();
        line_append_string(new_line, temp);

        if (prev) {
            prev->next = new_line;
            new_line->prev = prev;
        } else {
            buf->first_line = new_line;
        }

        prev = new_line;
        buf->line_count++;
    }

    fclose(fp);

    if (buf->line_count == 0) {
        buf->first_line = line_create();
        buf->last_line = buf->first_line;
        buf->line_count = 1;
    } else {
        buf->last_line = prev;
    }

    buf->current_line = buf->first_line;
    buf->cursor_x = 0;
    buf->cursor_y = 0;
    buf->modified = false;
}

bool buffer_save(Buffer *buf) {
    if (!buf || strlen(buf->filename) == 0) {
        return false;
    }

    FILE *fp = fopen(buf->filename, "w");
    if (!fp) {
        return false;
    }

    Line *line = buf->first_line;
    while (line) {
        fprintf(fp, "%s\n", line->content);
        line = line->next;
    }

    fclose(fp);
    buf->modified = false;
    return true;
}

void buffer_insert_line(Buffer *buf, int at) {
    Line *new_line = line_create();

    if (at == 0 || buf->line_count == 0) {
        /* Insert at beginning */
        new_line->next = buf->first_line;
        if (buf->first_line) {
            buf->first_line->prev = new_line;
        }
        buf->first_line = new_line;
        if (!buf->last_line) {
            buf->last_line = new_line;
        }
    } else {
        /* Find position */
        Line *curr = buf->first_line;
        int i;
        for (i = 0; i < at - 1 && curr->next; i++) {
            curr = curr->next;
        }

        new_line->next = curr->next;
        new_line->prev = curr;
        if (curr->next) {
            curr->next->prev = new_line;
        } else {
            buf->last_line = new_line;
        }
        curr->next = new_line;
    }

    buf->line_count++;
    buf->modified = true;
}

void buffer_delete_line(Buffer *buf, int at) {
    if (buf->line_count <= 1) {
        /* Keep at least one line */
        if (buf->first_line) {
            free(buf->first_line->content);
            buf->first_line->content = strdup("");
            buf->first_line->length = 0;
        }
        return;
    }

    Line *curr = buf->first_line;
    int i;
    for (i = 0; i < at && curr; i++) {
        curr = curr->next;
    }

    if (!curr) return;

    if (curr->prev) {
        curr->prev->next = curr->next;
    } else {
        buf->first_line = curr->next;
    }

    if (curr->next) {
        curr->next->prev = curr->prev;
    } else {
        buf->last_line = curr->prev;
    }

    if (buf->current_line == curr) {
        buf->current_line = curr->prev ? curr->prev : curr->next;
        if (buf->current_line) {
            buf->cursor_y = at > 0 ? at - 1 : 0;
            if (buf->cursor_x > buf->current_line->length) {
                buf->cursor_x = buf->current_line->length;
            }
        }
    }

    line_destroy(curr);
    buf->line_count--;
    buf->modified = true;
}

void buffer_join_line(Buffer *buf) {
    if (!buf->current_line || !buf->current_line->next) return;

    Line *next = buf->current_line->next;
    int old_len = buf->current_line->length;

    line_append_string(buf->current_line, next->content);

    buf->current_line->next = next->next;
    if (next->next) {
        next->next->prev = buf->current_line;
    } else {
        buf->last_line = buf->current_line;
    }

    line_destroy(next);
    buf->line_count--;
    buf->cursor_x = old_len;
    buf->modified = true;
}

void buffer_split_line(Buffer *buf) {
    if (!buf->current_line) return;

    Line *new_line = line_create();

    /* Move content after cursor to new line */
    if (buf->cursor_x < buf->current_line->length) {
        line_append_string(new_line, buf->current_line->content + buf->cursor_x);
        buf->current_line->content[buf->cursor_x] = '\0';
        buf->current_line->length = buf->cursor_x;
    }

    /* Insert new line after current */
    new_line->next = buf->current_line->next;
    new_line->prev = buf->current_line;
    if (buf->current_line->next) {
        buf->current_line->next->prev = new_line;
    } else {
        buf->last_line = new_line;
    }
    buf->current_line->next = new_line;

    buf->current_line = new_line;
    buf->cursor_x = 0;
    buf->cursor_y++;
    buf->line_count++;
    buf->modified = true;
}

/* ============ LINE OPERATIONS ============ */

Line* line_create(void) {
    Line *line = (Line*)calloc(1, sizeof(Line));
    if (!line) return NULL;

    line->capacity = 64;
    line->content = (char*)malloc(line->capacity);
    if (line->content) {
        line->content[0] = '\0';
    }
    line->length = 0;
    line->dirty = false;

    return line;
}

void line_destroy(Line *line) {
    if (!line) return;
    free(line->content);
    free(line);
}

void line_insert_char(Line *line, int pos, char c) {
    if (!line || pos < 0 || pos > line->length) return;

    /* Ensure capacity */
    if (line->length + 1 >= line->capacity) {
        line->capacity *= 2;
        line->content = (char*)realloc(line->content, line->capacity);
    }

    /* Shift content */
    memmove(line->content + pos + 1, line->content + pos, line->length - pos + 1);
    line->content[pos] = c;
    line->length++;
    line->dirty = true;
}

void line_delete_char(Line *line, int pos) {
    if (!line || pos < 0 || pos >= line->length) return;

    memmove(line->content + pos, line->content + pos + 1, line->length - pos);
    line->length--;
    line->dirty = true;
}

void line_append_string(Line *line, const char *str) {
    if (!line || !str) return;

    int len = strlen(str);
    if (line->length + len >= line->capacity) {
        while (line->capacity <= line->length + len) {
            line->capacity *= 2;
        }
        line->content = (char*)realloc(line->content, line->capacity);
    }

    strcpy(line->content + line->length, str);
    line->length += len;
    line->dirty = true;
}

void line_insert_string(Line *line, int pos, const char *str) {
    if (!line || !str || pos < 0 || pos > line->length) return;

    int len = strlen(str);
    if (line->length + len >= line->capacity) {
        while (line->capacity <= line->length + len) {
            line->capacity *= 2;
        }
        line->content = (char*)realloc(line->content, line->capacity);
    }

    memmove(line->content + pos + len, line->content + pos, line->length - pos + 1);
    memcpy(line->content + pos, str, len);
    line->length += len;
    line->dirty = true;
}
