import { type RegisteredSource, SourceRegistry } from '@application/finder/SourceRegistry.js';
import { deriveEscavadorArtifacts, deriveSubjectName } from '@application/finder/derived.js';
import type { ISourceExecutor } from '@application/queries/ports/ISourceExecutor.js';

const executor = (sourceName: string): ISourceExecutor => ({
  sourceName,
  execute: jest.fn(),
});

describe('SourceRegistry', () => {
  const sources: RegisteredSource[] = [
    { id: 'escavador', stage: 1, executor: executor('escavador') },
    {
      id: 'datajud',
      stage: 2,
      dependsOn: ['escavador'],
      requiresCandidate: true,
      executor: executor('datajud'),
    },
  ];

  it('includes dependencies and returns a stable stage order for explicit sources', () => {
    const registry = new SourceRegistry(sources, { judicial: ['datajud'] });

    expect(registry.plan({ sources: ['datajud'] }).map((source) => source.id)).toEqual([
      'escavador',
      'datajud',
    ]);
  });

  it('resolves source profiles without executing unselected sources', () => {
    const registry = new SourceRegistry(sources, { judicial: ['datajud'] });

    expect(registry.plan({ profile: 'judicial' }).map((source) => source.id)).toEqual([
      'escavador',
      'datajud',
    ]);
  });

  it('resolves commercial source codes to their canonical executor ids', () => {
    const registry = new SourceRegistry(
      [{ id: 'provider', aliases: ['provider_cnpj'], stage: 1, executor: executor('provider') }],
      {},
    );

    expect(registry.plan({ sources: ['provider_cnpj'] }).map((source) => source.id)).toEqual([
      'provider',
    ]);
  });
});

describe('derived Finder artifacts', () => {
  it('derives subject name for CPF/CNPJ source output with source provenance', () => {
    expect(deriveSubjectName('cpf', { nome: 'Pessoa Protegida' }, 'escavador', 9)).toEqual({
      key: 'subject.name',
      value: { name: 'Pessoa Protegida' },
      provenance: { sourceId: 'escavador', sourceExecutionId: 9, extractor: 'subject_name/v1' },
    });
  });

  it('bounds Escavador process candidates before later-source fan-out', () => {
    const artifacts = deriveEscavadorArtifacts(
      {
        nome: 'Acme Ltda',
        processos: [
          { numero_cnj: '1004634-81.2023.8.26.0045' },
          { numero_cnj: '0931245-20.2025.8.12.0001' },
          { numero_cnj: 'not-a-cnj' },
        ],
      },
      4,
      1,
    );

    expect(artifacts).toEqual([
      {
        key: 'subject.name',
        value: { name: 'Acme Ltda' },
        provenance: { sourceId: 'escavador', sourceExecutionId: 4, extractor: 'subject_name/v1' },
      },
      {
        key: 'process.candidates',
        value: {
          candidates: [
            { id: '10046348120238260045', cnj: '1004634-81.2023.8.26.0045', tribunal: 'tjsp' },
          ],
          omitted: 1,
        },
        provenance: {
          sourceId: 'escavador',
          sourceExecutionId: 4,
          extractor: 'escavador_processes/v1',
        },
      },
    ]);
  });
});
