function flattenChildren(children) {
  const flat = [];
  function loopChildren(children2) {
    for (const child of children2) {
      if (child.children.length === 0) {
        flat.push(child);
        continue;
      }
      loopChildren(child.children);
    }
  }
  loopChildren(children);
  return flat;
}
export {
  flattenChildren as f
};
