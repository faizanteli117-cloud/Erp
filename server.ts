import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI Client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Healthcheck Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. AI Copilot Chat Endpoint
  app.post('/api/ai/copilot', async (req, res) => {
    try {
      const { prompt, language = 'English', contextData } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are Apex ERP AI Copilot - an expert enterprise business management assistant built for Vyapar/Linear-style ERP software.
Your job is to answer business questions, analyze ERP metrics, detect accounting errors, and generate structured invoice/quotation drafts from plain English or voice.
Target output language: ${language} (Provide fluent responses in ${language}, e.g. English, Hindi, or Urdu as requested).

You can return either:
1. A conversational response with insights, recommendations, or answers.
2. An actionable JSON command if the user requests creating an invoice/quotation/expense.

If the user asks to create an invoice, quotation, or purchase bill (e.g. "Create invoice for Acme for 5 UltraBook Pro"), include an "action" field in JSON with structured details.

Context Data from ERP state: ${JSON.stringify(contextData || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      const responseText = response.text || 'No response generated from AI.';
      res.json({ text: responseText });
    } catch (error: any) {
      console.error('Error in /api/ai/copilot:', error);
      res.status(500).json({
        text: `AI Assistant Encountered an Error: ${error.message || 'Unable to connect to Gemini API. Please verify your GEMINI_API_KEY.'}`
      });
    }
  });

  // 2. OCR Bill / Invoice Reader Endpoint
  app.post('/api/ai/parse-invoice', async (req, res) => {
    try {
      const { base64Image, mimeType = 'image/jpeg' } = req.body;
      const ai = getGeminiClient();

      if (!base64Image) {
        return res.status(400).json({ error: 'base64Image is required' });
      }

      // Clean base64 string if data URL prefix exists
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          mimeType,
          data: cleanBase64,
        }
      };

      const promptPart = {
        text: `Carefully read this uploaded purchase bill or receipt image and extract structured JSON invoice information. Extract: vendorName, invoiceNumber, date, subtotal, taxAmount, grandTotal, and line items (productName, quantity, unitPrice, totalAmount).`
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendorName: { type: Type.STRING },
              invoiceNumber: { type: Type.STRING },
              date: { type: Type.STRING },
              subtotal: { type: Type.NUMBER },
              taxAmount: { type: Type.NUMBER },
              grandTotal: { type: Type.NUMBER },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unitPrice: { type: Type.NUMBER },
                    totalAmount: { type: Type.NUMBER }
                  },
                  required: ['productName', 'quantity', 'unitPrice']
                }
              }
            },
            required: ['vendorName', 'grandTotal', 'items']
          }
        }
      });

      const extracted = JSON.parse(response.text || '{}');
      res.json({ success: true, data: extracted });
    } catch (error: any) {
      console.error('Error in /api/ai/parse-invoice:', error);
      res.status(500).json({ error: error.message || 'Failed to parse invoice OCR image.' });
    }
  });

  // 3. AI Smart Insights & Anomaly Detection Endpoint
  app.post('/api/ai/smart-insights', async (req, res) => {
    try {
      const { erpSummary } = req.body;
      const ai = getGeminiClient();

      const prompt = `Analyze this ERP business summary and generate 3 concise, actionable strategic insights, low stock warnings, and cash flow predictions:
ERP Metrics: ${JSON.stringify(erpSummary)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, description: 'warning, opportunity, or forecast' },
                    description: { type: Type.STRING },
                    actionableRecommendation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      const insights = JSON.parse(response.text || '{}');
      res.json({ success: true, data: insights });
    } catch (error: any) {
      console.error('Error in /api/ai/smart-insights:', error);
      res.status(500).json({ error: error.message || 'Failed to generate smart insights.' });
    }
  });

  // 4. AI WhatsApp & Email Message Composer Endpoint
  app.post('/api/ai/generate-communication', async (req, res) => {
    try {
      const { type, partyName, amount, dueDate, invoiceNo, language = 'English' } = req.body;
      const ai = getGeminiClient();

      const prompt = `Generate a polite, professional, and effective message in ${language} for ${type} (e.g. Payment Reminder or Invoice Share).
Party Name: ${partyName}
Invoice No: ${invoiceNo}
Amount Due: ${amount}
Due Date: ${dueDate}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      res.json({ success: true, message: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/generate-communication:', error);
      res.status(500).json({ error: error.message || 'Failed to generate communication text.' });
    }
  });

  // Attach Vite middleware for dev or serve static bundle in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
