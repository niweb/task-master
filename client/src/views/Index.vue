<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="6" sm="5" md="4" lg="3" xl="2" class="content">
        <v-btn color="primary" large @click="newBoard">
          Create new board
          <v-icon class="btn-icon">mdi-plus</v-icon>
        </v-btn>
        <div class="divider my-12">
          <v-divider></v-divider>
          <div class="divider__text px-4 text-overline">or</div>
        </div>
        <v-text-field
          outlined
          v-model="boardId"
          label="Open existing board"
          append-icon="mdi-send"
          @click:append="openBoard"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          New board created
        </v-card-title>
        <v-card-text>
          <p class="mt-4 mb-8">
            To access the board later on, please save the following identifier
            or bookmark the next page for direct access.
          </p>
          <v-text-field
            readonly
            outlined
            v-model="boardId"
            label="Board Identifier"
          >
            <v-tooltip slot="append" bottom v-model="clipboardTooltip">
              <template #activator="{ on, attrs }">
                <v-icon
                  dark
                  color="primary"
                  @click="copyToClipboard"
                  v-on="on"
                  v-bind="attrs"
                >
                  mdi-content-copy
                </v-icon>
              </template>
              <span v-if="copied">Copied</span>
              <span v-else>Copy</span>
            </v-tooltip>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="openBoard">
            Open board
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { modules } from "@/store";
import { create, load } from "@/store/boards/types";
import paths, { buildPath } from "../router/paths";

export default {
  name: "Timeline",
  components: {},
  data() {
    return {
      boardId: "",
      dialog: false,
      clipboardTooltip: false,
      copied: false
    };
  },
  methods: {
    ...mapActions(modules.boards, {
      create: create,
      load: load
    }),
    async newBoard() {
      this.boardId = await this.create();
      this.dialog = true;
    },
    async openBoard() {
      await this.$router.push(buildPath(paths.timeline, { id: this.boardId }));
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.boardId);
      this.clipboardTooltip = true;
      this.copied = true;
      setTimeout(() => {
        this.clipboardTooltip = false;
      }, 2000);
    }
  }
};
</script>

<style scoped lang="scss">
.divider {
  position: relative;
}

.divider__text {
  position: absolute;
  line-height: 14px;
  margin-top: -7px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
}

.content {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
}

.btn-icon {
  margin-left: auto;
}
</style>
