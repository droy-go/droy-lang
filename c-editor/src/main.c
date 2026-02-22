/**
 * Droy Code Editor - Main Entry Point
 * ====================================
 * Terminal-based code editor for Droy Programming Language
 *
 * Usage: droy-editor [filename]
 *
 * Features:
 * - Vim-like key bindings
 * - Syntax highlighting for Droy language
 * - Multi-file editing
 * - Search and replace
 * - File explorer sidebar
 */

#include "../include/droy_editor.h"
#include <locale.h>
#include <unistd.h>

/* ============ VERSION INFO ============ */

#define VERSION "1.0.0"
#define BUILD_DATE __DATE__

/* ============ FUNCTION PROTOTYPES ============ */

void print_usage(const char *program_name);
void print_version(void);
void print_help(void);

/* ============ MAIN FUNCTION ============ */

int main(int argc, char *argv[]) {
    /* Set locale for Unicode support */
    setlocale(LC_ALL, "");

    /* Parse command line arguments */
    const char *filename = NULL;
    bool show_help = false;
    bool show_version = false;

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--help") == 0 || strcmp(argv[i], "-h") == 0) {
            show_help = true;
        } else if (strcmp(argv[i], "--version") == 0 || strcmp(argv[i], "-v") == 0) {
            show_version = true;
        } else if (argv[i][0] != '-') {
            filename = argv[i];
        } else {
            fprintf(stderr, "Unknown option: %s\n", argv[i]);
            print_usage(argv[0]);
            return 1;
        }
    }

    if (show_version) {
        print_version();
        return 0;
    }

    if (show_help) {
        print_help();
        return 0;
    }

    /* Check terminal */
    if (!isatty(STDIN_FILENO) || !isatty(STDOUT_FILENO)) {
        fprintf(stderr, "Error: droy-editor requires a terminal\n");
        return 1;
    }

    /* Create editor */
    Editor *ed = editor_create();
    if (!ed) {
        fprintf(stderr, "Failed to initialize editor\n");
        return 1;
    }

    /* Open file if specified */
    if (filename) {
        editor_open_file(ed, filename);
    }

    /* Run editor */
    editor_run(ed);

    /* Cleanup */
    editor_destroy(ed);

    return 0;
}

/* ============ USAGE FUNCTIONS ============ */

void print_usage(const char *program_name) {
    printf("Usage: %s [options] [filename]\n", program_name);
    printf("\nOptions:\n");
    printf("  -h, --help     Show this help message\n");
    printf("  -v, --version  Show version information\n");
    printf("\nFor more information, use --help\n");
}

void print_version(void) {
    printf("Droy Editor v%s (built %s)\n", VERSION, BUILD_DATE);
    printf("A terminal-based code editor for Droy Programming Language\n");
    printf("\nCopyright (c) 2026 Droy Language Project\n");
    printf("Licensed under the MIT License\n");
}

void print_help(void) {
    printf("╔══════════════════════════════════════════════════════════════════╗\n");
    printf("║                    DROY EDITOR - HELP                            ║\n");
    printf("╠══════════════════════════════════════════════════════════════════╣\n");
    printf("║  Droy Editor is a terminal-based code editor with Vim-like       ║\n");
    printf("║  key bindings, designed specifically for the Droy language.      ║\n");
    printf("╠══════════════════════════════════════════════════════════════════╣\n");
    printf("║  NORMAL MODE                                                     ║\n");
    printf("╠══════════════════════════════════════════════════════════════════╣\n");
    printf("║  Movement:                                                       ║\n");
    printf("║    h, j, k, l     Move left, down, up, right                     ║\n");
    printf("║    w, b           Move word forward/backward                     ║\n");
    printf("║    0, $           Move to start/end of line                      ║\n");
    printf("║    gg, G          Move to first/last line                        ║\n");
    printf("║    Ctrl+u, Ctrl+d Page up/down                                   ║\n");
    printf("║                                                                  ║\n");
    printf("║  Editing:                                                        ║\n");
    printf("║    i, a           Insert mode (before/after cursor)              ║\n");
    printf("║    I, A           Insert at start/end of line                    ║\n");
    printf("║    o, O           Open new line below/above                      ║\n");
    printf("║    x, X           Delete character under/before cursor           ║\n");
    printf("║    dd             Delete current line                            ║\n");
    printf("║    yy             Copy (yank) current line                       ║\n");
    printf("║    p              Paste after cursor                             ║\n");
    printf("║    >, <           Indent/deindent line                           ║\n");
    printf("║                                                                  ║\n");
    printf("║  Search:                                                         ║\n");
    printf("║    /pattern       Search forward                                 ║\n");
    printf("║    n, N           Next/previous match                            ║\n");
    printf("║                                                                  ║\n");
    printf("║  Commands (:):                                                   ║\n");
    printf("║    :w             Save file                                      ║\n");
    printf("║    :w filename    Save as                                        ║\n");
    printf("║    :q             Quit                                           ║\n");
    printf("║    :q!            Quit without saving                            ║\n");
    printf("║    :wq            Save and quit                                  ║\n");
    printf("║    :e filename    Open file                                      ║\n");
    printf("║    :n             New file                                       ║\n");
    printf("║    :bn, :bp       Next/previous buffer                           ║\n");
    printf("║    :set nu        Show line numbers                              ║\n");
    printf("║    :set nonu      Hide line numbers                              ║\n");
    printf("║    :help          Show this help                                 ║\n");
    printf("║                                                                  ║\n");
    printf("║  Other:                                                          ║\n");
    printf("║    ?              Quick help                                     ║\n");
    printf("║    Ctrl+b         Toggle sidebar                                 ║\n");
    printf("║    Ctrl+n         Next buffer                                    ║\n");
    printf("║    Ctrl+p         Previous buffer                                ║\n");
    printf("║    Ctrl+q         Quit                                           ║\n");
    printf("╠══════════════════════════════════════════════════════════════════╣\n");
    printf("║  INSERT MODE                                                     ║\n");
    printf("╠══════════════════════════════════════════════════════════════════╣\n");
    printf("║    Esc, Ctrl+c    Return to normal mode                          ║\n");
    printf("║    Tab            Insert spaces                                  ║\n");
    printf("║    Backspace      Delete previous character                      ║\n");
    printf("║    Delete         Delete character under cursor                  ║\n");
    printf("║    Arrow keys     Move cursor                                    ║\n");
    printf("╚══════════════════════════════════════════════════════════════════╝\n");
}
