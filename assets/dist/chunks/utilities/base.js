import { a as selectAll } from "../service/dom.js";
function removeCloak() {
  if (globalThis.document == null) {
    return;
  }
  selectAll("[uni-cloak]", (el) => el.removeAttribute("uni-cloak"));
}
export {
  removeCloak as r
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxpdGllcy9iYXNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNlbGVjdEFsbCB9IGZyb20gJy4uL3NlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsb2FrKCkge1xyXG4gIGlmIChnbG9iYWxUaGlzLmRvY3VtZW50ID09IG51bGwpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHNlbGVjdEFsbCgnW3VuaS1jbG9ha10nLCAoZWwpID0+IGVsLnJlbW92ZUF0dHJpYnV0ZSgndW5pLWNsb2FrJykpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRU8sU0FBUyxjQUFjO0FBQzVCLE1BQUksV0FBVyxZQUFZLE1BQU07QUFDL0I7QUFBQSxFQUNGO0FBRUEsWUFBVSxlQUFlLENBQUMsT0FBTyxHQUFHLGdCQUFnQixXQUFXLENBQUM7QUFDbEU7In0=
