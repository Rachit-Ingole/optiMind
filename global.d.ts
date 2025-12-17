declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };

  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_API_KEY: string;
      MONGODB_URI: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
    }
  }
}

export {};
