// /api/getToken.js

import fetch from 'node-fetch';

const CLIENT_ID = '272575839441-7uaamnov4v017dildbtde4niqfeia6tn.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://your-vercel-project.vercel.app/api/oauth2callback';

export default async function handler(req, res) {
  const { code, refreshToken } = req.query;

  try {
    let data;
    if (code) {
      // 認証コードからアクセストークンとリフレッシュトークンを取得
      data = new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });
    } else if (refreshToken) {
      // リフレッシュトークンから新しいアクセストークンを取得
      data = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
      });
    } else {
      return res.status(400).json({ error: 'Code or refreshToken required' });
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
    });

    const tokenData = await response.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error });
    }

    // アクセストークンとリフレッシュトークンを返す
    res.status(200).json(tokenData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
