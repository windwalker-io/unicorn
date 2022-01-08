<template>
  <div class="c-tree-item"
    :class="[ isBranch ? 'c-tree-item--branch' : 'c-tree-item--leaf' ]">
    <div class="d-flex c-tree-item__title"
      :style="{ 'padding-left': indentPx + 'px' }"
      :class="[ isBranch ? 'bg-light ' : '' ]">
      <div class="p-2 ms-2">
        <input
          :type="multiple ? 'checkbox' : 'radio'"
          class="form-check-input"
          v-if="isLeaf || (branchSelectable && multiple)"
          :id="id + '__item-' + item.value.id"
          v-model="selected"
          :value="true"
          :unchecked-value="false"
          :indeterminate.sync="indeterminate"
          @change="checkboxChanged($event.target.checked)"
        />
        <input v-else
          :type="multiple ? 'checkbox' : 'radio'"
          class="form-check-input"
          disabled
          :checked="indeterminate" :indeterminate.sync="indeterminate" />
      </div>
      <a class="c-tree-item__text d-flex align-items-center flex-grow-1 py-2 text-decoration-none"
        :data-level="level"
        data-bs-toggle="collapse"
        @click.prevent="isLeaf ? check(!selected) : open = !open">
        <span class="me-2 fa" :class="[ isLeaf ? 'fa-tag' : 'fa-folder' ]"></span>

        {{ item.value.title }}

        <span v-if="isBranch" class="ms-auto me-3">
          <span :class="[ open ? 'fa fa-chevron-up' : 'fa fa-chevron-down' ]"></span>
        </span>
      </a>
    </div>

    <slide-up-down
      v-if="item.children.length > 0"
      v-model="open"
      :duration="300"
      class="c-tree-item__children"
    >
      <tree-item v-for="(child, i) of item.children"
        :item="child"
        :key="child.value.id"
        :level="level + 1"
        :actives="actives"
        :branch-selectable="branchSelectable"
        :ref="setChildren"
        @change="childChanged"
      />
    </slide-up-down>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onBeforeUpdate, onMounted, ref, toRefs, watch, inject } from 'vue';
import SlideUpDown from 'vue3-slide-up-down'

export default defineComponent({
  name: 'tree-item',
  model: {
    prop: 'value',
    event: 'input'
  },
  components: {
    SlideUpDown
  },
  props: {
    item: Object,
    level: {
      type: Number,
      default: 1,
    },
    actives: Array,
    branchSelectable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const root = inject('root');
    const id = inject('id');
    const multiple = inject('multiple');

    const { item, level, actives, branchSelectable } = toRefs(props);
    const selected = ref(false);
    const indeterminate = ref(false);
    const stopWatch = ref(false);
    const open = ref(false);
    const children = ref([]);

    function setChildren(child) {
      children.value.push(child);
    }

    onBeforeUpdate(() => {
      children.value = [];
    });

    const indentPx = computed(() => {
      return (level.value - 1) * 15;
    });

    const isBranch = computed(() => {
      return item.value.children.length > 0;
    });

    const isLeaf = computed(() => {
      return !isBranch.value;
    });

    function updateChecked() {
      if (isBranch.value) {
        return;
      }
      selected.value = actives.value.indexOf(item.value.value.id) !== -1;
    };

    function check(check) {
      if (selected.value === check) {
        return;
      }

      selected.value = check;

      checkboxChanged(check);
    };

    function checkboxChanged(v) {
      if (isBranch.value) {
        if (multiple) {
          stopWatchThen(() => {
            children.value.forEach((child) => {
              child.check(v);
            });
          });

          syncChildrenStatus();
        }
      } else {
        nextTick(() => {
          root.checkItem(item.value, v);
        });
      }
      ctx.emit('change', v);
      ctx.emit('input', v);
    };

    function childChanged(v) {
      if (isLeaf.value || stopWatch.value) {
        return;
      }

      if (!children.value) {
        return;
      }

      if (children.value.length === 0) {
        return;
      }

      syncChildrenStatus();
    };

    function syncChildrenStatus() {
      if (isLeaf.value) {
        return;
      }

      let checked = 0;
      let unchecked = 0;
      let indeterminateInner = 0;
      const oldIndeterminate = indeterminate.value;
      const oldSelected = selected.value;

      children.value.forEach((child) => {
        if (child.selected) {
          checked++;
        } else {
          unchecked++;
        }
        if (child.indeterminate) {
          indeterminateInner++;
        }
      });

      if ((checked !== 0 && unchecked !== 0) || indeterminateInner > 0) {
        indeterminate.value = true;
      } else {
        selected.value = unchecked === 0;
        indeterminate.value = false;
      }

      if (
        selected.value !== oldSelected ||
        indeterminate.value !== oldIndeterminate
      ) {
        ctx.emit('change', selected.value);
        ctx.emit('input', selected.value);
      }
    };

    function stopWatchThen(callback) {
      stopWatch.value = true;
      callback();
      stopWatch.value = false;
    };

    watch(actives, async () => {
      if (!isBranch.value) {
        updateChecked();
      }
      await nextTick();
      syncChildrenStatus();
    });

    watch(selected, (v) => {});

    updateChecked();

    onMounted(() => {
      syncChildrenStatus();
    });

    return {
      multiple,
      id,
      root,
      selected,
      indeterminate,
      stopWatch,
      open,
      indentPx,
      isBranch,
      isLeaf,
      children,

      setChildren,
      updateChecked,
      check,
      checkboxChanged,
      childChanged,
      syncChildrenStatus,
      stopWatchThen,
    };
  },
});
</script>

<style scoped lang="scss">
.c-tree-item {
  &__title {
    border-bottom: 1px solid #ddd;
  }

  cursor: pointer;
}
</style>
