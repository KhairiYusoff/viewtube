# Zod Practices

This project uses Zod v4 for validating external API responses before the data enters the app.

## Rules

- Keep validation at the boundary between external data and app logic.
- Never validate inside components.
- Use `safeParse()` and check the result before normalizing data.
- Return clean error messages from adapters and route handlers.
- Avoid `z.any()` and validate only the fields the app uses.

## Project conventions

- `src/lib/schemas/youtube.schema.ts` defines response shapes for YouTube.
- `src/lib/adapters/youtube.ts` calls YouTube, validates the raw response, then maps it to `Video`.
- `src/app/api/v1/*.ts` route handlers call adapter functions and return `NextResponse.json()`.

## Zod v4 notes

- Use top-level helpers like `z.string()`, `z.number()`, and `z.array()`.
- `z.record()` requires both key and value schemas.
- `z.optional()` wraps the schema, and `z.nullable()` is separate.
- Do not rely on deprecated `schema.errors`; use `parseResult.error.issues` if needed.
