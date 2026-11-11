import { defineComponent, h, onBeforeUnmount, ref } from 'vue';

// Inline link editor shown in a bubble while the caret is inside a link: URL field, apply, open, remove.
export function createLinkBar(c: { UButton: any; UInput: any; USeparator: any }) {
  const { UButton, UInput, USeparator } = c;

  return defineComponent({
    props: { editor: { type: Object, required: true } },
    setup(props: any) {
      const url = ref('');
      const input = ref<any>();
      let wasInLink = false;

      const sync = () => {
        url.value = props.editor.getAttributes('link').href || '';
      };

      // When the caret enters a link, move focus into the URL field with the URL selected.
      const onTransaction = () => {
        const inLink = props.editor.isActive('link') && props.editor.state.selection.empty;

        if (inLink && !wasInLink && props.editor.view.hasFocus()) {
          sync();
          setTimeout(() => {
            const el: HTMLInputElement | undefined = input.value?.inputRef ?? input.value?.$el?.querySelector?.('input');

            el?.focus();
            el?.select();
          }, 50);
        }

        wasInLink = inLink;
      };

      props.editor.on('selectionUpdate', sync);
      props.editor.on('transaction', onTransaction);
      onBeforeUnmount(() => {
        props.editor.off('selectionUpdate', sync);
        props.editor.off('transaction', onTransaction);
      });
      sync();

      const apply = () => {
        if (url.value) {
          props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value }).run();
        }
      };

      const remove = () => {
        props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
      };

      const btn = (icon: string, title: string, onClick: () => void) => h(UButton, {
        icon, title, onClick, color: 'neutral', variant: 'ghost', size: 'sm',
      });

      return () => h(UInput, {
        ref: input,
        'data-link-bar': '',
        modelValue: url.value,
        'onUpdate:modelValue': (v: string) => (url.value = v),
        type: 'url',
        variant: 'none',
        placeholder: 'Paste a link...',
        onFocus: (e: FocusEvent) => (e.target as HTMLInputElement).select(),
        class: 'min-w-72',
        onKeydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            apply();
          } else if (e.key === 'Escape') {
            props.editor.commands.focus();
          }
        },
      }, {
        default: () => h('div', { class: 'flex items-center mr-0.5' }, [
          btn('i-lucide-corner-down-left', 'Apply link', apply),
          h(USeparator, { orientation: 'vertical', class: 'h-6 mx-1' }),
          btn('i-lucide-external-link', 'Open in new window', () => window.open(url.value, '_blank', 'noopener,noreferrer')),
          btn('i-lucide-trash', 'Remove link', remove),
        ]),
      });
    },
  });
}

// Link button + popover (port of the docs' EditorLinkPopover): set, open and remove a link on the selection.
export function createLinkPopover(c: { UButton: any; UPopover: any; UTooltip: any; UInput: any; USeparator: any }) {
  const { UButton, UPopover, UTooltip, UInput, USeparator } = c;

  return defineComponent({
    props: { editor: { type: Object, required: true } },
    setup(props: any) {
      const open = ref(false);
      const url = ref('');

      const syncUrl = () => {
        url.value = props.editor.getAttributes('link').href || '';
      };

      props.editor.on('selectionUpdate', syncUrl);
      onBeforeUnmount(() => props.editor.off('selectionUpdate', syncUrl));
      syncUrl();

      const setLink = () => {
        if (!url.value) {
          return;
        }

        const empty = props.editor.state.selection.empty;
        let chain = props.editor.chain().focus();

        if (props.editor.isActive('code') && !empty) {
          chain = chain.extendMarkRange('code').setLink({ href: url.value });
        } else {
          chain = chain.extendMarkRange('link').setLink({ href: url.value });

          if (empty) {
            chain = chain.insertContent({ type: 'text', text: url.value });
          }
        }

        chain.run();
        open.value = false;
      };

      const removeLink = () => {
        props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run();
        url.value = '';
        open.value = false;
      };

      const btn = (icon: string, title: string, onClick: () => void) => h(UButton, {
        icon, title, onClick, color: 'neutral', variant: 'ghost', size: 'sm',
        disabled: !url.value && !props.editor.isActive('link'),
      });

      return () => {
        const active = props.editor.isActive('link');
        const disabled = !props.editor.isEditable || (props.editor.state.selection.empty && !active);

        return h(UPopover, { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v), ui: { content: 'p-0.5' } }, {
          default: () => h(UTooltip, { text: 'Link' }, () => h(UButton, {
            icon: 'i-lucide-link', color: 'neutral', activeColor: 'primary', variant: 'ghost',
            activeVariant: 'soft', size: 'sm', active, disabled,
          })),
          content: () => h(UInput, {
            modelValue: url.value,
            'onUpdate:modelValue': (v: string) => (url.value = v),
            autofocus: true,
            type: 'url',
            variant: 'none',
            placeholder: 'Paste a link...',
        onFocus: (e: FocusEvent) => (e.target as HTMLInputElement).select(),
            onKeydown: (e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
            },
          }, {
            default: () => h('div', { class: 'flex items-center mr-0.5' }, [
              btn('i-lucide-corner-down-left', 'Apply link', setLink),
              h(USeparator, { orientation: 'vertical', class: 'h-6 mx-1' }),
              btn('i-lucide-external-link', 'Open in new window', () => window.open(url.value, '_blank', 'noopener,noreferrer')),
              btn('i-lucide-trash', 'Remove link', removeLink),
            ]),
          }),
        });
      };
    },
  });
}
