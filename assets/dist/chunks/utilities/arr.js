function isPlainObject(val) {
  return val && typeof val === "object" && !Array.isArray(val);
}
function mergeDeep(target, ...sources) {
  let out = isPlainObject(target) ? { ...target } : target;
  for (const source of sources) {
    if (Array.isArray(source)) {
      out = Array.isArray(out) ? out.concat(source) : source;
      continue;
    }
    if (isPlainObject(source)) {
      out = { ...isPlainObject(out) ? out : {} };
      for (const key of Object.keys(source)) {
        out[key] = key in out ? mergeDeep(out[key], source[key]) : source[key];
      }
      continue;
    }
    out = source;
  }
  return out;
}
export {
  mergeDeep as m
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbGl0aWVzL2Fyci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbDogYW55KTogdmFsIGlzIFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICByZXR1cm4gdmFsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVlcDxUID0gUmVjb3JkPHN0cmluZywgYW55Pj4odGFyZ2V0OiBQYXJ0aWFsPFQ+LCAuLi5zb3VyY2VzOiBhbnlbXSk6IFQge1xuICBsZXQgb3V0OiBhbnkgPSBpc1BsYWluT2JqZWN0KHRhcmdldCkgPyB7IC4uLnRhcmdldCB9IDogdGFyZ2V0O1xuXG4gIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZXMpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICBvdXQgPSAoQXJyYXkuaXNBcnJheShvdXQpID8gb3V0LmNvbmNhdChzb3VyY2UpIDogc291cmNlKSBhcyBUO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChpc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIG91dCA9IHsgLi4uKGlzUGxhaW5PYmplY3Qob3V0KSA/IG91dCA6IHt9KSB9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc291cmNlKSkge1xuICAgICAgICBvdXRba2V5XSA9XG4gICAgICAgICAga2V5IGluIG91dCA/IG1lcmdlRGVlcChvdXRba2V5XSwgc291cmNlW2tleV0pIDogc291cmNlW2tleV07XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgb3V0ID0gc291cmNlIGFzIFQ7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDTyxTQUFTLGNBQWMsS0FBc0M7QUFDbEUsU0FBTyxPQUFPLE9BQU8sUUFBUSxZQUFZLENBQUMsTUFBTSxRQUFRLEdBQUc7QUFDN0Q7QUFFTyxTQUFTLFVBQW1DLFdBQXVCLFNBQW1CO0FBQzNGLE1BQUksTUFBVyxjQUFjLE1BQU0sSUFBSSxFQUFFLEdBQUcsV0FBVztBQUV2RCxhQUFXLFVBQVUsU0FBUztBQUM1QixRQUFJLE1BQU0sUUFBUSxNQUFNLEdBQUc7QUFDekIsWUFBTyxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksT0FBTyxNQUFNLElBQUk7QUFDakQ7QUFBQSxJQUNGO0FBQ0EsUUFBSSxjQUFjLE1BQU0sR0FBRztBQUN6QixZQUFNLEVBQUUsR0FBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUEsRUFBQztBQUN4QyxpQkFBVyxPQUFPLE9BQU8sS0FBSyxNQUFNLEdBQUc7QUFDckMsWUFBSSxHQUFHLElBQ0wsT0FBTyxNQUFNLFVBQVUsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUc7QUFBQSxNQUM5RDtBQUNBO0FBQUEsSUFDRjtBQUNBLFVBQU07QUFBQSxFQUNSO0FBQ0EsU0FBTztBQUNUOyJ9
