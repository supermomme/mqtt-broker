<template>
  <span>
    <!-- NAVIGATION DRAWER / SIDEBAR -->
    <layout-sidebar />
    <!-- APP-BAR / HEADER -->
    <layout-header />

    <!-- CONTENT -->
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <slot />
      </v-container>
    </v-content>
    <!-- DIALOG -->
    <template v-if="dialogName != null">
      <component :is="dialog" />
    </template>
  </span>
</template>

<script>
import LayoutSidebar from '@/components/layout/LayoutSidebar'
import LayoutHeader from '@/components/layout/LayoutHeader'
import { mapState } from 'vuex'

const requireDialogComponents = require.context(
  '@/dialogs', false, /.\.vue/
)
const DialogComponents = requireDialogComponents.keys()
  .map(filename => requireDialogComponents(filename).default)

export default {
  name: 'DefaultLayout',
  components: {
    LayoutSidebar,
    LayoutHeader
  },
  computed: {
    ...mapState({
      'dialogName': 'dialog'
    }),
    dialog () {
      return DialogComponents.find(component => component.name === this.dialogName) || 'div'
    }
  }
}
</script>
