import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: `Extract key concepts and relationships from this text as a JSON graph. Return only valid JSON with this exact structure: {"nodes": [{"id": "string", "label": "string"}], "edges": [{"source": "string", "target": "string", "label": "string"}]}. Text: ${text}`
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process with DeepSeek API');
    }

    const data = await response.json();
    const conceptMap = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(conceptMap),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
});