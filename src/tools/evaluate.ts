/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { z } from 'zod';
import { defineTool, type ToolFactory } from './tool.js';

const evaluate: ToolFactory = captureSnapshot => defineTool({
  capability: 'core',
  schema: {
    name: 'browser_evaluate',
    title: 'Run a JavaScript command',
    description: 'Execute a Javascript command in the browser',
    inputSchema: z.object({
      script: z.string().describe('The script to evaluate'),
    }),
    type: 'destructive',
  },
  handle: async (context, params) => {
    const tab = await context.ensureTab();
    await tab.page.evaluate(params.script);

    const code = [
      `// Execute a javascript command in the console`,
      `await page.evaluate('${params.script}');`
    ];

    return {
      code,
      captureSnapshot,
      waitForNetwork: true,
    };
  },
});

export default (captureSnapshot: boolean) => [
  evaluate(captureSnapshot),
];
