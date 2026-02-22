/**
 * Droy Code Editor - Input Handling Module
 * =========================================
 * Handles all keyboard input and user interactions
 */

#include "../include/droy_editor.h"

/* ============ MAIN INPUT PROCESSING ============ */

void editor_process_input(Editor *ed) {
    int ch = getch();

    /* Handle resize */
    if (ch == KEY_RESIZE) {
        getmaxyx(stdscr, ed->screen_height, ed->screen_width);
        ed->editor_width = ed->screen_width - (ed->sidebar_visible ? ed->sidebar_width : 0);
        ed->editor_height = ed->screen_height - 2;
        return;
    }

    /* Route to appropriate handler based on mode */
    switch (ed->mode) {
        case MODE_NORMAL:
            handle_normal_mode(ed, ch);
            break;
        case MODE_INSERT:
            handle_insert_mode(ed, ch);
            break;
        case MODE_COMMAND:
            handle_command_mode(ed, ch);
            break;
        case MODE_SEARCH:
        case MODE_REPLACE:
            handle_search_mode(ed, ch);
            break;
        default:
            break;
    }

    /* Ensure cursor stays in bounds */
    if (ed->current_buffer) {
        Buffer *buf = ed->current_buffer;

        /* Clamp cursor_x */
        if (buf->cursor_x < 0) buf->cursor_x = 0;
        if (buf->cursor_x > buf->current_line->length) {
            buf->cursor_x = buf->current_line->length;
        }

        /* Clamp cursor_y */
        if (buf->cursor_y < 0) buf->cursor_y = 0;
        if (buf->cursor_y >= buf->line_count) {
            buf->cursor_y = buf->line_count - 1;
        }

        /* Update current_line pointer */
        buf->current_line = buf->first_line;
        for (int i = 0; i < buf->cursor_y && buf->current_line; i++) {
            buf->current_line = buf->current_line->next;
        }

        /* Update scroll if needed */
        if (buf->cursor_y < buf->scroll_y) {
            buf->scroll_y = buf->cursor_y;
        }
        if (buf->cursor_y >= buf->scroll_y + ed->editor_height) {
            buf->scroll_y = buf->cursor_y - ed->editor_height + 1;
        }
        if (buf->cursor_x < buf->scroll_x) {
            buf->scroll_x = buf->cursor_x;
        }
        if (buf->cursor_x >= buf->scroll_x + ed->editor_width - 10) {
            buf->scroll_x = buf->cursor_x - ed->editor_width + 11;
        }
    }
}

/* ============ NORMAL MODE HANDLER ============ */

