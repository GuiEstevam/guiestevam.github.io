/**
 * Controla a interatividade do terminal fictício welcome.php no Hero
 */

export function initInteractiveTerminal() {
    const terminal = document.querySelector('.hero-terminal');
    if (!terminal) return;

    const bar = terminal.querySelector('.hero-terminal-bar');
    const body = terminal.querySelector('.hero-terminal-body');
    if (!bar || !body) return;
    // Guardar o HTML original do terminal (código PHP exibido)
    const originalBodyHTML = body.innerHTML;

    // Evitar duplicações em caso de Hot Module Replacement (HMR) do Vite
    if (bar.querySelector('.hero-terminal-run')) {
        return;
    }

    // Criar e injetar o botão Run
    const runBtn = document.createElement('button');
    runBtn.className = 'hero-terminal-run';
    runBtn.type = 'button';
    runBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> <span>Run</span>';
    runBtn.setAttribute('aria-label', 'Executar script PHP');
    bar.appendChild(runBtn);

    let isExecuting = false;
    let consoleContainer = null;

    // Linhas de output do script PHP
    const outputLines = [
        "Olá! Bem-vindo ao meu portfólio.",
        "Sou Guilherme, desenvolvedor Full Stack.",
        "Stack: Laravel · Vue.js · PHP · MySQL"
    ];

    runBtn.addEventListener('click', async () => {
        if (isExecuting) return;

        // Se já foi executado, o clique funciona como "Reset"
        if (runBtn.classList.contains('reset')) {
            resetTerminal();
            return;
        }

        isExecuting = true;
        runBtn.className = 'hero-terminal-run running';
        runBtn.innerHTML = '<i class="fas fa-circle-notch console-spinner" aria-hidden="true"></i> <span>Running...</span>';

        // Limpar o conteúdo original do terminal (código PHP) para mostrar somente a saída
        body.innerHTML = '';
        // Criar ou limpar o container da console
        if (consoleContainer) {
            consoleContainer.remove();
        }
        consoleContainer = document.createElement('div');
        consoleContainer.className = 'hero-terminal-console font-mono';
        body.appendChild(consoleContainer);

        // Rolar o corpo do terminal para exibir o console se necessário
        body.scrollTop = body.scrollHeight;

        try {
            // 1. Digitar o comando: $ php welcome.php
            const promptLine = document.createElement('div');
            promptLine.className = 'console-line';
            promptLine.innerHTML = '<span class="console-prompt">$ </span>' +
                                   '<span class="console-input"></span>' +
                                   '<span class="console-cursor"></span>';
            consoleContainer.appendChild(promptLine);

            
            const inputSpan = promptLine.querySelector('.console-input');
            const cursor = promptLine.querySelector('.console-cursor');
            const command = "php welcome.php";

            // Simular digitação
            for (let i = 0; i < command.length; i++) {
                await sleep(50 + Math.random() * 50); // variação de velocidade para realismo
                inputSpan.textContent += command[i];
                body.scrollTop = body.scrollHeight;
            }

            // Remover cursor da linha de comando digitada
            cursor.remove();

            // Mantém a linha digitada (comando) como parte do histórico do terminal
            // (não removemos promptLine, apenas deixamos o cursor desaparecido)

            // 2. Pequeno delay de processamento
            await sleep(400);

            // 3. Exibir outputs linha por linha com efeito cascata
            for (const line of outputLines) {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'console-line console-output';
                lineDiv.textContent = line;
                consoleContainer.appendChild(lineDiv);
                body.scrollTop = body.scrollHeight;
                await sleep(250);
            }

            // 4. Exibir nova prompt vazia com cursor piscando no final
            const finalPrompt = document.createElement('div');
            finalPrompt.className = 'console-line';
            finalPrompt.innerHTML = '<span class="console-prompt">$ </span><span class="console-cursor"></span>';
            consoleContainer.appendChild(finalPrompt);
            body.scrollTop = body.scrollHeight;

            // 5. Mudar botão para estado Reset
            runBtn.className = 'hero-terminal-run reset';
            runBtn.innerHTML = '<i class="fas fa-undo" aria-hidden="true"></i> <span>Reset</span>';

        } catch (err) {
            console.error('Erro na execução do terminal:', err);
        } finally {
            isExecuting = false;
        }
    });

    function resetTerminal() {
        if (consoleContainer) {
            consoleContainer.style.opacity = '0';
            consoleContainer.style.transition = 'opacity 0.2s ease';
            setTimeout(() => { consoleContainer.remove(); consoleContainer = null; }, 200);
        }
        // Restaurar o HTML original do terminal (código PHP) ao resetar
        if (originalBodyHTML !== undefined) {
            body.innerHTML = originalBodyHTML;
        }
        runBtn.className = 'hero-terminal-run';
        runBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> <span>Run</span>';
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
