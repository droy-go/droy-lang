/**
 * Droy Code Editor - File Operations Module
 * ==========================================
 * Handles file I/O, buffer management, and file explorer
 */

#include "../include/droy_editor.h"
#include <sys/stat.h>
#include <dirent.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>

/* ============ FILE OPERATIONS ============ */

void editor_open_file(Editor *ed, const char *filename) {
    if (!filename || strlen(filename) == 0) {
        editor_show_message(ed, "No filename specified", COLOR_ERROR);
        return;
    }

    /* Check if file is already open */
    Buffer *existing = ed->buffers;
    int idx = 0;
    while (existing) {
        if (strcmp(existing->filename, filename) == 0) {
            ed->current_buffer = existing;
            ed->current_buffer_idx = idx;
            char msg[256];
            snprintf(msg, sizeof(msg), "Switched to buffer %d: %s", idx + 1, filename);
            editor_show_message(ed, msg, COLOR_SUCCESS);
            return;
        }
        existing = existing->next;
        idx++;
    }

    /* Create new buffer */
    Buffer *new_buf = buffer_create(filename);
    if (!new_buf) {
        editor_show_message(ed, "Failed to create buffer", COLOR_ERROR);
        return;
    }

    /* Add to buffer list */
    if (ed->buffers == NULL) {
        ed->buffers = new_buf;
    } else {
        Buffer *last = ed->buffers;
        while (last->next) {
            last = last->next;
        }
        last->next = new_buf;
    }

    ed->current_buffer = new_buf;
    ed->buffer_count++;
    ed->current_buffer_idx = ed->buffer_count - 1;

    char msg[256];
    if (file_exists(filename)) {
        snprintf(msg, sizeof(msg), "Opened: %s (%d lines)", filename, new_buf->line_count);
    } else {
        snprintf(msg, sizeof(msg), "New file: %s", filename);
    }
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

void editor_save_file(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (strlen(buf->filename) == 0 || strcmp(buf->filename, "untitled.droy") == 0) {
        editor_show_message(ed, "No filename. Use :w <filename>", COLOR_WARNING);
        return;
    }

    if (buffer_save(buf)) {
        char msg[256];
        snprintf(msg, sizeof(msg), "Saved: %s", buf->filename);
        editor_show_message(ed, msg, COLOR_SUCCESS);
    } else {
        char msg[256];
        snprintf(msg, sizeof(msg), "Failed to save: %s", strerror(errno));
        editor_show_message(ed, msg, COLOR_ERROR);
    }
}

void editor_save_as(Editor *ed, const char *filename) {
    if (!filename || strlen(filename) == 0) {
        editor_show_message(ed, "No filename specified", COLOR_ERROR);
        return;
    }

    Buffer *buf = ed->current_buffer;
    strncpy(buf->filename, filename, MAX_FILENAME - 1);
    buf->filename[MAX_FILENAME - 1] = '\0';

    if (buffer_save(buf)) {
        char msg[256];
        snprintf(msg, sizeof(msg), "Saved as: %s", filename);
        editor_show_message(ed, msg, COLOR_SUCCESS);
    } else {
        char msg[256];
        snprintf(msg, sizeof(msg), "Failed to save: %s", strerror(errno));
        editor_show_message(ed, msg, COLOR_ERROR);
    }
}

void editor_new_file(Editor *ed) {
    /* Create new buffer */
    Buffer *new_buf = buffer_create(NULL);
    if (!new_buf) {
        editor_show_message(ed, "Failed to create buffer", COLOR_ERROR);
        return;
    }

    /* Add to buffer list */
    if (ed->buffers == NULL) {
        ed->buffers = new_buf;
    } else {
        Buffer *last = ed->buffers;
        while (last->next) {
            last = last->next;
        }
        last->next = new_buf;
    }

    ed->current_buffer = new_buf;
    ed->buffer_count++;
    ed->current_buffer_idx = ed->buffer_count - 1;

    char msg[256];
    snprintf(msg, sizeof(msg), "New buffer %d created", ed->buffer_count);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

void editor_close_buffer(Editor *ed) {
    if (ed->buffer_count <= 1) {
        editor_show_message(ed, "Cannot close last buffer", COLOR_WARNING);
        return;
    }

    Buffer *buf = ed->current_buffer;

    /* Check for unsaved changes */
    if (buf->modified) {
        editor_show_message(ed, "Unsaved changes! Use :q! to force close.", COLOR_WARNING);
        return;
    }

    /* Remove from list */
    if (buf == ed->buffers) {
        ed->buffers = buf->next;
        ed->current_buffer = ed->buffers;
        ed->current_buffer_idx = 0;
    } else {
        Buffer *prev = ed->buffers;
        while (prev->next != buf) {
            prev = prev->next;
        }
        prev->next = buf->next;
        ed->current_buffer = prev->next ? prev->next : prev;
        ed->current_buffer_idx--;
    }

    buffer_destroy(buf);
    ed->buffer_count--;

    char msg[256];
    snprintf(msg, sizeof(msg), "Buffer closed. %d buffer(s) remaining.", ed->buffer_count);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

void editor_next_buffer(Editor *ed) {
    if (ed->buffer_count <= 1) {
        editor_show_message(ed, "No other buffers", COLOR_WARNING);
        return;
    }

    ed->current_buffer_idx = (ed->current_buffer_idx + 1) % ed->buffer_count;

    /* Find buffer at index */
    Buffer *buf = ed->buffers;
    for (int i = 0; i < ed->current_buffer_idx && buf; i++) {
        buf = buf->next;
    }

    ed->current_buffer = buf;

    char msg[256];
    snprintf(msg, sizeof(msg), "Buffer %d/%d: %s",
             ed->current_buffer_idx + 1, ed->buffer_count, buf->filename);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

void editor_prev_buffer(Editor *ed) {
    if (ed->buffer_count <= 1) {
        editor_show_message(ed, "No other buffers", COLOR_WARNING);
        return;
    }

    ed->current_buffer_idx = (ed->current_buffer_idx - 1 + ed->buffer_count) % ed->buffer_count;

    /* Find buffer at index */
    Buffer *buf = ed->buffers;
    for (int i = 0; i < ed->current_buffer_idx && buf; i++) {
        buf = buf->next;
    }

    ed->current_buffer = buf;

    char msg[256];
    snprintf(msg, sizeof(msg), "Buffer %d/%d: %s",
             ed->current_buffer_idx + 1, ed->buffer_count, buf->filename);
    editor_show_message(ed, msg, COLOR_SUCCESS);
}

/* ============ FILE EXPLORER ============ */

FileNode* file_tree_create(const char *path) {
    FileNode *root = malloc(sizeof(FileNode));
    if (!root) return NULL;

    strncpy(root->name, path, MAX_FILENAME - 1);
    root->name[MAX_FILENAME - 1] = '\0';
    root->is_directory = true;
    root->expanded = false;
    root->depth = 0;
    root->parent = NULL;
    root->children = NULL;
    root->next_sibling = NULL;

    file_tree_refresh(root);

    return root;
}

void file_tree_destroy(FileNode *node) {
    if (!node) return;

    /* Destroy children */
    FileNode *child = node->children;
    while (child) {
        FileNode *next = child->next_sibling;
        file_tree_destroy(child);
        child = next;
    }

    free(node);
}

static int compare_nodes(const void *a, const void *b) {
    FileNode *node_a = *(FileNode**)a;
    FileNode *node_b = *(FileNode**)b;

    /* Directories first */
    if (node_a->is_directory && !node_b->is_directory) return -1;
    if (!node_a->is_directory && node_b->is_directory) return 1;

    return strcmp(node_a->name, node_b->name);
}

void file_tree_refresh(FileNode *node) {
    if (!node || !node->is_directory) return;

    /* Destroy existing children */
    FileNode *child = node->children;
    while (child) {
        FileNode *next = child->next_sibling;
        file_tree_destroy(child);
        child = next;
    }
    node->children = NULL;

    /* Open directory */
    DIR *dir = opendir(node->name);
    if (!dir) return;

    /* Count entries */
    int count = 0;
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_name[0] != '.') {
            count++;
        }
    }
    rewinddir(dir);

    if (count == 0) {
        closedir(dir);
        return;
    }

    /* Create temporary array */
    FileNode **temp = malloc(count * sizeof(FileNode*));
    int i = 0;

    while ((entry = readdir(dir)) != NULL && i < count) {
        if (entry->d_name[0] == '.') continue;

        FileNode *new_node = malloc(sizeof(FileNode));
        strncpy(new_node->name, entry->d_name, MAX_FILENAME - 1);
        new_node->name[MAX_FILENAME - 1] = '\0';

        /* Check if directory */
        char full_path[MAX_FILENAME * 2];
        snprintf(full_path, sizeof(full_path), "%s/%s", node->name, entry->d_name);

        struct stat st;
        new_node->is_directory = (stat(full_path, &st) == 0 && S_ISDIR(st.st_mode));

        new_node->expanded = false;
        new_node->depth = node->depth + 1;
        new_node->parent = node;
        new_node->children = NULL;
        new_node->next_sibling = NULL;

        temp[i++] = new_node;
    }

    closedir(dir);

    /* Sort nodes */
    qsort(temp, i, sizeof(FileNode*), compare_nodes);

    /* Link siblings */
    for (int j = 0; j < i - 1; j++) {
        temp[j]->next_sibling = temp[j + 1];
    }

    node->children = temp[0];
    free(temp);
}

void file_tree_toggle_expand(FileNode *node) {
    if (!node || !node->is_directory) return;

    node->expanded = !node->expanded;
    if (node->expanded) {
        file_tree_refresh(node);
    }
}

void file_tree_select_next(Editor *ed) {
    /* TODO: Implement file tree navigation */
    (void)ed;
}

void file_tree_select_prev(Editor *ed) {
    /* TODO: Implement file tree navigation */
    (void)ed;
}

void file_tree_open_selected(Editor *ed) {
    /* TODO: Implement file tree file opening */
    (void)ed;
}

/* ============ UTILITY FUNCTIONS ============ */

bool file_exists(const char *filename) {
    struct stat st;
    return stat(filename, &st) == 0;
}

long get_file_size(const char *filename) {
    struct stat st;
    if (stat(filename, &st) == 0) {
        return st.st_size;
    }
    return -1;
}

/* ============ AUTO-SAVE ============ */

void editor_auto_save(Editor *ed) {
    Buffer *buf = ed->current_buffer;

    if (buf->modified && strlen(buf->filename) > 0) {
        /* Create backup filename */
        char backup[MAX_FILENAME + 4];
        snprintf(backup, sizeof(backup), "%s~", buf->filename);

        /* Save to backup */
        FILE *fp = fopen(backup, "w");
        if (fp) {
            Line *line = buf->first_line;
            while (line) {
                fprintf(fp, "%s\n", line->content);
                line = line->next;
            }
            fclose(fp);
        }
    }
}

/* ============ FILE TYPE DETECTION ============ */

const char* get_file_extension(const char *filename) {
    const char *dot = strrchr(filename, '.');
    if (!dot || dot == filename) return "";
    return dot + 1;
}

bool is_droy_file(const char *filename) {
    const char *ext = get_file_extension(filename);
    return strcmp(ext, "droy") == 0;
}

/* ============ RECENT FILES ============ */

#define MAX_RECENT_FILES 10

static char recent_files[MAX_RECENT_FILES][MAX_FILENAME];
static int recent_count = 0;

void add_recent_file(const char *filename) {
    /* Check if already in list */
    for (int i = 0; i < recent_count; i++) {
        if (strcmp(recent_files[i], filename) == 0) {
            /* Move to front */
            for (int j = i; j > 0; j--) {
                strcpy(recent_files[j], recent_files[j - 1]);
            }
            strcpy(recent_files[0], filename);
            return;
        }
    }

    /* Add new file */
    if (recent_count < MAX_RECENT_FILES) {
        recent_count++;
    }

    /* Shift and add */
    for (int i = recent_count - 1; i > 0; i--) {
        strcpy(recent_files[i], recent_files[i - 1]);
    }
    strcpy(recent_files[0], filename);
}

void editor_open_recent(Editor *ed, int index) {
    if (index < 0 || index >= recent_count) {
        editor_show_message(ed, "Invalid recent file index", COLOR_ERROR);
        return;
    }

    editor_open_file(ed, recent_files[index]);
}

/* ============ FILE BACKUP ============ */

bool create_backup(const char *filename) {
    char backup[MAX_FILENAME + 4];
    snprintf(backup, sizeof(backup), "%s.bak", filename);

    FILE *src = fopen(filename, "r");
    if (!src) return false;

    FILE *dst = fopen(backup, "w");
    if (!dst) {
        fclose(src);
        return false;
    }

    char buffer[4096];
    size_t n;
    while ((n = fread(buffer, 1, sizeof(buffer), src)) > 0) {
        fwrite(buffer, 1, n, dst);
    }

    fclose(src);
    fclose(dst);

    return true;
}
