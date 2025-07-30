import { NextResponse } from 'next/server';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
export async function POST(req) {
  try {
    const { queryText } = await req.json();

    if (!queryText) {
      return NextResponse.json({ error: 'Query text is required' }, { status: 400 });
    }

    let sessionId = req.cookies.get('dialogflowSessionId')?.value;
    if (!sessionId) {
      sessionId = uuidv4();
      // Lưu sessionId vào cookie để dùng lại
      const response = NextResponse.json({}); // Response tạm
      response.cookies.set('dialogflowSessionId', sessionId, { maxAge: 24 * 60 * 60 }); // Hết hạn sau 24h
      return response; // Trả về để set cookie trước
    }

    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.DIALOGFLOW_PROJECT_ID || '',
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: queryText,
          languageCode: 'vi',
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    return NextResponse.json({
      fulfillmentMessages: result?.fulfillmentMessages,
      intent: result?.intent?.displayName,
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}