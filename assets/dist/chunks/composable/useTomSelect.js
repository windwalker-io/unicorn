import { w as wait } from "../service/helper.js";
import { u as useCssImport, a as useImport } from "../service/loader.js";
import { m as mergeDeep } from "../utilities/arr.js";
import { m as module } from "../service/dom.js";
async function useTomSelect(selector, options = {}, theme = "bootstrap5") {
  const [m] = await wait(
    useImport("@vendor/tom-select/dist/js/tom-select.complete.min.js"),
    useCssImport(`@vendor/tom-select/dist/css/tom-select.${theme}.min.css`)
  );
  if (selector) {
    module(
      selector,
      "tom.select",
      (ele) => {
        options = mergeDeep({
          allowEmptyOption: true,
          maxOptions: null,
          plugins: {
            caret_position: {},
            clear_button: {}
          }
        }, options);
        if (ele.multiple) {
          options.plugins.remove_button = {};
        } else {
          options.plugins.dropdown_input = {};
        }
        class UnicornTomSelect extends TomSelect {
          syncOptionsWithoutKeepSelected() {
            const oldValue = ele.value;
            this.clear();
            this.clearOptions();
            this.sync();
            if (ele.value !== oldValue) {
              this.setValue(
                ele.querySelector(`option[value="${oldValue}"]`)?.value ?? ele.querySelector("option")?.value ?? "",
                true
              );
            }
          }
        }
        const t = new UnicornTomSelect(ele, options);
        ele.addEventListener("list:updated", () => {
          t.syncOptionsWithoutKeepSelected();
        });
        return t;
      }
    );
  }
  return m;
}
export {
  useTomSelect as u
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlVG9tU2VsZWN0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9zYWJsZS91c2VUb21TZWxlY3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbW9kdWxlLCB1c2VDc3NJbXBvcnQsIHVzZUNzc0luY2x1ZGVzLCB1c2VJbXBvcnQsIHdhaXQgfSBmcm9tICcuLi9zZXJ2aWNlJztcclxuaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IHsgbWVyZ2VEZWVwIH0gZnJvbSAnLi4vdXRpbGl0aWVzJztcclxuXHJcbi8qKlxyXG4gKiBAc2VlIGh0dHBzOi8vdG9tLXNlbGVjdC5qcy5vcmcvXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlVG9tU2VsZWN0KFxyXG4gIHNlbGVjdG9yPzogTnVsbGFibGU8c3RyaW5nIHwgSFRNTEVsZW1lbnQgfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50Pj4sXHJcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9LFxyXG4gIHRoZW1lOiBzdHJpbmcgPSAnYm9vdHN0cmFwNSdcclxuKSB7XHJcbiAgY29uc3QgW21dID0gYXdhaXQgd2FpdChcclxuICAgIHVzZUltcG9ydCgnQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvanMvdG9tLXNlbGVjdC5jb21wbGV0ZS5taW4uanMnKSxcclxuICAgIHVzZUNzc0ltcG9ydChgQHZlbmRvci90b20tc2VsZWN0L2Rpc3QvY3NzL3RvbS1zZWxlY3QuJHt0aGVtZX0ubWluLmNzc2ApXHJcbiAgKTtcclxuXHJcbiAgaWYgKHNlbGVjdG9yKSB7XHJcbiAgICBtb2R1bGU8YW55LCBIVE1MU2VsZWN0RWxlbWVudD4oXHJcbiAgICAgIHNlbGVjdG9yLFxyXG4gICAgICAndG9tLnNlbGVjdCcsXHJcbiAgICAgIChlbGUpID0+IHtcclxuICAgICAgICBvcHRpb25zID0gbWVyZ2VEZWVwKHtcclxuICAgICAgICAgIGFsbG93RW1wdHlPcHRpb246IHRydWUsXHJcbiAgICAgICAgICBtYXhPcHRpb25zOiBudWxsLFxyXG4gICAgICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgICAgICBjYXJldF9wb3NpdGlvbjoge30sXHJcbiAgICAgICAgICAgIGNsZWFyX2J1dHRvbjoge30sXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmICgoZWxlIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLnJlbW92ZV9idXR0b24gPSB7fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3B0aW9ucy5wbHVnaW5zLmRyb3Bkb3duX2lucHV0ID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBdXRvIHNlbGVjdCBmaXJzdCBpZiBvcHRpb25zIGNoYW5nZWQuXHJcbiAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vb3JjaGlkanMvdG9tLXNlbGVjdC9pc3N1ZXMvMzYyXHJcbiAgICAgICAgY2xhc3MgVW5pY29yblRvbVNlbGVjdCBleHRlbmRzIFRvbVNlbGVjdCB7XHJcbiAgICAgICAgICBzeW5jT3B0aW9uc1dpdGhvdXRLZWVwU2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gZWxlLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyT3B0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnN5bmMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGUudmFsdWUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShcclxuICAgICAgICAgICAgICAgIGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pihgb3B0aW9uW3ZhbHVlPVwiJHtvbGRWYWx1ZX1cIl1gKT8udmFsdWVcclxuICAgICAgICAgICAgICAgID8/IGVsZS5xdWVyeVNlbGVjdG9yPEhUTUxPcHRpb25FbGVtZW50Pignb3B0aW9uJyk/LnZhbHVlXHJcbiAgICAgICAgICAgICAgICA/PyAnJyxcclxuICAgICAgICAgICAgICAgIHRydWVcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgY29uc3QgdCA9IG5ldyBVbmljb3JuVG9tU2VsZWN0KGVsZSBhcyBUb21JbnB1dCwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGVsZS5hZGRFdmVudExpc3RlbmVyKCdsaXN0OnVwZGF0ZWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICB0LnN5bmNPcHRpb25zV2l0aG91dEtlZXBTZWxlY3RlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBT0EsZUFBc0IsYUFDcEIsVUFDQSxVQUErQixDQUFBLEdBQy9CLFFBQWdCLGNBQ2hCO0FBQ0EsUUFBTSxDQUFDLENBQUMsSUFBSSxNQUFNO0FBQUEsSUFDaEIsVUFBVSx1REFBdUQ7QUFBQSxJQUNqRSxhQUFhLDBDQUEwQyxLQUFLLFVBQVU7QUFBQSxFQUFBO0FBR3hFLE1BQUksVUFBVTtBQUNaO0FBQUEsTUFDRTtBQUFBLE1BQ0E7QUFBQSxNQUNBLENBQUMsUUFBUTtBQUNQLGtCQUFVLFVBQVU7QUFBQSxVQUNsQixrQkFBa0I7QUFBQSxVQUNsQixZQUFZO0FBQUEsVUFDWixTQUFTO0FBQUEsWUFDUCxnQkFBZ0IsQ0FBQTtBQUFBLFlBQ2hCLGNBQWMsQ0FBQTtBQUFBLFVBQUM7QUFBQSxRQUNqQixHQUNDLE9BQU87QUFFVixZQUFLLElBQTBCLFVBQVU7QUFDdkMsa0JBQVEsUUFBUSxnQkFBZ0IsQ0FBQTtBQUFBLFFBQ2xDLE9BQU87QUFDTCxrQkFBUSxRQUFRLGlCQUFpQixDQUFBO0FBQUEsUUFDbkM7QUFBQSxRQUlBLE1BQU0seUJBQXlCLFVBQVU7QUFBQSxVQUN2QyxpQ0FBaUM7QUFDL0Isa0JBQU0sV0FBVyxJQUFJO0FBRXJCLGlCQUFLLE1BQUE7QUFDTCxpQkFBSyxhQUFBO0FBQ0wsaUJBQUssS0FBQTtBQUVMLGdCQUFJLElBQUksVUFBVSxVQUFVO0FBQzFCLG1CQUFLO0FBQUEsZ0JBQ0gsSUFBSSxjQUFpQyxpQkFBaUIsUUFBUSxJQUFJLEdBQUcsU0FDbEUsSUFBSSxjQUFpQyxRQUFRLEdBQUcsU0FDaEQ7QUFBQSxnQkFDSDtBQUFBLGNBQUE7QUFBQSxZQUVKO0FBQUEsVUFDRjtBQUFBLFFBQUE7QUFJRixjQUFNLElBQUksSUFBSSxpQkFBaUIsS0FBaUIsT0FBTztBQUV2RCxZQUFJLGlCQUFpQixnQkFBZ0IsTUFBTTtBQUN6QyxZQUFFLCtCQUFBO0FBQUEsUUFDSixDQUFDO0FBRUQsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUFBO0FBQUEsRUFFSjtBQUVBLFNBQU87QUFDVDsifQ==
