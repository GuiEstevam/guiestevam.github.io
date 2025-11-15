/**
 * Sistema de Toast Global
 * Adaptado do padrão do GJ Finance Hub para portfólio estático
 */

(function() {
    'use strict';

    // Criação do container de toast se não existir
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'global-toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }

    const container = document.getElementById('toast-container');

    /**
     * Escape HTML para prevenir XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Remove um toast com animação
     */
    function removeToast(toast) {
        if (!toast || !toast.parentElement) return;

        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Mostra um toast
     * @param {string} message - Mensagem a exibir
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duração em milissegundos (padrão: 5000)
     */
    window.showToast = function(message, type = 'info', duration = 5000) {
        if (!message) return;

        // Criar elemento do toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        // Ícone baseado no tipo
        const icons = {
            success: '<i class="fas fa-check-circle" aria-hidden="true"></i>',
            error: '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>',
            warning: '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>',
            info: '<i class="fas fa-info-circle" aria-hidden="true"></i>'
        };

        // Conteúdo do toast
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${escapeHtml(message)}</span>
                <button class="toast-close" aria-label="Fechar notificação" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;

        // Adicionar ao container
        container.appendChild(toast);

        // Trigger animação de entrada
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, duration);
        }

        // Retornar função para remover manualmente
        return {
            remove: () => removeToast(toast)
        };
    };

})();

