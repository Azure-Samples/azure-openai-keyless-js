import process from 'node:process';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import { AzureOpenAI } from 'openai';
import 'dotenv/config';

if (!process.env.AZURE_OPENAI_ENDPOINT) {
  throw new Error('Azure OpenAI env variables not set. See README for details.');
}

// Use the current user identity to authenticate.
// No secrets needed, it uses `az login` or `azd auth login` locally,
// and managed identity when deployed on Azure.
const credentials = new DefaultAzureCredential();
const azureOpenAiScope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credentials, azureOpenAiScope);

const openai = new AzureOpenAI({ azureADTokenProvider });

const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: `You provide very brief and straight to the point answers with emojis.` },
    { role: 'user', content: `What's the meaning of life?` },
  ],
  temperature: 0.7,
  model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
});

console.log('Response:');
console.log(response.choices[0].message.content);
