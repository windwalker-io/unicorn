import { d as data } from "../data.js";
import { createApp } from "vue";
import { M as ModalTreeApp } from "../vue/components/ModalTree/ModalTreeApp.js";
import { u as useCssImport } from "../service/loader.js";
/* @__PURE__ */ useCssImport("@vue-animate");
const app = /* @__PURE__ */ createApp({
  name: "modal-tree",
  components: {
    ModalTreeApp
  }
});
app.config.globalProperties.$getData = data;
class ModalTreeElement extends HTMLElement {
  static is = "modal-tree";
  vm;
  connectedCallback() {
    if (!this.vm) {
      this.vm = app.mount(this);
    }
  }
}
/* @__PURE__ */ customElements.define(/* @__PURE__ */ (() => ModalTreeElement.is)(), ModalTreeElement);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbW9kYWwtdHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZS9maWVsZC1tb2RhbC10cmVlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRhdGEgfSBmcm9tICcuLi9kYXRhJztcclxuaW1wb3J0IHsgdXNlQ3NzSW1wb3J0IH0gZnJvbSAnLi4vc2VydmljZSc7XHJcbmltcG9ydCB7IGNyZWF0ZUFwcCB9IGZyb20gJ3Z1ZSc7XHJcbmltcG9ydCBNb2RhbFRyZWVBcHAgZnJvbSAnLi4vdnVlL2NvbXBvbmVudHMvTW9kYWxUcmVlL01vZGFsVHJlZUFwcC52dWUnO1xyXG51c2VDc3NJbXBvcnQoJ0B2dWUtYW5pbWF0ZScpO1xyXG5cclxuY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcclxuICBuYW1lOiAnbW9kYWwtdHJlZScsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgTW9kYWxUcmVlQXBwXHJcbiAgfVxyXG59KTtcclxuYXBwLmNvbmZpZy5nbG9iYWxQcm9wZXJ0aWVzLiRnZXREYXRhID0gZGF0YTtcclxuXHJcbmNsYXNzIE1vZGFsVHJlZUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgc3RhdGljIGlzID0gJ21vZGFsLXRyZWUnO1xyXG5cclxuICB2bTogYW55O1xyXG5cclxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgIGlmICghdGhpcy52bSkge1xyXG4gICAgICB0aGlzLnZtID0gYXBwLm1vdW50KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKE1vZGFsVHJlZUVsZW1lbnQuaXMsIE1vZGFsVHJlZUVsZW1lbnQpO1xyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLDZCQUFhLGNBQWM7QUFFM0IsTUFBTSxNQUFNLDBCQUFVO0FBQUEsRUFDcEIsTUFBTTtBQUFBLEVBQ04sWUFBWTtBQUFBLElBQ1Y7QUFBQSxFQUFBO0FBRUosQ0FBQztBQUNELElBQUksT0FBTyxpQkFBaUIsV0FBVztBQUV2QyxNQUFNLHlCQUF5QixZQUFZO0FBQUEsRUFDekMsT0FBTyxLQUFLO0FBQUEsRUFFWjtBQUFBLEVBRUEsb0JBQW9CO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLElBQUk7QUFDWixXQUFLLEtBQUssSUFBSSxNQUFNLElBQUk7QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLCtCQUFlLE9BQUEsdUJBQU8saUJBQWlCLElBQUEsR0FBSSxnQkFBZ0I7In0=
