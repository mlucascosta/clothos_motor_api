import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { BaseApiBrasilOperation } from './BaseApiBrasilOperation.js';
import type { ApiBrasilEndpointConfig } from './registry.js';

/**
 * Implementação concreta de operação ApiBrasil.
 * Recebe a configuração do endpoint em runtime — permite que um único
 * arquivo cubra todos os ~150 endpoints do marketplace ApiBrasil.
 */
export class ApiBrasilOperation extends BaseApiBrasilOperation {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;

  constructor(http: IHttpClient, config: ApiBrasilEndpointConfig) {
    super(http);
    this.path = config.path;
    this.creditValue = config.creditValue;
    this.type = config.type;
  }
}
