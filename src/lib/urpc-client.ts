import { URPC } from "@unilab/urpc";

// Initialize URPC client for frontend
URPC.init({
  baseUrl: typeof window !== 'undefined' ? window.location.origin + '/api' : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { URPC };
