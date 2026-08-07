/**
 * Utilitários de Formatação
 */

/**
 * Formata duração entre duas datas em pt-BR (ex.: "2 anos e 4 meses")
 * @param {Date|string} startDate - Início do período
 * @param {Date|string|null} [endDate] - Fim (padrão: hoje)
 * @returns {string} Duração formatada
 */
export function formatDuration(startDate, endDate = null) {
    if (!startDate) return '';

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        return '';
    }

    let totalMonths =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    if (end.getDate() < start.getDate()) {
        totalMonths -= 1;
    }

    if (totalMonths < 1) {
        return 'menos de 1 mês';
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const yearLabel = years === 1 ? '1 ano' : `${years} anos`;
    const monthLabel = months === 1 ? '1 mês' : `${months} meses`;

    if (years === 0) return monthLabel;
    if (months === 0) return yearLabel;
    return `${yearLabel} e ${monthLabel}`;
}
