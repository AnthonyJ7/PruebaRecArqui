
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async analyzePermitRisk(description: string, businessType: string): Promise<string> {
    try {
      const prompt = `Analiza el riesgo del siguiente permiso comercial para un carnaval municipal.
      Tipo: ${businessType}
      Descripción: ${description}
      Responde brevemente (max 30 palabras) indicando Nivel de Riesgo (Bajo/Medio/Alto) y una razón corta.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text.trim();
    } catch (error) {
      console.error('AI Error:', error);
      return 'Análisis no disponible temporalmente.';
    }
  }

  async generateCrowdActionPlan(squareName: string, occupancy: number, capacity: number): Promise<string> {
    try {
      const prompt = `La plaza "${squareName}" tiene una ocupación de ${occupancy}/${capacity} durante el carnaval.
      Esto es un ${(occupancy/capacity * 100).toFixed(1)}% de capacidad.
      Genera 3 acciones tácticas breves para el equipo de seguridad.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text.trim();
    } catch (error) {
      return 'Error generando plan de acción.';
    }
  }
  
  async askArchitect(question: string): Promise<string> {
    try {
        const prompt = `Actúa como un Arquitecto de Software experto. 
        Contexto: Sistema "CarnavalLogistics" (Angular, Modular, Zoneless).
        Pregunta del usuario: ${question}
        Responde de forma técnica, concisa y profesional.`;
        
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text.trim();
    } catch (e) {
        return "El arquitecto no está disponible en este momento.";
    }
  }
}
