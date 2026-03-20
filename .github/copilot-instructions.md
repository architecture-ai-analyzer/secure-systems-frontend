<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FIAP Secure Systems - Análise de Arquitetura de Software

## Project Overview

Este é um MVP (Minimum Viable Product) React + Vite + Tailwind CSS para análise automatizada de diagramas de arquitetura de software. O sistema permite upload de PDFs e gera análises técnicas detalhadas com foco em segurança, performance e recomendações arquiteturais.

## Architecture & Tech Stack

- **Frontend**: React 19 + Vite 4.5.3
- **Styling**: Tailwind CSS com tema personalizado FIAP
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Mock APIs**: Simulação local com dados realistas
- **File Handling**: PDF upload com validação
- **Development**: ESLint + custom Tailwind components

## Key Features Implemented

- ✅ Upload de diagramas PDF com drag-and-drop
- ✅ Sistema de status com 4 estados: Recebido, Em processamento, Analisado, Erro
- ✅ Lista de processamento com filtros e ordenação
- ✅ Relatórios técnicos abrangentes com análise de segurança, performance e arquitetura
- ✅ Consulta individual de status com progresso detalhado
- ✅ Interface responsiva com tema FIAP (azul corporativo)
- ✅ Simulação realística de processamento (2-4 minutos)
- ✅ Persistência local via localStorage
- ✅ Exportação de relatórios em JSON

## Project Structure

```
src/
├── components/          # Layout, FileUploader
├── pages/               # Upload, ProcessingList, Report, Status
├── context/             # ProcessingContext (provider + context)
├── hooks/               # useProcessing custom hook
├── services/            # mockApiService para simulação
├── utils/               # constants, helpers (formatação, validação)
└── main.jsx            # Entry point
```

## Status Workflow

1. **Upload** → **Recebido** (imediato)
2. **Recebido** → **Em processamento** (30 segundos)
3. **Em processamento** → **Analisado** | **Erro** (2-4 minutos, 10% erro)

## Development Commands

- `npm run dev` - Servidor de desenvolvimento (porta 5174)
- `npm run build` - Build para produção
- `npm run lint` - Análise de código
- `npm run preview` - Preview do build

## Coding Guidelines

- Use componentes funcionais com hooks
- Tailwind CSS para estilização (classes utilitárias)
- Portuguese para labels e textos de interface
- Mock data para demonstrações realísticas
- Gestão de estado via Context API
- Validação de arquivos PDF (max 10MB)
- Responsive design (mobile-first)

## FIAP Brand Colors

- Primary: #003366 (fiap-blue)
- Secondary: #0066cc (fiap-light-blue)
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

## Notes for Copilot

- Mantenha consistência com o tema e cores FIAP
- Use terminologia em português para interface
- Simule dados realísticos para demonstrações
- Foque em usabilidade e feedback visual
- Respeite a arquitetura de componentes estabelecida
