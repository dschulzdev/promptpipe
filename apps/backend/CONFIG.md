# Configuration with Zod Validation

This project uses Zod for runtime configuration validation, ensuring that your environment variables are properly typed and validated before the application starts.

## Setup

The configuration is automatically loaded and validated when the application starts. If validation fails, the application will exit with an error message.

## Configuration Schema

The configuration is defined using Zod schema in `src/config/configuration.ts`:

```typescript
const configSchema = z.object({
  nodeEnv: z.enum(['development', 'staging', 'production']).default('development'),
  port: z.coerce.number().int().positive().default(3000),
  database: z.object({
    host: z.string().min(1).default('localhost'),
    port: z.coerce.number().int().positive().default(5432),
    username: z.string().min(1).default('postgres'),
    password: z.string().min(1).default('password'),
    database: z.string().min(1).default('promptpipe'),
  }),
  redis_url: z.string.min(1),
  ai: z.object({
    openai: z.object({
      apiKey: z.string().min(1).optional(),
    }),
    google: z.object({
      apiKey: z.string().min(1).optional(),
    }),
  }),
  jwt: z.object({
    secret: z.string().min(1).default('your-secret-key'),
    expiresIn: z.string().default('1d'),
  }),
});
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `NODE_ENV` - Environment (development, staging, production)
- `PORT` - Application port (default: 3000)
- `DATABASE_*` - Database connection settings
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `GOOGLE_API_KEY` - Google AI API key (optional)
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time

## Usage in Services

### Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Configuration } from '../config/configuration';

@Injectable()
export class MyService {
  constructor(private readonly configService: ConfigService<Configuration>) {}

  someMethod() {
    // Get with full type safety
    const apiKey = this.configService.get('ai.openai.apiKey', { infer: true });
    const port = this.configService.get('port', { infer: true });
    const dbConfig = this.configService.get('database', { infer: true });
    
    // Check environment
    const isDev = this.configService.get('nodeEnv', { infer: true }) === 'development';
  }
}
```

### Using ConfigHelperService

For convenience, you can also use the `ConfigHelperService` which provides typed methods:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigHelperService } from '../config/config-helper.service';

@Injectable()
export class MyService {
  constructor(private readonly configHelper: ConfigHelperService) {}

  someMethod() {
    const apiKey = this.configHelper.getOpenAIApiKey();
    const port = this.configHelper.getPort();
    const isDev = this.configHelper.isDevelopment();
    const dbConfig = this.configHelper.getDatabaseConfig();
  }
}
```

## Validation

The configuration is validated at application startup. If any required values are missing or invalid, the application will fail to start with a detailed error message.

### Validation Features

- **Type coercion**: String environment variables are automatically converted to numbers where needed
- **Required fields**: Fields without defaults must be present
- **Default values**: Most fields have sensible defaults
- **Enum validation**: NODE_ENV is validated against allowed values
- **String validation**: Minimum length validation for secrets and keys

## Benefits

1. **Type Safety**: Full TypeScript support with inferred types
2. **Runtime Validation**: Catches configuration errors at startup
3. **Default Values**: Sensible defaults for development
4. **Environment Specific**: Different validation rules for different environments
5. **IDE Support**: Autocomplete and type checking in your IDE

## Error Handling

If configuration validation fails, you'll see detailed error messages like:

```
Configuration validation failed: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["ai", "openai", "apiKey"],
    "message": "Required"
  }
]
```

This helps you quickly identify and fix configuration issues.