void handle_normal_mode(Editor *ed, int ch) {
    Buffer *buf = ed->current_buffer;

    switch (ch) {
        /* Mode switching */
        case 'i':
            ed->mode = MODE_INSERT;
            break;
        case 'I':
            cursor_move_line_start(ed);
            ed->mode = MODE_INSERT;
            break;
        case 'a':
            cursor_move_right(ed);
            ed->mode = MODE_INSERT;
            break;
        case 'A':
            cursor_move_line_end(ed);
            ed->mode = MODE_INSERT;
            break;
        case 'o':
            cursor_move_line_end(ed);
            editor_insert_newline(ed);
            ed->mode = MODE_INSERT;
            break;
        case 'O':
            cursor_move_line_start(ed);
            editor_insert_newline(ed);
            cursor_move_up(ed);
            ed->mode = MODE_INSERT;
            break;

        /* Cursor movement */
        case 'h':
        case KEY_LEFT:
            cursor_move_left(ed);
            break;
        case 'j':
        case KEY_DOWN:
            cursor_move_down(ed);
            break;
        case 'k':
        case KEY_UP:
            cursor_move_up(ed);
            break;
        case 'l':
        case KEY_RIGHT:
            cursor_move_right(ed);
            break;
        case '0':
        case KEY_HOME:
            cursor_move_line_start(ed);
            break;
        case '$':
        case KEY_END:
            cursor_move_line_end(ed);
            break;
        case 'w':
            cursor_move_word_forward(ed);
            break;
        case 'b':
            cursor_move_word_backward(ed);
            break;
        case KEY_PPAGE:
            cursor_move_page_up(ed);
            break;
        case KEY_NPAGE:
            cursor_move_page_down(ed);
            break;
        case 'g':
            /* Wait for second 'g' for gg */
            {
                int next = getch();
                if (next == 'g') {
                    cursor_move_file_start(ed);
                }
            }
            break;
        case 'G':
            cursor_move_file_end(ed);
            break;

        /* Editing */
        case 'x':
            editor_delete_char(ed);
            break;
        case 'X':
            cursor_move_left(ed);
            editor_delete_char(ed);
            break;
        case 'd':
            {
                int next = getch();
                if (next == 'd') {
                    editor_delete_line(ed);
                } else if (next == 'w') {
                    /* Delete word */
                    int start = buf->cursor_x;
                    cursor_move_word_forward(ed);
                    for (int i = start; i < buf->cursor_x; i++) {
                        line_delete_char(buf->current_line, start);
                    }
                    buf->cursor_x = start;
                    buf->modified = true;
                }
            }
            break;
        case 'D':
            /* Delete to end of line */
            buf->current_line->content[buf->cursor_x] = '\0';
            buf->current_line->length = buf->cursor_x;
            buf->modified = true;
            break;
        case 'y':
            {
                int next = getch();
                if (next == 'y') {
                    editor_copy_line(ed);
                }
            }
            break;
        case 'p':
            editor_paste(ed);
            break;
        case 'J':
            buffer_join_line(buf);
            break;
        case '>':
            editor_indent(ed);
            break;
        case '<':
            editor_unindent(ed);
            break;

        /* Search */
        case '/':
            ed->mode = MODE_SEARCH;
            ed->search_buffer[0] = '\0';
            break;
        case 'n':
            editor_search_next(ed);
            break;
        case 'N':
            editor_search_prev(ed);
            break;

        /* File operations */
        case ':':
            ed->mode = MODE_COMMAND;
            ed->command_buffer[0] = '\0';
            break;

        /* Buffer switching */
        case KEY_CTRL('n'):
            editor_next_buffer(ed);
            break;
        case KEY_CTRL('p'):
            editor_prev_buffer(ed);
            break;

        /* Toggle sidebar */
        case KEY_CTRL('b'):
            ed->sidebar_visible = !ed->sidebar_visible;
            ed->editor_width = ed->screen_width - (ed->sidebar_visible ? ed->sidebar_width : 0);
            break;

        /* Help */
        case '?':
            editor_show_message(ed, "h/j/k/l=move, i=insert, :w=save, :q=quit, :wq=save&quit", COLOR_SUCCESS);
            break;

        /* Quit */
        case KEY_CTRL('q'):
            ed->running = false;
            break;

        default:
            break;
    }
}

/* ============ INSERT MODE HANDLER ============ */

void handle_insert_mode(Editor *ed, int ch) {
    switch (ch) {
        case KEY_ESC:
            ed->mode = MODE_NORMAL;
            cursor_move_left(ed);
            break;
        case KEY_CTRL('c'):
            ed->mode = MODE_NORMAL;
            break;
        case '\n':
        case '\r':
            editor_insert_newline(ed);
            break;
        case 127:
        case 8:
            editor_backspace(ed);
            break;
        case KEY_DC:
            editor_delete_char(ed);
            break;
        case KEY_TAB:
            /* Insert spaces for tab */
            for (int i = 0; i < TAB_SIZE; i++) {
                editor_insert_char(ed, ' ');
            }
            break;
        case KEY_LEFT:
            cursor_move_left(ed);
            break;
        case KEY_RIGHT:
            cursor_move_right(ed);
            break;
        case KEY_UP:
            cursor_move_up(ed);
            break;
        case KEY_DOWN:
            cursor_move_down(ed);
            break;
        default:
            if (ch >= 32 && ch < 127) {
                editor_insert_char(ed, (char)ch);
            }
            break;
    }
}

/* ============ COMMAND MODE HANDLER ============ */

void handle_command_mode(Editor *ed, int ch) {
    int len = strlen(ed->command_buffer);

    switch (ch) {
        case KEY_ESC:
        case KEY_CTRL('c'):
            ed->mode = MODE_NORMAL;
            ed->status_msg[0] = '\0';
            break;
        case '\n':
        case '\r':
            editor_execute_command(ed, ed->command_buffer);
            ed->mode = MODE_NORMAL;
            break;
        case 127:
        case 8:
            if (len > 0) {
                ed->command_buffer[len - 1] = '\0';
            } else {
                ed->mode = MODE_NORMAL;
            }
            break;
        default:
            if (ch >= 32 && ch < 127 && len < sizeof(ed->command_buffer) - 1) {
                ed->command_buffer[len] = (char)ch;
                ed->command_buffer[len + 1] = '\0';
            }
            break;
    }
}

