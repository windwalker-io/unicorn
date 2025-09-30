import { i as isDebug } from "../service/helper.js";
const imports = {};
class LegacyLoader {
  constructor(app) {
    this.app = app;
  }
  static install(app) {
    const loader = app.$loader = new this(app);
    app.import = loader.import.bind(loader);
    app.importSync = loader.importSync.bind(loader);
    app.importCSS = loader.importCSS.bind(loader);
    app.minFileName = loader.minFileName.bind(loader);
    app.afterImported = loader.afterImported.bind(loader);
  }
  doImport(src) {
    return S.import(src);
  }
  /**
   * Import modules or scripts.
   */
  import(...src) {
    if (src.length === 1) {
      return this.doImport(src[0]);
    }
    const promises = [];
    src.forEach((link) => {
      promises.push(
        link instanceof Promise ? link : this.doImport(link)
      );
    });
    return Promise.all(promises);
  }
  /**
   * Import sync.
   */
  importSync(...src) {
    let promise = Promise.resolve();
    let url;
    const modules = [];
    while (url = src.shift()) {
      if (!Array.isArray(url)) {
        url = [url];
      }
      const target = url;
      promise = promise.then(
        () => this.import(...target).then((m) => {
          modules.push(m);
          return modules;
        })
      );
    }
    return promise;
  }
  /**
   * Import CSS files.
   */
  async importCSS(...src) {
    let modules = await this.import(...src);
    if (!Array.isArray(modules)) {
      modules = [modules];
    }
    const styles = modules.map((module) => module.default);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...styles];
  }
  minFileName(fileName) {
    const segments = fileName.split(".");
    const ext = segments.pop();
    if (isDebug()) {
      return segments.join(".") + ".min." + ext;
    }
    return fileName;
  }
  asImported(name) {
    if (!imports[name]) {
      imports[name] = {
        promise: Promise.resolve(),
        resolve: void 0
      };
    } else {
      imports[name]?.resolve?.();
    }
  }
  /**
   * Add after import hook for some url or id.
   */
  afterImported(name, callback) {
    if (!imports[name]) {
      let r;
      imports[name] = {
        promise: new Promise((resolve) => {
          r = resolve;
        })
      };
      imports[name].resolve = r;
    }
    imports[name].promise.then(callback);
    return imports[name].promise;
  }
}
export {
  LegacyLoader as L
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGVnYWN5L2xvYWRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0RlYnVnIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmNvbnN0IGltcG9ydHM6IFJlY29yZDxzdHJpbmcsIHsgcHJvbWlzZTogUHJvbWlzZTxhbnk+OyByZXNvbHZlPzogRnVuY3Rpb247IH0+ID0ge307XG5cbmV4cG9ydCBjbGFzcyBMZWdhY3lMb2FkZXIge1xuICBzdGF0aWMgaW5zdGFsbChhcHA6IGFueSkge1xuICAgIGNvbnN0IGxvYWRlciA9IGFwcC4kbG9hZGVyID0gbmV3IHRoaXMoYXBwKTtcblxuICAgIGFwcC5pbXBvcnQgPSBsb2FkZXIuaW1wb3J0LmJpbmQobG9hZGVyKTtcbiAgICBhcHAuaW1wb3J0U3luYyA9IGxvYWRlci5pbXBvcnRTeW5jLmJpbmQobG9hZGVyKTtcbiAgICBhcHAuaW1wb3J0Q1NTID0gbG9hZGVyLmltcG9ydENTUy5iaW5kKGxvYWRlcik7XG4gICAgYXBwLm1pbkZpbGVOYW1lID0gbG9hZGVyLm1pbkZpbGVOYW1lLmJpbmQobG9hZGVyKTtcbiAgICBhcHAuYWZ0ZXJJbXBvcnRlZCA9IGxvYWRlci5hZnRlckltcG9ydGVkLmJpbmQobG9hZGVyKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IGFueSkge1xuICAgIC8vXG4gIH1cblxuICBkb0ltcG9ydChzcmM6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIFMuaW1wb3J0KHNyYyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IG1vZHVsZXMgb3Igc2NyaXB0cy5cbiAgICovXG4gIGltcG9ydCguLi5zcmM6IGFueVtdKTogUHJvbWlzZTxhbnl8YW55W10+IHtcbiAgICBpZiAoc3JjLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZG9JbXBvcnQoc3JjWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9taXNlczogUHJvbWlzZTxhbnk+W10gPSBbXTtcblxuICAgIHNyYy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICBsaW5rIGluc3RhbmNlb2YgUHJvbWlzZSA/IGxpbmsgOiB0aGlzLmRvSW1wb3J0KGxpbmspXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgc3luYy5cbiAgICovXG4gIGltcG9ydFN5bmMoLi4uc3JjOiBhbnkpOiBQcm9taXNlPGFueXxhbnlbXT4ge1xuICAgIGxldCBwcm9taXNlOiBQcm9taXNlPGFueT4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBsZXQgdXJsOiBzdHJpbmdbXTtcbiAgICBjb25zdCBtb2R1bGVzOiBhbnlbXSA9IFtdO1xuXG4gICAgd2hpbGUgKHVybCA9IHNyYy5zaGlmdCgpKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodXJsKSkge1xuICAgICAgICB1cmwgPSBbIHVybCBdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YXJnZXQgPSB1cmw7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKFxuICAgICAgICAoKSA9PiB0aGlzLmltcG9ydCguLi50YXJnZXQpLnRoZW4oKG0pID0+IHtcbiAgICAgICAgICBtb2R1bGVzLnB1c2gobSk7XG4gICAgICAgICAgcmV0dXJuIG1vZHVsZXM7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBDU1MgZmlsZXMuXG4gICAqL1xuICBhc3luYyBpbXBvcnRDU1MoLi4uc3JjOiBhbnkpOiBQcm9taXNlPGFueXxhbnlbXT4ge1xuICAgIGxldCBtb2R1bGVzOiBhbnkgPSBhd2FpdCB0aGlzLmltcG9ydCguLi5zcmMpO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZHVsZXMpKSB7XG4gICAgICBtb2R1bGVzID0gW21vZHVsZXNdO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlczogQ1NTU3R5bGVTaGVldFtdID0gKG1vZHVsZXMgYXMgYW55W10pLm1hcChtb2R1bGUgPT4gbW9kdWxlLmRlZmF1bHQpO1xuXG4gICAgZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzID0gWy4uLmRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cywgLi4uc3R5bGVzXTtcbiAgfVxuXG4gIG1pbkZpbGVOYW1lKGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gZmlsZU5hbWUuc3BsaXQoJy4nKTtcbiAgICBjb25zdCBleHQgPSBzZWdtZW50cy5wb3AoKTtcblxuICAgIGlmIChpc0RlYnVnKCkpIHtcbiAgICAgIHJldHVybiBzZWdtZW50cy5qb2luKCcuJykgKyAnLm1pbi4nICsgZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmaWxlTmFtZTtcbiAgfVxuXG4gIGFzSW1wb3J0ZWQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFpbXBvcnRzW25hbWVdKSB7XG4gICAgICBpbXBvcnRzW25hbWVdID0ge1xuICAgICAgICBwcm9taXNlOiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgICAgcmVzb2x2ZTogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbXBvcnRzW25hbWVdPy5yZXNvbHZlPy4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFmdGVyIGltcG9ydCBob29rIGZvciBzb21lIHVybCBvciBpZC5cbiAgICovXG4gIGFmdGVySW1wb3J0ZWQobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKHJlc29sdmU6IEZ1bmN0aW9uLCByZWplY3Q/OiBGdW5jdGlvbikgPT4gdm9pZCk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCFpbXBvcnRzW25hbWVdKSB7XG4gICAgICBsZXQgcjtcbiAgICAgIGltcG9ydHNbbmFtZV0gPSB7XG4gICAgICAgIHByb21pc2U6IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgciA9IHJlc29sdmU7XG4gICAgICAgIH0pLFxuICAgICAgfTtcblxuICAgICAgaW1wb3J0c1tuYW1lXS5yZXNvbHZlID0gcjtcbiAgICB9XG5cbiAgICBpbXBvcnRzW25hbWVdLnByb21pc2UudGhlbihjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gaW1wb3J0c1tuYW1lXS5wcm9taXNlO1xuICB9XG59XG5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsTUFBTSxVQUEwRSxDQUFBO0FBRXpFLE1BQU0sYUFBYTtBQUFBLEVBV3hCLFlBQXNCLEtBQVU7QUFBVixTQUFBLE1BQUE7QUFBQSxFQUV0QjtBQUFBLEVBWkEsT0FBTyxRQUFRLEtBQVU7QUFDdkIsVUFBTSxTQUFTLElBQUksVUFBVSxJQUFJLEtBQUssR0FBRztBQUV6QyxRQUFJLFNBQVMsT0FBTyxPQUFPLEtBQUssTUFBTTtBQUN0QyxRQUFJLGFBQWEsT0FBTyxXQUFXLEtBQUssTUFBTTtBQUM5QyxRQUFJLFlBQVksT0FBTyxVQUFVLEtBQUssTUFBTTtBQUM1QyxRQUFJLGNBQWMsT0FBTyxZQUFZLEtBQUssTUFBTTtBQUNoRCxRQUFJLGdCQUFnQixPQUFPLGNBQWMsS0FBSyxNQUFNO0FBQUEsRUFDdEQ7QUFBQSxFQU1BLFNBQVMsS0FBMkI7QUFDbEMsV0FBTyxFQUFFLE9BQU8sR0FBRztBQUFBLEVBQ3JCO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxVQUFVLEtBQWdDO0FBQ3hDLFFBQUksSUFBSSxXQUFXLEdBQUc7QUFDcEIsYUFBTyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUM7QUFBQSxJQUM3QjtBQUVBLFVBQU0sV0FBMkIsQ0FBQTtBQUVqQyxRQUFJLFFBQVEsQ0FBQyxTQUFTO0FBQ3BCLGVBQVM7QUFBQSxRQUNQLGdCQUFnQixVQUFVLE9BQU8sS0FBSyxTQUFTLElBQUk7QUFBQSxNQUFBO0FBQUEsSUFFdkQsQ0FBQztBQUVELFdBQU8sUUFBUSxJQUFJLFFBQVE7QUFBQSxFQUM3QjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsY0FBYyxLQUE4QjtBQUMxQyxRQUFJLFVBQXdCLFFBQVEsUUFBQTtBQUNwQyxRQUFJO0FBQ0osVUFBTSxVQUFpQixDQUFBO0FBRXZCLFdBQU8sTUFBTSxJQUFJLFNBQVM7QUFDeEIsVUFBSSxDQUFDLE1BQU0sUUFBUSxHQUFHLEdBQUc7QUFDdkIsY0FBTSxDQUFFLEdBQUk7QUFBQSxNQUNkO0FBRUEsWUFBTSxTQUFTO0FBQ2YsZ0JBQVUsUUFBUTtBQUFBLFFBQ2hCLE1BQU0sS0FBSyxPQUFPLEdBQUcsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ3ZDLGtCQUFRLEtBQUssQ0FBQztBQUNkLGlCQUFPO0FBQUEsUUFDVCxDQUFDO0FBQUEsTUFBQTtBQUFBLElBRUw7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxhQUFhLEtBQThCO0FBQy9DLFFBQUksVUFBZSxNQUFNLEtBQUssT0FBTyxHQUFHLEdBQUc7QUFFM0MsUUFBSSxDQUFDLE1BQU0sUUFBUSxPQUFPLEdBQUc7QUFDM0IsZ0JBQVUsQ0FBQyxPQUFPO0FBQUEsSUFDcEI7QUFFQSxVQUFNLFNBQTJCLFFBQWtCLElBQUksQ0FBQSxXQUFVLE9BQU8sT0FBTztBQUUvRSxhQUFTLHFCQUFxQixDQUFDLEdBQUcsU0FBUyxvQkFBb0IsR0FBRyxNQUFNO0FBQUEsRUFDMUU7QUFBQSxFQUVBLFlBQVksVUFBMEI7QUFDcEMsVUFBTSxXQUFXLFNBQVMsTUFBTSxHQUFHO0FBQ25DLFVBQU0sTUFBTSxTQUFTLElBQUE7QUFFckIsUUFBSSxXQUFXO0FBQ2IsYUFBTyxTQUFTLEtBQUssR0FBRyxJQUFJLFVBQVU7QUFBQSxJQUN4QztBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxXQUFXLE1BQWM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHO0FBQ2xCLGNBQVEsSUFBSSxJQUFJO0FBQUEsUUFDZCxTQUFTLFFBQVEsUUFBQTtBQUFBLFFBQ2pCLFNBQVM7QUFBQSxNQUFBO0FBQUEsSUFFYixPQUFPO0FBQ0wsY0FBUSxJQUFJLEdBQUcsVUFBQTtBQUFBLElBQ2pCO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0EsY0FBYyxNQUFjLFVBQXdFO0FBQ2xHLFFBQUksQ0FBQyxRQUFRLElBQUksR0FBRztBQUNsQixVQUFJO0FBQ0osY0FBUSxJQUFJLElBQUk7QUFBQSxRQUNkLFNBQVMsSUFBSSxRQUFRLENBQUMsWUFBWTtBQUNoQyxjQUFJO0FBQUEsUUFDTixDQUFDO0FBQUEsTUFBQTtBQUdILGNBQVEsSUFBSSxFQUFFLFVBQVU7QUFBQSxJQUMxQjtBQUVBLFlBQVEsSUFBSSxFQUFFLFFBQVEsS0FBSyxRQUFRO0FBRW5DLFdBQU8sUUFBUSxJQUFJLEVBQUU7QUFBQSxFQUN2QjtBQUNGOyJ9
