/**
 * Histórico profissional — fonte única para a timeline
 */

export const EXPERIENCE_ITEMS = [
 {
  id: 'nt-servicos',
  title: 'Suporte de T.I',
  company: 'NT Serviços e Comércio de Informática',
  badges: [
   { text: 'Atual', variant: 'current' },
   { text: 'Terceirizado' },
  ],
  period: 'ago de 2023 - o momento',
  duration: '2 anos 4 meses',
  location: 'São Paulo, Brasil · Remota',
  description:
   'Atuo no suporte técnico de nível 1 e 2, atendendo usuários e resolvendo incidentes relacionados a sistemas e ferramentas. Realizo manutenção e atualizações de servidores, máquinas e softwares, além de monitorar o desempenho para evitar falhas.',
  stack: [],
  itemModifiers: ['experience-item--current'],
  cardModifiers: ['experience-card--current'],
 },
 {
  id: 'unimais-fullstack',
  title: 'Desenvolvedor Fullstack',
  company: 'UNIMAIS - Faculdade Educamais',
  badges: [{ text: 'Dev', variant: 'dev' }],
  period: 'jan de 2022 - nov de 2022',
  duration: '11 meses',
  location: 'São Paulo, Brasil · Remota',
  description:
   'Participei no desenvolvimento e testes de um projeto em implementação, com foco em melhorias de funcionalidades e resolução de problemas técnicos em ambiente Laravel com interface Vue.js.',
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
  duration: '1 ano 10 meses',
  location: 'Guarulhos, São Paulo, Brasil',
  parallelNote: 'Exercido em paralelo com o cargo na Online Certificadora.',
  description:
   'Atuava no gerenciamento e suporte aos colaboradores e clientes, sendo responsável pela resolução de incidentes e problemas técnicos. Realizava manutenção preventiva e corretiva de sistemas integrados, servidores e máquinas, além de oferecer suporte técnico remoto e presencial.',
  stack: [],
  itemModifiers: ['experience-item--parallel'],
  cardModifiers: [],
 },
 {
  id: 'online-certificadora',
  title: 'Agente Certificador',
  company: 'Online Certificadora',
  badges: [{ text: 'Tempo integral' }],
  period: 'abr de 2020 - jan de 2022',
  duration: '1 ano 10 meses',
  location: 'Guarulhos, São Paulo, Brasil',
  parallelNote: 'Exercido em paralelo com o cargo na Campos Contabilidade.',
  description:
   'Experiência em emissão, renovação, manutenção e preparação de certificados de chave pública (certificados digitais) no padrão ICP-Brasil, garantindo que 100% dos processos de validação estivessem em conformidade com as regulamentações.',
  stack: [],
  itemModifiers: ['experience-item--parallel'],
  cardModifiers: [],
 },
];
