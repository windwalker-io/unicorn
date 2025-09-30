import { s as selectOne } from "./dom.js";
function animateTo(element, styles, options = {}) {
  element = selectOne(element);
  const currentStyles = window.getComputedStyle(element);
  const transitions = {};
  for (const name in styles) {
    const value = styles[name];
    transitions[name] = Array.isArray(value) ? value : [
      currentStyles.getPropertyValue(name),
      value
    ];
  }
  if (typeof options === "number") {
    options = { duration: options };
  }
  options = Object.assign(
    {
      duration: 400,
      easing: "linear",
      fill: "both"
    },
    options
  );
  const animation = element.animate(
    transitions,
    options
  );
  animation.addEventListener("finish", () => {
    for (const name in styles) {
      const value = styles[name];
      element.style.setProperty(
        name,
        Array.isArray(value) ? value[value.length - 1] : value
      );
    }
    animation.cancel();
  });
  return animation;
}
export {
  animateTo as a
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2UvYW5pbWF0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZWxlY3RPbmUgfSBmcm9tICcuL2RvbSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0ZVRvKFxyXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxyXG4gIHN0eWxlczogUGFydGlhbDxSZWNvcmQ8a2V5b2YgQ1NTU3R5bGVEZWNsYXJhdGlvbiwgYW55Pj4sXHJcbiAgb3B0aW9uczogbnVtYmVyIHwgS2V5ZnJhbWVBbmltYXRpb25PcHRpb25zID0ge31cclxuKTogQW5pbWF0aW9uIHtcclxuICBlbGVtZW50ID0gc2VsZWN0T25lKGVsZW1lbnQpO1xyXG5cclxuICBjb25zdCBjdXJyZW50U3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XHJcbiAgY29uc3QgdHJhbnNpdGlvbnM6IFJlY29yZDxzdHJpbmcsIGFueVtdPiA9IHt9O1xyXG5cclxuICBmb3IgKGNvbnN0IG5hbWUgaW4gc3R5bGVzKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHN0eWxlc1tuYW1lXTtcclxuXHJcbiAgICB0cmFuc2l0aW9uc1tuYW1lXSA9IEFycmF5LmlzQXJyYXkodmFsdWUpXHJcbiAgICAgID8gdmFsdWVcclxuICAgICAgOiBbXHJcbiAgICAgICAgY3VycmVudFN0eWxlcy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLFxyXG4gICAgICAgIHZhbHVlXHJcbiAgICAgIF07XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdudW1iZXInKSB7XHJcbiAgICBvcHRpb25zID0geyBkdXJhdGlvbjogb3B0aW9ucyB9O1xyXG4gIH1cclxuXHJcbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXHJcbiAgICB7XHJcbiAgICAgIGR1cmF0aW9uOiA0MDAsXHJcbiAgICAgIGVhc2luZzogJ2xpbmVhcicsXHJcbiAgICAgIGZpbGw6ICdib3RoJ1xyXG4gICAgfSxcclxuICAgIG9wdGlvbnNcclxuICApO1xyXG5cclxuICBjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoXHJcbiAgICB0cmFuc2l0aW9ucyxcclxuICAgIG9wdGlvbnNcclxuICApO1xyXG5cclxuICBhbmltYXRpb24uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgKCkgPT4ge1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHN0eWxlcykge1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IHN0eWxlc1tuYW1lXTtcclxuXHJcbiAgICAgIGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBBcnJheS5pc0FycmF5KHZhbHVlKVxyXG4gICAgICAgICAgPyB2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXVxyXG4gICAgICAgICAgOiB2YWx1ZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGFuaW1hdGlvbi5jYW5jZWwoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGFuaW1hdGlvbjtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVPLFNBQVMsVUFDZCxTQUNBLFFBQ0EsVUFBNkMsQ0FBQSxHQUNsQztBQUNYLFlBQVUsVUFBVSxPQUFPO0FBRTNCLFFBQU0sZ0JBQWdCLE9BQU8saUJBQWlCLE9BQU87QUFDckQsUUFBTSxjQUFxQyxDQUFBO0FBRTNDLGFBQVcsUUFBUSxRQUFRO0FBQ3pCLFVBQU0sUUFBUSxPQUFPLElBQUk7QUFFekIsZ0JBQVksSUFBSSxJQUFJLE1BQU0sUUFBUSxLQUFLLElBQ25DLFFBQ0E7QUFBQSxNQUNBLGNBQWMsaUJBQWlCLElBQUk7QUFBQSxNQUNuQztBQUFBLElBQUE7QUFBQSxFQUVOO0FBRUEsTUFBSSxPQUFPLFlBQVksVUFBVTtBQUMvQixjQUFVLEVBQUUsVUFBVSxRQUFBO0FBQUEsRUFDeEI7QUFFQSxZQUFVLE9BQU87QUFBQSxJQUNmO0FBQUEsTUFDRSxVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsTUFDUixNQUFNO0FBQUEsSUFBQTtBQUFBLElBRVI7QUFBQSxFQUFBO0FBR0YsUUFBTSxZQUFZLFFBQVE7QUFBQSxJQUN4QjtBQUFBLElBQ0E7QUFBQSxFQUFBO0FBR0YsWUFBVSxpQkFBaUIsVUFBVSxNQUFNO0FBQ3pDLGVBQVcsUUFBUSxRQUFRO0FBQ3pCLFlBQU0sUUFBUSxPQUFPLElBQUk7QUFFekIsY0FBUSxNQUFNO0FBQUEsUUFDWjtBQUFBLFFBQ0EsTUFBTSxRQUFRLEtBQUssSUFDZixNQUFNLE1BQU0sU0FBUyxDQUFDLElBQ3RCO0FBQUEsTUFBQTtBQUFBLElBRVI7QUFFQSxjQUFVLE9BQUE7QUFBQSxFQUNaLENBQUM7QUFFRCxTQUFPO0FBQ1Q7In0=
