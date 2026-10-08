# Obsidian — interactive 3D site

A responsive single-page GLB viewer built with Google's `<model-viewer>` web component. The GLB sits beside `index.html`, so the site works from a project subpath such as GitHub Pages.

## Preview locally

Serve this folder over HTTP, then open the local address in a browser. For example, from this folder run `python -m http.server 8000` and visit `http://localhost:8000`.

## GitHub Pages

The included workflow deploys the site to GitHub Pages whenever code is pushed to the `main` branch, and also supports manual runs from the Actions tab. In the target repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

The page loads `<model-viewer>` 4.3.1 from Google's hosted library. The site files and model are served by GitHub Pages; the library is loaded from its CDN.
