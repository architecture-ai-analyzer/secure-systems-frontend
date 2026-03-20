// Mock data for generating comprehensive technical reports

const COMPONENT_TYPES = [
  'Web Server', 'Load Balancer', 'Database', 'Cache', 'Message Queue',
  'API Gateway', 'Microservice', 'Mobile App', 'Frontend SPA', 'CDN'
];

const SECURITY_RISKS = [
  {
    level: 'Alto',
    title: 'Comunicação não criptografada entre componentes',
    description: 'Interface entre web server e database não utiliza SSL/TLS',
    recommendation: 'Implementar conexões seguras com certificados válidos'
  },
  {
    level: 'Médio',
    title: 'Ausência de firewall entre camadas',
    description: 'Componentes de diferentes camadas se comunicam diretamente',
    recommendation: 'Configurar firewall de aplicação e segmentação de rede'
  },
  {
    level: 'Baixo',
    title: 'Logs de auditoria insuficientes',
    description: 'Falta de rastreabilidade nas operações críticas',
    recommendation: 'Implementar logging detalhado e monitoramento'
  }
];

const ARCHITECTURE_PATTERNS = [
  {
    pattern: 'Arquitetura em Camadas (Layered)',
    detected: true,
    description: 'Separação clara entre apresentação, lógica e dados',
    benefits: ['Separação de responsabilidades', 'Facilita manutenção', 'Reutilização de código']
  },
  {
    pattern: 'Microserviços',
    detected: false,
    description: 'Aplicação monolítica identificada',
    recommendation: 'Considerar decomposição em microserviços para escalabilidade'
  },
  {
    pattern: 'API Gateway',
    detected: true,
    description: 'Ponto único de entrada para APIs',
    benefits: ['Controle centralizado', 'Rate limiting', 'Autenticação unificada']
  }
];

const PERFORMANCE_METRICS = [
  {
    metric: 'Latência Estimada',
    value: '150ms',
    status: 'good',
    description: 'Tempo de resposta esperado dentro do aceitável'
  },
  {
    metric: 'Throughput',
    value: '1000 req/s',
    status: 'warning',
    description: 'Capacidade pode ser limitada pelo database'
  },
  {
    metric: 'Disponibilidade',
    value: '99.5%',
    status: 'good',
    description: 'SLA adequado com redundância implementada'
  }
];

export class MockApiService {
  static getCompletedUploadsMock() {
    const now = new Date();
    const createdAt = new Date(now.getTime() - 1000 * 60 * 12).toISOString();
    const updatedAt = new Date(now.getTime() - 1000 * 60 * 7).toISOString();

    return [
      {
        id: 'mock-completed-architecture-1',
        fileName: 'arquitetura-ecommerce-v1.pdf',
        fileSize: 2_458_624,
        status: 'Analisado',
        createdAt,
        updatedAt
      }
    ];
  }

  static async generateReport(uploadId, fileName) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const detectedComponents = this.generateComponents();
    const securityAnalysis = this.generateSecurityAnalysis();
    const architectureAnalysis = this.generateArchitectureAnalysis();
    const performanceAnalysis = this.generatePerformanceAnalysis();
    const recommendations = this.generateRecommendations();

    return {
      id: uploadId,
      fileName: fileName,
      generatedAt: new Date().toISOString(),
      summary: {
        totalComponents: detectedComponents.length,
        riskLevel: 'Médio',
        securityScore: 75,
        performanceScore: 80,
        architectureScore: 85
      },
      detectedComponents,
      securityAnalysis,
      architectureAnalysis,
      performanceAnalysis,
      recommendations
    };
  }

  static generateComponents() {
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 components
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `${COMPONENT_TYPES[Math.floor(Math.random() * COMPONENT_TYPES.length)]} ${i + 1}`,
      type: COMPONENT_TYPES[Math.floor(Math.random() * COMPONENT_TYPES.length)],
      connections: Math.floor(Math.random() * 3) + 1,
      criticality: ['Alta', 'Média', 'Baixa'][Math.floor(Math.random() * 3)]
    }));
  }

  static generateSecurityAnalysis() {
    return {
      overallRisk: 'Médio',
      risksFound: Math.floor(Math.random() * 3) + 2,
      risks: SECURITY_RISKS.slice(0, Math.floor(Math.random() * 3) + 1),
      compliance: {
        lgpd: Math.random() > 0.5,
        iso27001: Math.random() > 0.3,
        owasp: Math.random() > 0.4
      }
    };
  }

  static generateArchitectureAnalysis() {
    return {
      patterns: ARCHITECTURE_PATTERNS,
      complexity: ['Baixa', 'Média', 'Alta'][Math.floor(Math.random() * 3)],
      maintainability: Math.floor(Math.random() * 40) + 60, // 60-100
      scalability: Math.floor(Math.random() * 40) + 50 // 50-90
    };
  }

  static generatePerformanceAnalysis() {
    return {
      metrics: PERFORMANCE_METRICS,
      bottlenecks: [
        'Database queries não otimizadas',
        'Ausência de cache distributivo',
        'Load balancing inadequado'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      capacity: {
        current: '70%',
        recommended: '80%',
        maxCapacity: '1200 req/s'
      }
    };
  }

  static generateRecommendations() {
    const allRecommendations = [
      {
        priority: 'Alta',
        category: 'Segurança',
        title: 'Implementar autenticação multifator',
        description: 'Adicionar camada extra de segurança para acesso aos componentes críticos',
        effort: 'Médio',
        impact: 'Alto'
      },
      {
        priority: 'Alta',
        category: 'Performance',
        title: 'Implementar sistema de cache',
        description: 'Reduzir latência com cache Redis ou Memcached',
        effort: 'Alto',
        impact: 'Alto'
      },
      {
        priority: 'Média',
        category: 'Arquitetura',
        title: 'Adicionar circuit breaker pattern',
        description: 'Melhorar resiliência da aplicação com tratamento de falhas',
        effort: 'Médio',
        impact: 'Médio'
      },
      {
        priority: 'Baixa',
        category: 'Monitoramento',
        title: 'Implementar observabilidade',
        description: 'Adicionar métricas, logs e tracing distribuído',
        effort: 'Alto',
        impact: 'Médio'
      }
    ];

    return allRecommendations.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  static async getProcessingStatus(uploadId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: uploadId,
      status: 'Em processamento',
      progress: Math.floor(Math.random() * 100),
      estimatedTimeRemaining: '2 minutos',
      currentStep: 'Analisando componentes de arquitetura...'
    };
  }
}