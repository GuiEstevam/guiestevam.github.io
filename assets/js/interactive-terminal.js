/**
 * Terminal welcome.php no Hero:
 * PHP estatico no load; animacao procedural so no Run
 * (comando + echos digitados caractere a caractere)
 */

import { getTerminalFocusLine, getTerminalStackLine } from './data/metrics.js';

const TERMINAL_OUTPUT_LINES = [
  'Olá! Bem-vindo ao meu portfólio.',
  'Sou Guilherme — desenvolvedor Full Stack.',
];

const CMD_CHAR_DELAY_MS = 55;
const ECHO_CHAR_DELAY_MS = 22;
const LINE_PAUSE_MS = 320;

function getTerminalOutputLines() {
  return [
    ...TERMINAL_OUTPUT_LINES,
    getTerminalStackLine(),
    getTerminalFocusLine(),
  ];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function syncMetricsLine(body) {
  const metricsEl = body.querySelector('[data-metrics-line="true"]');
  if (!metricsEl) return;
  metricsEl.textContent = `"${getTerminalStackLine()}\\n"`;
}

async function typeText(target, text, charDelayMs, scrollRoot) {
  for (let i = 0; i < text.length; i++) {
    target.textContent += text[i];
    if (scrollRoot) scrollRoot.scrollTop = scrollRoot.scrollHeight;
    await sleep(charDelayMs + Math.random() * 18);
  }
}

export function initInteractiveTerminal() {
  const terminal = document.querySelector('.hero-terminal');
  if (!terminal) return;

  const bar = terminal.querySelector('.hero-terminal-bar');
  const body = terminal.querySelector('.hero-terminal-body');
  if (!bar || !body) return;

  const existingBtn = bar.querySelector('.hero-terminal-run');
  if (existingBtn) existingBtn.remove();

  syncMetricsLine(body);
  const originalBodyHTML = body.innerHTML;

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
      const cmdCursor = promptLine.querySelector('.console-cursor');

      await typeText(inputSpan, 'php welcome.php', CMD_CHAR_DELAY_MS, body);
      cmdCursor.remove();
      await sleep(420);

      for (const line of getTerminalOutputLines()) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'console-line console-output';

        const textSpan = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.className = 'console-cursor';
        cursor.setAttribute('aria-hidden', 'true');

        lineDiv.appendChild(textSpan);
        lineDiv.appendChild(cursor);
        consoleContainer.appendChild(lineDiv);

        await typeText(textSpan, line, ECHO_CHAR_DELAY_MS, body);
        cursor.remove();
        await sleep(LINE_PAUSE_MS);
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
      runBtn.setAttribute(
        'aria-label',
        'Script executado com sucesso. Clique para resetar.'
      );

      await sleep(900);

      runBtn.className = 'hero-terminal-run reset';
      runBtn.innerHTML =
        '<i class="fas fa-undo" aria-hidden="true"></i> <span>Reset</span>';
      runBtn.setAttribute('aria-label', 'Resetar terminal');
    } catch (err) {
      console.error('Erro na execução do terminal:', err);
      runBtn.className = 'hero-terminal-run reset';
      runBtn.innerHTML =
        '<i class="fas fa-undo" aria-hidden="true"></i> <span>Reset</span>';
    } finally {
      isExecuting = false;
      runBtn.removeAttribute('aria-busy');
    }
  });

  function resetTerminal() {
    if (consoleContainer) {
      consoleContainer.remove();
      consoleContainer = null;
    }

    body.innerHTML = originalBodyHTML;
    body.scrollTop = 0;

    runBtn.className = 'hero-terminal-run';
    runBtn.innerHTML =
      '<i class="fas fa-play" aria-hidden="true"></i> <span>Run</span>';
    runBtn.setAttribute('aria-label', 'Executar script PHP');
  }
}