/* ============ SEARCH MODE HANDLER ============ */

void handle_search_mode(Editor *ed, int ch) {
    char *buffer = (ed->mode == MODE_REPLACE) ? ed->replace_buffer : ed->search_buffer;
    int len = strlen(buffer);

    switch (ch) {
        case KEY_ESC:
        case KEY_CTRL('c'):
            ed->mode = MODE_NORMAL;
            break;
        case '\n':
        case '\r':
            if (ed->mode == MODE_SEARCH) {
                editor_search(ed, buffer);
                strncpy(ed->last_search, buffer, sizeof(ed->last_search) - 1);
            } else if (ed->mode == MODE_REPLACE) {
                editor_replace(ed, ed->search_buffer, buffer);
            }
            ed->mode = MODE_NORMAL;
            break;
        case 127:
        case 8:
            if (len > 0) {
                buffer[len - 1] = '\0';
            } else {
                ed->mode = MODE_NORMAL;
            }
            break;
        default:
            if (ch >= 32 && ch < 127 && len < 255) {
                buffer[len] = (char)ch;
                buffer[len + 1] = '\0';
            }
            break;
    }
}

/* ============ COMMAND EXECUTION ============ */

void editor_execute_command(Editor *ed, const char *cmd) {
    if (strcmp(cmd, "q") == 0 || strcmp(cmd, "quit") == 0) {
        if (ed->current_buffer->modified) {
            editor_show_message(ed, "Unsaved changes! Use :q! to force quit.", COLOR_WARNING);
        } else {
            ed->running = false;
        }
    } else if (strcmp(cmd, "q!") == 0 || strcmp(cmd, "quit!") == 0) {
        ed->running = false;
    } else if (strcmp(cmd, "w") == 0 || strcmp(cmd, "write") == 0) {
        editor_save_file(ed);
    } else if (strcmp(cmd, "wq") == 0 || strcmp(cmd, "x") == 0) {
        editor_save_file(ed);
        ed->running = false;
    } else if (strncmp(cmd, "w ", 2) == 0) {
        editor_save_as(ed, cmd + 2);
    } else if (strncmp(cmd, "saveas ", 7) == 0) {
        editor_save_as(ed, cmd + 7);
    } else if (strncmp(cmd, "e ", 2) == 0 || strncmp(cmd, "edit ", 5) == 0) {
        const char *filename = (cmd[1] == ' ') ? cmd + 2 : cmd + 5;
        editor_open_file(ed, filename);
    } else if (strcmp(cmd, "n") == 0 || strcmp(cmd, "new") == 0) {
        editor_new_file(ed);
    } else if (strcmp(cmd, "bn") == 0 || strcmp(cmd, "bnext") == 0) {
        editor_next_buffer(ed);
    } else if (strcmp(cmd, "bp") == 0 || strcmp(cmd, "bprev") == 0) {
        editor_prev_buffer(ed);
    } else if (strncmp(cmd, "bd", 2) == 0 || strncmp(cmd, "bdelete", 7) == 0) {
        editor_close_buffer(ed);
    } else if (strcmp(cmd, "set nu") == 0 || strcmp(cmd, "set number") == 0) {
        ed->show_line_numbers = true;
        editor_show_message(ed, "Line numbers enabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "set nonu") == 0 || strcmp(cmd, "set nonumber") == 0) {
        ed->show_line_numbers = false;
        editor_show_message(ed, "Line numbers disabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "set ai") == 0 || strcmp(cmd, "set autoindent") == 0) {
        ed->auto_indent = true;
        editor_show_message(ed, "Auto-indent enabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "set noai") == 0 || strcmp(cmd, "set noautoindent") == 0) {
        ed->auto_indent = false;
        editor_show_message(ed, "Auto-indent disabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "syntax on") == 0) {
        ed->syntax_highlight = true;
        editor_show_message(ed, "Syntax highlighting enabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "syntax off") == 0) {
        ed->syntax_highlight = false;
        editor_show_message(ed, "Syntax highlighting disabled", COLOR_SUCCESS);
    } else if (strcmp(cmd, "help") == 0 || strcmp(cmd, "h") == 0) {
        editor_show_message(ed, "Commands: :w=save :q=quit :e=file :n=new :bn=next :bp=prev", COLOR_SUCCESS);
    } else if (strlen(cmd) > 0) {
        char msg[256];
        snprintf(msg, sizeof(msg), "Unknown command: %s", cmd);
        editor_show_message(ed, msg, COLOR_ERROR);
    }
}
