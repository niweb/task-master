<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="6" sm="5" md="4" lg="3" xl="2" class="content">
        <v-btn color="primary" large @click="create">
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
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { modules } from "@/store";
import { create, load } from "@/store/boards/types";

export default {
  name: "Timeline",
  components: {},
  data() {
    return {
      boardId: ""
    };
  },
  methods: {
    ...mapActions(modules.boards, {
      create: create,
      load: load
    }),
    openBoard() {
      this.load(this.boardId);
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
