# 🐦 Bird Song Quiz

A browser-based quiz game for identifying 133 common Danish birds by their songs, using sounds from [xeno-canto.org](https://xeno-canto.org).

## Setup

Requires a [xeno-canto API key](https://xeno-canto.org/article/153).

```sh
echo "KEY=your_api_key_here" > .env
npm install
npm run dev
```

## Docker

```sh
docker build -t birdid .
docker run -e KEY=your_api_key_here -p 5173:5173 birdid
```

Then open [http://localhost:5173](http://localhost:5173).

## Environment variable

| Variable | Description |
|----------|-------------|
| `KEY` | xeno-canto API v3 key (required) |

The key is injected server-side by the Vite proxy plugin and never exposed to the browser.
