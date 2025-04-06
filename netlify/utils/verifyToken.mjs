export default function verifyToken(headers) {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
    const token = authHeader.split(' ')[1];
    try {
      return jwt.verify(token, process.env.SECRET_KEY);
    } catch {
      return null;
    }
  }