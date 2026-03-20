# FIAP Secure Systems - Análise de Arquitetura de Software

MVP (Minimum Viable Product) para análise automatizada de diagramas de arquitetura de software, focado em componentes, riscos de segurança e recomendações arquiteturais.

## 🚀 Visão Geral

Este sistema permite que usuários enviem diagramas de arquitetura em formato PDF e recebam análises técnicas detalhadas incluindo:

- **Identificação de Componentes**: Detecção automática de elementos arquiteturais
- **Análise de Segurança**: Identificação de vulnerabilidades e riscos
- **Padrões Arquiteturais**: Reconhecimento de design patterns
- **Recomendações**: Sugestões de melhorias e otimizações
- **Métricas de Performance**: Análise de escalabilidade e performance

## 🖥️ Funcionalidades

### 1. Upload de Diagrama

- Interface drag-and-drop para arquivos PDF
- Validação de formato e tamanho
- Feedback visual durante o upload

### 2. Lista de Processamento

- Visualização de todos os uploads
- Filtros por status: Recebido, Em processamento, Analisado, Erro
- Acompanhamento em tempo real do progresso

### 3. Geração de Relatório

- Análise técnica abrangente
- Dashboard com métricas visuais
- Relatórios exportáveis em JSON
- Recomendações priorizadas por impacto

### 4. Consulta de Status

- Acompanhamento detalhado do processamento
- Estimativas de tempo
- Histórico de etapas executadas

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Estado**: React Context API
- **Simulação**: Mock APIs com dados realistas

## 📦 Instalação e Execução

### Pré-requisitos

```bash
Node.js 18+ (recomendado: Node.js 20+)
npm ou yarn
```

### Instalação

```bash
# Clone o repositório
git clone <repository-url>

# Navegue até o diretório
cd hackathon

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:5173 (ou 5174 se 5173 estiver ocupado)
```

### Build para Produção

```bash
# Gera build otimizado
npm run build

# Visualizar build local
npm run preview
```

### Linting

```bash
# Executar ESLint
npm run lint
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Layout.jsx       # Layout principal com navegação
│   └── FileUploader.jsx # Componente de upload
├── pages/               # Páginas da aplicação
│   ├── UploadPage.jsx   # Página de upload
│   ├── ProcessingListPage.jsx # Lista de processamento
│   ├── ReportPage.jsx   # Visualização de relatórios
│   └── StatusPage.jsx   # Consulta de status
├── context/             # Gerenciamento de estado
│   ├── ProcessingContext.js   # Contexto React
│   └── ProcessingContext.jsx  # Provider do contexto
├── hooks/               # Custom hooks
│   └── useProcessing.js # Hook para contexto
├── services/            # Serviços e APIs
│   └── mockApiService.js # Simulação de API
├── utils/               # Utilitários e helpers
│   ├── constants.js     # Constantes do sistema
│   └── helpers.js       # Funções auxiliares
└── main.jsx            # Ponto de entrada
```

## 🎯 Status de Processamento

O sistema simula 4 estados de processamento:

1. **Recebido** 🕐 - Arquivo recebido e validado
2. **Em processamento** ⚙️ - Análise em andamento
3. **Analisado** ✅ - Processamento concluído com sucesso
4. **Erro** ❌ - Falha durante o processamento

### Simulação Realística

- Tempo de processamento: 2-4 minutos
- Taxa de erro simulada: 10%
- Persistência local via localStorage

## 📊 Tipos de Análise

### Análise de Componentes

- Identificação automática de elementos
- Classificação por tipo e criticidade
- Mapeamento de conexões

### Análise de Segurança

- Detecção de vulnerabilidades
- Avaliação de conformidade (LGPD, ISO 27001, OWASP)
- Scored de segurança (0-100)

### Análise de Performance

- Métricas de latência e throughput
- Identificação de gargalos
- Recomendações de otimização

### Padrões Arquiteturais

- Detecção de design patterns
- Avaliação de manutenibilidade
- Sugestões de refatoração

## 🎨 Design System

### Cores FIAP

- **Primary Blue**: #003366
- **Light Blue**: #0066cc
- **Success Green**: #10b981
- **Warning Yellow**: #f59e0b
- **Error Red**: #ef4444

### Componentes Tailwind Customizados

```css
.btn-primary     # Botão principal FIAP
.btn-secondary   # Botão secundário
.card           # Card padrão do sistema
.status-badge   # Badge de status
```

## 🚦 Fluxo de Uso

1. **Upload**: Usuário faz upload do diagrama PDF
2. **Recebimento**: Sistema valida e confirma recebimento
3. **Processamento**: Análise automática (2-4 minutos)
4. **Relatório**: Visualização completa dos resultados
5. **Download**: Exportação dos dados para análise offline

## 📝 Próximos Passos

### Melhorias Planejadas

- [ ] Integração com API real de processamento
- [ ] Suporte a mais formatos (Visio, Draw.io)
- [ ] Notificações em tempo real via WebSocket
- [ ] Dashboard analítico com histórico
- [ ] Integração com ferramentas CI/CD
- [ ] Exportação em múltiplos formatos (PDF, Excel)

### Otimizações Técnicas

- [ ] Lazy loading de componentes
- [ ] Virtualização de listas
- [ ] Service Worker para offline
- [ ] Testes automatizados (Jest, Cypress)

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👥 Equipe

Desenvolvido pela equipe FIAP Secure Systems como MVP para análise automatizada de arquitetura de software.

---

**FIAP Secure Systems** - Transformando arquitetura em insights acionáveis 🚀
