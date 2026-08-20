# FLOW.md: jimliu/baoyu-skills

> Routes all 22 skills from `JimLiu/baoyu-skills` so the right one fires at the right phase.

## Routing

**The rule (MANDATORY, not advisory):** when a trigger matches you INVOKE the named skill with the Skill tool BEFORE producing anything. Naming a skill without calling it is not invoking.

```
USER MESSAGE
  ├─ about to cut a new release or bump a version number?  → invoke baoyu-skills:release-skills   gate: a version file, changelog entry, and tag or release are created
  ├─ an article draft is ready and needs illustrations placed at key points?  → invoke baoyu-skills:baoyu-article-illustrator   gate: illustration image files exist at the identified positions in the article
  ├─ an educational topic needs to become a multi-panel comic?  → invoke baoyu-skills:baoyu-comic   gate: a sequence of comic panel images exists for the topic
  ├─ an image file is about to ship without its size being checked?  → invoke baoyu-skills:baoyu-compress-image   gate: the output image file is smaller than the original and in the target format
  ├─ an article is ready to publish but has no cover image yet?  → invoke baoyu-skills:baoyu-cover-image   gate: a cover image file exists at the chosen aspect ratio
  ├─ another step needs an image or text generation backend and no official provider key is configured?  → invoke baoyu-skills:baoyu-danger-gemini-web   gate: a response is returned from the reverse-engineered web endpoint
  ├─ the user gave a specific tweet or X article URL and agreed to the required consent for extraction?  → invoke baoyu-skills:baoyu-danger-x-to-markdown   gate: a markdown file with YAML front matter exists for that tweet or article
  ├─ a system, process, or concept is being explained and a visual would clarify the structure?  → invoke baoyu-skills:baoyu-diagram   gate: a dark themed SVG diagram file exists for the structure described
  ├─ the user wants to inspect the source code bundled inside an installed Electron application?  → invoke baoyu-skills:baoyu-electron-extract   gate: unpacked or restored source files exist on disk from the asar bundle
  ├─ the user has raw unformatted text or markdown that needs structure applied?  → invoke baoyu-skills:baoyu-format-markdown   gate: a formatted output file exists with headings, front matter, and lists applied
  ├─ the user wants an image generated from a text prompt through a configured official provider?  → invoke baoyu-skills:baoyu-image-gen   gate: an image file is produced by one of the configured provider APIs
  ├─ dense information needs to become a single publication ready visual summary?  → invoke baoyu-skills:baoyu-infographic   gate: an infographic image file exists combining the chosen layout and style
  ├─ a finished markdown article needs to become styled HTML for publishing?  → invoke baoyu-skills:baoyu-markdown-to-html   gate: a styled HTML file exists with the source markdown rendered inline
  ├─ finished content is ready to be published to a WeChat Official Account?  → invoke baoyu-skills:baoyu-post-to-wechat   gate: the post appears as a draft or is published on the account
  ├─ finished content is ready to be shared as a post or headline article on Weibo?  → invoke baoyu-skills:baoyu-post-to-weibo   gate: the post appears live or drafted on the Weibo account
  ├─ finished content is ready to be published as a post or long form article on X?  → invoke baoyu-skills:baoyu-post-to-x   gate: the post appears live or drafted on the X account
  ├─ content needs to become a sequence of presentation slide images?  → invoke baoyu-skills:baoyu-slide-deck   gate: an outline exists and an image file exists for each slide
  ├─ the user asked for text to be translated or localized into another language?  → invoke baoyu-skills:baoyu-translate   gate: a translated version of the text exists in the target language
  ├─ the user gave a web page URL that needs to become a markdown file?  → invoke baoyu-skills:baoyu-url-to-markdown   gate: a markdown file exists matching the fetched page content
  ├─ the user wants a digest of recent activity from a WeChat group chat?  → invoke baoyu-skills:baoyu-wechat-summary   gate: a digest entry is appended to that group history log
  ├─ content needs to become a numbered series of cartoon style social media image cards?  → invoke baoyu-skills:baoyu-xhs-images   gate: a numbered series of card images exists for the content
  ├─ the user provided a YouTube video and wants its transcript or subtitles?  → invoke baoyu-skills:baoyu-youtube-transcript   gate: a cached transcript file exists for that video
```

**Drift:** every route above targets `baoyu-skills:<slug>` in the separately-installed plugin. If a slug no longer resolves there, that route is a silent no-op. Never substitute a nearby-sounding skill: a broken route means this Flow needs an update, not that you may improvise.

## Attribution

Skills routed by this Flow come from **baoyu-skills** (https://github.com/JimLiu/baoyu-skills). This overlay bundles none of them; it installs the routing only.

Routing (this FLOW.md) by Flowy, CC-BY-SA-4.0.
