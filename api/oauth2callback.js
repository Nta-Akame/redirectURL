export default function handler(req, res) {
    const code = req.query.code;
    if (code) {
      res.status(200).send(`Authorization code received: ${code}`);
    } else {
      res.status(400).send('No authorization code found.');
    }
  }
  