/**
 * Utilitários de Formatação
 * Formatação de datas, números e outros valores
 */

/**
 * Formata uma data para o formato português (DD/MM/YYYY)
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data formatada
 */
export function formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Formata uma data e hora para o formato português (DD/MM/YYYY HH:MM)
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data e hora formatadas
 */
export function formatDateTime(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Formata uma data relativa (ex: "há 2 dias")
 * @param {Date|string} date - Data a formatar
 * @returns {string} Data relativa formatada
 */
export function formatRelativeDate(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'hoje';
    } else if (diffDays === 1) {
        return 'ontem';
    } else if (diffDays < 7) {
        return `há ${diffDays} dias`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `há ${months} mês${months > 1 ? 'es' : ''}`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `há ${years} ano${years > 1 ? 's' : ''}`;
    }
}

/**
 * Formata um número com separador de milhares
 * @param {number} number - Número a formatar
 * @param {number} decimals - Casas decimais (padrão: 0)
 * @returns {string} Número formatado
 */
export function formatNumber(number, decimals = 0) {
    if (number === null || number === undefined || isNaN(number)) return '';

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
}

/**
 * Trunca um texto para um número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @param {string} suffix - Sufixo a adicionar (padrão: '...')
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength, suffix = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Trunca um texto por palavras completas, não por caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @param {string} suffix - Sufixo a adicionar (padrão: '...')
 * @returns {string} Texto truncado por palavras
 */
export function truncateTextByWords(text, maxLength, suffix = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    // Truncar por caracteres primeiro
    const truncated = text.substring(0, maxLength - suffix.length);
    
    // Encontrar o último espaço em branco para não cortar palavras
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + suffix;
    }
    
    // Se não houver espaço, usar truncate normal
    return truncated + suffix;
}

/**
 * Formata o nome do projeto para exibição legível
 * Converte snake_case e kebab-case para formato legível
 * @param {string} name - Nome do projeto
 * @returns {string} Nome formatado
 */
export function formatProjectName(name) {
    if (!name) return '';
    
    // Substituir underscores e hífens por espaços
    let formatted = name.replace(/[-_]/g, ' ');
    
    // Capitalizar primeira letra de cada palavra, mas preservar algumas palavras em maiúscula
    const preserveUpper = ['API', 'TCC', 'JS', 'TS', 'HTML', 'CSS', 'UI', 'UX', 'ID', 'URL'];
    
    formatted = formatted
        .split(' ')
        .map(word => {
            const upperWord = word.toUpperCase();
            if (preserveUpper.includes(upperWord)) {
                return upperWord;
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    
    return formatted;
}

