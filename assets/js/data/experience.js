/**
 * Histórico profissional — fonte única da coluna "Experiência" da Trajetória
 *
 * startDate / endDate (ISO YYYY-MM-DD): duração calculada em runtime.
 * endDate omitido ou null = cargo atual.
 * compact: true = exibido sem descrição (experiências mais antigas).
 */

export const EXPERIENCE_ITEMS = [
 {
  id: 'freelance',
  title: 'Desenvolvedor Full Stack',
  company: 'Autônomo',
  period: 'desde jun 2024',
  startDate: '2024-06-01',
  endDate: null,
  current: true,
  description:
   'Desenvolvo sistemas web sob medida para clientes diretos e mantenho os projetos em funcionamento depois da publicação. Os trabalhos estão na seção Projetos.',
  link: { href: '#projetos', label: 'Ver projetos' },
 },
 {
  id: 'nt-servicos',
  title: 'Suporte de TI',
  company: 'NT Serviços e Comércio de Informática',
  period: 'desde ago 2023',
  startDate: '2023-08-01',
  endDate: null,
  current: true,
  description:
   'Suporte técnico de nível 1 e 2: atendimento a usuários, resolução de incidentes, manutenção de servidores e máquinas e monitoramento para evitar falhas.',
 },
 {
  id: 'unimais-fullstack',
  title: 'Desenvolvedor Full Stack',
  company: 'UNIMAIS, Faculdade Educamais',
  period: 'jan 2022 · nov 2022',
  startDate: '2022-01-01',
  endDate: '2022-11-30',
  description:
   'Desenvolvimento e testes de um produto em implantação, em equipe remota: novas funcionalidades, correção de bugs e evolução de fluxos em Laravel, Vue.js e MySQL.',
 },
 {
  id: 'campos-ti',
  title: 'Assistente de TI',
  company: 'Campos Contabilidade e Consultoria',
  period: 'abr 2020 · jan 2022',
  startDate: '2020-04-01',
  endDate: '2022-01-31',
  compact: true,
 },
 {
  id: 'online-certificadora',
  title: 'Agente Certificador',
  company: 'Online Certificadora',
  period: 'abr 2020 · jan 2022',
  startDate: '2020-04-01',
  endDate: '2022-01-31',
  compact: true,
 },
];
