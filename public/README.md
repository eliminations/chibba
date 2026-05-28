# CHIBBA — Asset Folders

Drop meme / swarm assets into these folders and the site will blend them into
the atmosphere automatically (parallax depth, blur, cinematic lighting, hover
motion, floating animation):

- `/public/memes` — static meme images (jpg/png/webp)
- `/public/transparent` — transparent PNGs (best for floating entities)
- `/public/animated` — animated assets (gif/webp/mp4)
- `/public/swarm` — swarm overlay sprites

## Wiring them in

Edit `lib/memes.ts` and set the `src` field on a `MemeEntry`, e.g.

```ts
{ id: "m1", label: "GOON BEE", src: "/transparent/goon-bee.png", depth: 0.4 }
```

Entries **without** a `src` render a procedural holographic frame, so the
experience never shows broken images.
