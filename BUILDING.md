# Build instructions for EMS-ESP Documentation

Built on [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Editing Articles

Edit only files in `/docs` folder.

Use strict markdown syntax. See [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for a quick reference.

### Markdown Enhancements

#### Admonitions

Docusaurus supports admonitions using the `:::` syntax:

```markdown
:::info
This is an info box
:::

:::tip
This is a tip
:::

:::warning
This is a warning
:::

:::danger
This is a danger alert
:::

:::note
This is a note
:::
```

#### Definition Lists

Standard markdown definition lists are supported:

```markdown
Term 1
: Definition 1

Term 2
: Definition 2
```

#### Code Blocks

Use standard markdown code fences with optional language specification:

````markdown
```javascript
const example = 'code'
```
````

## Installing

### Prerequisites

- Node.js 22+ and pnpm

### Setup

1. Install dependencies:

```bash
pnpm install
```

## Development

### Testing locally

```bash
pnpm fast
```

You can also use `pnpn start` but it will build slower.

This starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

Visit [http://localhost:3000](http://localhost:3000)

## Building

To create a production build:

```bash
pnpm build
```

This generates static content into the `build` directory for all languages and can be served using any static contents hosting service.

### Serving production build

To test the production build locally:

```bash
pnpm serve
```

### Production

Fix spellings:

```sh
npx cspell "**"
```

After checking in your changes, Cloudflare Pages will automatically build and deploy the changes to [https://emsesp.org](https://emsesp.org).

## Translations

We now have automated translation scripts that use AI (DeepL) to translate.

Add a secret key to your local environment called `DEEPL_API_KEY` with the value of your DeepL API key. You can get one from [DeepL](https://www.deepl.com/pro-api).

```bash
export DEEPL_API_KEY=your-deepl-api-key
```

### Translate All Files

```sh
# Test with one file first (dry run)
pnpm translate -- --force --file About.md --dry-run

# If it looks good, translate for real
pnpm translate -- --force --file About.md

# Translate all documentation files
pnpm translate

# Translate UI elements
pnpm translate-ui

# Test your translations
pnpm start --locale de   # German
pnpm start --locale nl   # Dutch
```

### Translate to One Language Only

```bash
# German only
node scripts/translate.js --locale de

# Dutch only
node scripts/translate.js --locale nl
```

### Preview Without Saving (Dry Run)

```bash
node scripts/translate.js --dry-run
```

### Force Overwrite Existing Translations

```bash
node scripts/translate.js --force
```

### 🎨 Translate UI Elements

Translate navbar, footer, and sidebar labels:

```bash
# Translate all UI elements
node scripts/translate-ui.js

# Specific locale
node scripts/translate-ui.js --locale de
```

```bash
# Testing - it won't work with pnpm start or pnpm fast
pnpm build && pnpm serve
```

### 📊 What Gets Translated

#### Documentation Files (translate.js)

- ✅ All markdown content
- ✅ Headers and paragraphs
- ✅ Lists and tables
- ❌ Code blocks (preserved as-is)
- ❌ URLs and links (preserved as-is)
- ❌ Frontmatter (preserved as-is)
- ❌ Technical terms (preserved: EMS-ESP, MQTT, etc.)

#### UI Elements (translate-ui.js)

- ✅ Navbar labels (Home, Devices, etc.)
- ✅ Footer text
- ✅ Sidebar labels
- ✅ Button labels

## Searching

### Algolia

Algolia is used for searching the documentation.

### Algolia Configuration

The Algolia configuration is in the `docusaurus.config.js` file.

### Algolia API Key

The Algolia API key is in the `ALGOLIA_API_KEY` environment variable. You can get one from [Algolia](https://www.algolia.com/).

The search is updated automatically every week on a Sunday.