import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '../config/env';

export class GeminiClient {
  private client: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI | null {
    const key = getGeminiApiKey();
    if (!key) return null;
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: key });
    }
    return this.client;
  }

  public isAvailable(): boolean {
    return Boolean(getGeminiApiKey());
  }

  public async generateStructured<T>(opts: {
    system: string;
    prompt: string;
    schema?: Record<string, unknown>;
    model?: string;
  }): Promise<T | null> {
    const client = this.getClient();
    if (!client) {
      console.warn('[GeminiClient] No GEMINI_API_KEY available; using authentic passage synthesizer.');
      return null;
    }

    try {
      const interaction = await client.interactions.create({
        model: opts.model || 'gemini-3.8-flash',
        system_instruction: opts.system,
        input: opts.prompt,
        store: false,
        response_format: opts.schema
          ? {
              type: 'text',
              mime_type: 'application/json',
              schema: opts.schema,
            }
          : {
              type: 'text',
              mime_type: 'application/json',
            },
      });

      const text = interaction.output_text;
      if (!text) return null;
      return JSON.parse(text) as T;
    } catch (err) {
      console.error('[GeminiClient] Generation error:', err);
      return null;
    }
  }
}

export const geminiClient = new GeminiClient();
