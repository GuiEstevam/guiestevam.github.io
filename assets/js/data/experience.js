/**
 * Histórico profissional — fonte única para a timeline
 *
 * startDate / endDate (ISO YYYY-MM-DD): duração calculada em runtime.
 * endDate omitido ou null = cargo atual.
 */

export const EXPERIENCE_ITEMS = [
 {
  id: 'freelance',
  title: 'Desenvolvedor Full Stack',
  company: 'Freelancer',
  badges: [
   { text: 'Atual', variant: 'current' },
   { text: 'PJ', variant: 'dev' },
  ],
  period: 'jun de 2024 - o momento',
  startDate: '2024-06-01',
  endDate: null,
  location: 'Guarulhos, SP · Remota',
  parallelNote: 'Atuação em paralelo com o suporte de T.I.',
  description:
   'Desenvolvimento de aplicações web sob demanda: SaaS, e-commerces e sites institucionais. Entrego do levantamento ao deploy — Laravel, Livewire, Vue.js e MySQL — com foco em estabilidade, integrações e manutenção contínua.',
  stack: ['Laravel', 'Livewire', 'Vue.js', 'MySQL', 'TailwindCSS'],
  itemModifiers: ['experience-item--current'],
  cardModifiers: ['experience-card--current', 'experience-card--highlight'],
 },
 {
  id: 'nt-servicos',
  title: 'Suporte de T.I',
  company: 'NT Serviços e Comércio de Informática',
  badges: [
   { text: 'Atual', variant: 'current' },
   { text: 'Terceirizado' },
  ],
  period: 'ago de 2023 - o momento',
  startDate: '2023-08-01',
  endDate: null,
  location: 'São Paulo, Brasil · Remota',
  description:
   'Atuo no suporte técnico de nível 1 e 2, atendendo usuários e resolvendo incidentes relacionados a sistemas e ferramentas. Realizo manutenção e atualizações de servidores, máquinas e softwares, além de monitorar o desempenho para evitar falhas.',
  stack: [],
  itemModifiers: ['experience-item--current'],
  cardModifiers: ['experience-card--current'],
 },
 {
  id: 'unimais-fullstack',
  title: 'Desenvolvedor Full Stack',
  company: 'UNIMAIS - Faculdade Educamais',
  badges: [{ text: 'Dev', variant: 'dev' }],
  period: 'jan de 2022 - nov de 2022',
  startDate: '2022-01-01',
  endDate: '2022-11-30',
  location: 'São Paulo, Brasil · Remota',
  description:
   'Participei do desenvolvimento e testes de um produto em implementação: melhorias de funcionalidades, correção de bugs e evolução de fluxos em Laravel com interface Vue.js e MySQL, em ambiente de equipe remota.',
  stack: ['Laravel', 'Vue.js', 'MySQL'],
  itemModifiers: ['experience-item--featured'],
  cardModifiers: ['experience-card--highlight'],
 },
 {
  id: 'campos-ti',
  title: 'Assistente de TI',
  company: 'Campos Contabilidade e Consultoria Ltda.',
  badges: [{ text: 'Tempo integral' }],
  period: 'abr de 2020 - jan de 2022',
  startDate: '2020-04-01',
  endDate: '2022-01-31',
  location: 'Guarulhos, São Paulo, Brasil',
  parallelNote: 'Exercido em paralelo com o cargo na Online Certificadora.',
  description:
   'Atuava no gerenciamento e suporte aos colaboradores e clientes, sendo responsável pela resolução de incidentes e problemas técnicos. Realizava manutenção preventiva e corretiva de sistemas integrados, servidores e máquinas, além de oferecer suporte técnico remoto e presencial.',
  stack: [],
  itemModifiers: ['experience-item--parallel'],
  cardModifiers: [],
  collapsedByDefault: true,
 },
 {
  id: 'online-certificadora',
  title: 'Agente Certificador',
  company: 'Online Certificadora',
  badges: [{ text: 'Tempo integral' }],
  period: 'abr de 2020 - jan de 2022',
  startDate: '2020-04-01',
  endDate: '2022-01-31',
  location: 'Guarulhos, São Paulo, Brasil',
  parallelNote: 'Exercido em paralelo com o cargo na Campos Contabilidade.',
  description:
   'Experiência em emissão, renovação, manutenção e preparação de certificados de chave pública (certificados digitais) no padrão ICP-Brasil, garantindo que 100% dos processos de validação estivessem em conformidade com as regulamentações.',
  stack: [],
  itemModifiers: ['experience-item--parallel'],
  cardModifiers: [],
  collapsedByDefault: true,
 },
];
