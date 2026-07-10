/**
 * Controla a interatividade do terminal fictício welcome.php no Hero
 */

const TERMINAL_OUTPUT_LINES = [
    'Olá! Bem-vindo ao meu portfólio.',
    'Sou Guilherme, desenvolvedor Full Stack.',
    'Stack: Laravel · Vue.js · PHP · MySQL',
    '4 projetos em produção · 3+ anos · 10+ entregas',
];

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function initInteractiveTerminal() {
    const terminal = document.querySelector('.hero-terminal');
    if (!terminal) return;

    const bar = terminal.querySelector('.hero-terminal-bar');
    const body = terminal.querySelector('.hero-terminal-body');
    if (!bar || !body) return;

    const originalBodyHTML = body.innerHTML;
    const reducedMotion = prefersReducedMotion();

    if (bar.querySelector('.hero-terminal-run')) {
        return;
    }

    const runBtn = document.createElement('button');
    runBtn.className = 'hero-terminal-run';
    runBtn.type = 'button';
    runBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> <span>Run</span>';
    runBtn.setAttribute('aria-label', 'Executar script PHP');
    bar.appendChild(runBtn);

    let isExecuting = false;
    let consoleContainer = null;

    runBtn.addEventListener('click', async () => {
        if (isExecuting) return;

        if (runBtn.classList.contains('reset')) {
            resetTerminal();
            return;
        }

        isExecuting = true;
        runBtn.className = 'hero-terminal-run running';
        runBtn.innerHTML =
            '<i class="fas fa-circle-notch console-spinner" aria-hidden="true"></i> <span>Running...</span>';
        runBtn.setAttribute('aria-busy', 'true');

        body.innerHTML = '';

        if (consoleContainer) {
            consoleContainer.remove();
        }

        consoleContainer = document.createElement('div');
        consoleContainer.className = 'hero-terminal-console font-mono';
        body.appendChild(consoleContainer);
        body.scrollTop = body.scrollHeight;

        try {
            const promptLine = document.createElement('div');
            promptLine.className = 'console-line';
            promptLine.innerHTML =
                '<span class="console-prompt">$ </span>' +
                '<span class="console-input"></span>' +
                '<span class="console-cursor"></span>';
            consoleContainer.appendChild(promptLine);

            const inputSpan = promptLine.querySelector('.console-input');
            const cursor = promptLine.querySelector('.console-cursor');
            const command = 'php welcome.php';

            if (reducedMotion) {
                inputSpan.textContent = command;
                cursor.remove();
            } else {
                for (let i = 0; i < command.length; i++) {
                    await sleep(50 + Math.random() * 50);
                    inputSpan.textContent += command[i];
                    body.scrollTop = body.scrollHeight;
                }
                cursor.remove();
            }

            await sleep(reducedMotion ? 120 : 400);

            for (const line of TERMINAL_OUTPUT_LINES) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'console-line console-output';
                lineDiv.textContent = line;
                consoleContainer.appendChild(lineDiv);
                body.scrollTop = body.scrollHeight;

                if (!reducedMotion) {
                    await sleep(250);
                }
            }

            const finalPrompt = document.createElement('div');
            finalPrompt.className = 'console-line';
            finalPrompt.innerHTML =
                '<span class="console-prompt">$ </span><span class="console-cursor"></span>';
            consoleContainer.appendChild(finalPrompt);
            body.scrollTop = body.scrollHeight;

            runBtn.className = 'hero-terminal-run success';
            runBtn.innerHTML =
                '<i class="fas fa-check-circle" aria-hidden="true"></i> <span>Done</span>';
            runBtn.setAttribute('aria-label', 'Script executado com sucesso. Clique para resetar.');

            await sleep(reducedMotion ? 400 : 900);

            runBtn.className = 'hero-terminal-run reset';
            runBtn.innerHTML = '<i class="fas fa-undo" aria-hidden="true"></i> <span>Reset</span>';
            runBtn.setAttribute('aria-label', 'Resetar terminal');
        } catch (err) {
            console.error('Erro na execução do terminal:', err);
            runBtn.className = 'hero-terminal-run reset';
            runBtn.innerHTML = '<i class="fas fa-undo" aria-hidden="true"></i> <span>Reset</span>';
        } finally {
            isExecuting = false;
            runBtn.removeAttribute('aria-busy');
        }
    });

    function resetTerminal() {
        if (consoleContainer) {
            if (reducedMotion) {
                consoleContainer.remove();
                consoleContainer = null;
            } else {
                consoleContainer.style.opacity = '0';
                consoleContainer.style.transition = 'opacity 0.2s ease';
                setTimeout(() => {
                    consoleContainer.remove();
                    consoleContainer = null;
                }, 200);
            }
        }

        if (originalBodyHTML !== undefined) {
            body.innerHTML = originalBodyHTML;
        }

        runBtn.className = 'hero-terminal-run';
        runBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> <span>Run</span>';
        runBtn.setAttribute('aria-label', 'Executar script PHP');
    }
}
