import { mapGetters } from "vuex";
import { getExportData } from "../store/boards/types";
import { modules } from "../store";

export default {
  methods: {
    downloadAppState() {
      const filename = "task-master.json";
      const content = JSON.stringify(this.getCurrentAppState, null, 2);
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  computed: {
    ...mapGetters(modules.boards, { getCurrentAppState: getExportData })
  }
};
