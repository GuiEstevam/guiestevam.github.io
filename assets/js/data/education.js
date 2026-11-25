/**
 * Formação acadêmica — coluna "Formação e publicação" da Trajetória
 * publication: artigo ligado ao curso (exibido dentro do item).
 */

export const EDUCATION_ITEMS = [
 {
  id: 'engenharia-computacao',
  title: 'Engenharia da Computação',
  institution: 'Instituto Federal de São Paulo (IFSP)',
  period: '2026 · 2029',
  status: 'Em andamento',
  current: true,
 },
 {
  id: 'pos-gestao-si',
  title: 'Pós-graduação em Gestão de Sistemas de Informação',
  institution: 'Instituto Federal de São Paulo (IFSP)',
  period: '2024 · 2025',
  status: 'Concluída',
  publication: {
   kind: 'Artigo publicado',
   venue: 'SDC Guarulhos',
   title:
    'Impacto de fatores socioeconômicos no desempenho acadêmico: uma análise preditiva com dados do NAEP',
   href: 'https://sdc.guarulhos.sp.gov.br/index.php/SDC/article/view/1785',
  },
 },
 {
  id: 'ads',
  title: 'Análise e Desenvolvimento de Sistemas',
  institution: 'Instituto Federal de São Paulo (IFSP)',
  period: '2019 · 2022',
  status: 'Concluído',
 },
];
