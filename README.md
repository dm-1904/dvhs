0. Prerequisites

| Tool / lib            | Version (or ↑)                 | Why you need it            |
| --------------------- | ------------------------------ | -------------------------- |
| **Node**              | 18 LTS                         | run scripts & dev server   |
| **npm / pnpm / yarn** | latest                         | dependency / script runner |
| **PostgreSQL**        | 14 +                           | local database             |
| **Prisma CLI**        | `npx prisma`                   | DB migrations / client gen |
| **ts-node**           | already in dev deps            | execute TypeScript scripts |
| **.env**              | `DATABASE_URL`, `VITE_API_URL` | connection strings         |

Database must be migrated at least once:

npx prisma migrate deploy # on prod

# – or –

npx prisma migrate dev --name init # on local dev
npm run prisma:generate # generates @prisma/client

1. Write the article body (JSX)
   Create a file in src/blog/posts

// src/blog/posts/coolNeighborhoodGuide.tsx
import React from 'react';

/_ pure JSX – no side-effects! _/
export const body = (
<>

<p>Craving walkable coffee shops, weekend farmers markets…?</p>
<h2>Why Cool-Town?</h2>
<p> • close to downtown<br /> • tree-lined streets…</p>
{/_ …continue writing… _/}
</>
);
Tip: Keep only markup here. No DB calls, no fetch, no window.

2. Convert JSX -> static HTML
   We already have a helper: src/utils/renderToHtml.ts

import { jsxToHtml } from '../../utils/renderToHtml';
import { body } from './coolNeighborhoodGuide';

const html = jsxToHtml(body); // <-- plain string, DB-ready

3. Draft meta-data
   Everything must match the Prisma model BlogPost:

const postData = {
title: 'The Ultimate Guide to Cool-Town AZ',
description: 'Schools, prices & insider tips for Cool-Town.',
author: 'Damon Ryon',
date: new Date('2025-06-01'), // JS Date, no time printed UI-side
coverImg: '/cool-town.jpg',
slug: '/blog/cool-town-guide', // UNIQUE!
tags: ['Cool-Town', 'Neighborhood'],
content: html // from step 2
};

4. One-shit publish script
   Create scripts/publishCoolTown.ts

import { PrismaClient } from '@prisma/client';
import { jsxToHtml } from '../src/utils/renderToHtml';
import { body } from '../src/blog/posts/coolNeighborhoodGuide';

const prisma = new PrismaClient();

(async () => {
try {
await prisma.blogPost.create({
data: {
...postData,
content: jsxToHtml(body)
}
});
console.log('✅ Post inserted!');
} catch (err: any) {
if (err.code === 'P2002') console.error('🚫 Duplicate slug.');
else console.error(err);
} finally {
await prisma.$disconnect();
}
})();

Run it:
npx ts-node ./scripts/publishCoolTown.ts

5. Display it on the front-end
   Blog posts are optimized for SEO and displayed in the Blog.
   High competition keywords, or cities I want to sell houses in
   are listed in Neighborhood guides on the home page and linked directly
   to the corresponding articles. Neighborhood guides are linked manually
   in App.tsx
