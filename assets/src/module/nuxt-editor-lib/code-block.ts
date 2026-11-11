import { trans } from '../../service/lang';
import type { NuxtEditorOptions } from './types';

const DEFAULT_LANGUAGES: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  php: 'PHP',
  sql: 'SQL',
  bash: 'Bash',
  python: 'Python',
  xml: 'XML',
  yaml: 'YAML',
  markdown: 'Markdown',
};

const DEFAULT_ALIASES: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', ts: 'typescript', tsx: 'typescript',
  md: 'markdown', yml: 'yaml', sh: 'bash', shell: 'bash', zsh: 'bash', py: 'python',
  htm: 'html', text: '', plain: '', plaintext: '',
};

// CodeBlock with a language <select>. The language is stored as `class="language-xxx"` on <code>.
export function createCodeBlock(CodeBlock: any, opts: NuxtEditorOptions) {
  const languages = opts.codeBlockLanguages && Object.keys(opts.codeBlockLanguages).length
    ? opts.codeBlockLanguages
    : DEFAULT_LANGUAGES;
  const ALIASES = opts.codeBlockAliases && Object.keys(opts.codeBlockAliases).length
    ? opts.codeBlockAliases
    : DEFAULT_ALIASES;

  return CodeBlock.extend({
    addNodeView() {
      return ({ node, editor, getPos }: any) => {
        let current = node;

        const dom = document.createElement('div');
        dom.className = 'nuxt-code-block';

        const select = document.createElement('select');
        select.setAttribute('contenteditable', 'false');

        const sync = () => {
          select.innerHTML = '';
          select.add(new Option(trans('unicorn.nuxt.editor.text.plain.text'), ''));

          for (const [value, label] of Object.entries(languages)) {
            select.add(new Option(label, value));
          }

          const raw = current.attrs.language || '';
          const lang = raw in languages ? raw : (ALIASES[raw] ?? raw);

          if (lang && !(lang in languages)) {
            select.add(new Option(lang, lang));
          }

          select.value = lang;
        };

        select.addEventListener('change', () => {
          const pos = getPos();

          if (typeof pos === 'number') {
            editor.view.dispatch(
              editor.state.tr.setNodeMarkup(pos, undefined, { ...current.attrs, language: select.value || null }),
            );
          }
        });
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.append(code);
        dom.append(select, pre);
        sync();

        // Show the select while the cursor is inside this block.
        const markActive = () => {
          const pos = getPos();
          const { from, to } = editor.state.selection;

          dom.classList.toggle('is-active', typeof pos === 'number' && from >= pos && to <= pos + current.nodeSize);
        };

        editor.on('selectionUpdate', markActive);
        editor.on('focus', markActive);
        editor.on('blur', () => dom.classList.remove('is-active'));
        markActive();

        return {
          dom,
          contentDOM: code,
          destroy() {
            editor.off('selectionUpdate', markActive);
            editor.off('focus', markActive);
          },
          update(updated: any) {
            if (updated.type !== current.type) {
              return false;
            }

            current = updated;
            sync();

            return true;
          },
          stopEvent: (e: Event) => e.target === select,
          ignoreMutation: (m: any) => !code.contains(m.target),
        };
      };
    },
  });
}
