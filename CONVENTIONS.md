This app is using NextJS 15 (app router) with React 19, Typescript, Tailwindcss and shadcn/ui.
Prefer to use the same tech stack before suggesting new packages.

Cloudflare D1 is used as the database.

CURRENT DATABASE SCHEMA
```sql
CREATE TABLE entities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,  
    image_url TEXT,  
    controversy TEXT,
    sources TEXT,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Available environment variables are listed in `.env.example`