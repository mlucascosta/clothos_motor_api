/**
 * @fileoverview Adapter que decifra PII cifrada pelo Laravel (CPF e perfil do investigado).
 * @module infrastructure/crypto/LaravelPiiResolver
 *
 * Implementa a porta {@link CpfIdentifierResolver} do FinderJobProcessor e resolve também o
 * perfil (data de nascimento, etc.). O valor claro só existe no retorno, em memória — nunca
 * logado nem persistido. A chave é apontada por key_id, permitindo rotação futura.
 */

import { Buffer } from 'node:buffer';
import type { CpfIdentifierResolver } from '@application/finder/FinderJobProcessor.js';
import { laravelDecryptString } from '@shared/infrastructure/crypto/laravelCrypt.js';

export class LaravelPiiResolver implements CpfIdentifierResolver {
  private readonly keys: Map<string, Buffer>;

  constructor(keysById: Record<string, Buffer>) {
    this.keys = new Map(Object.entries(keysById));
  }

  /**
   * Monta o resolver a partir do ambiente. Requer ENCRYPTION_KEY (hex de 32 bytes), a MESMA
   * do Laravel. Sem ela, devolve undefined — o processor então trata CPF como indisponível
   * (fonte PF fica fora), em vez de falhar de forma opaca.
   */
  static fromEnvironment(env: Record<string, string | undefined>): LaravelPiiResolver | undefined {
    const hex = env['ENCRYPTION_KEY'];
    if (hex === undefined || !/^[0-9a-fA-F]{64}$/.test(hex)) {
      return undefined;
    }
    return new LaravelPiiResolver({ v1: Buffer.from(hex, 'hex') });
  }

  /** Decifra o CPF (porta CpfIdentifierResolver). */
  async resolve(ciphertext: string, keyId: string): Promise<string> {
    return this.decrypt(ciphertext, keyId);
  }

  /**
   * Decifra e parseia o perfil do investigado (slug canônico -> valor). Rejeita qualquer coisa
   * que não seja um objeto plano de strings.
   */
  async resolveProfile(ciphertext: string, keyId: string): Promise<Record<string, string>> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.decrypt(ciphertext, keyId));
    } catch {
      throw new Error('invalid_subject_profile');
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('invalid_subject_profile');
    }
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value !== 'string') {
        throw new Error('invalid_subject_profile');
      }
      out[key] = value;
    }
    return out;
  }

  private decrypt(ciphertext: string, keyId: string): string {
    const key = this.keys.get(keyId);
    if (key === undefined) {
      throw new Error('unknown_key_id');
    }
    return laravelDecryptString(ciphertext, key);
  }
}
