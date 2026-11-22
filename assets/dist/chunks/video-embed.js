import { n as trans } from "./lang.js";
//#region src/module/nuxt-editor-lib/colors.ts
var DEFAULT_COLORS = {
	Primary: "var(--bs-primary)",
	Secondary: "var(--bs-secondary)",
	Success: "var(--bs-success)",
	Danger: "var(--bs-danger)",
	Warning: "var(--bs-warning)",
	Info: "var(--bs-info)",
	Gray: "#6b7280",
	Red: "#ef4444",
	Orange: "#f97316",
	Yellow: "#eab308",
	Green: "#22c55e",
	Blue: "#3b82f6",
	Purple: "#a855f7",
	Pink: "#ec4899"
};
var RECENT_KEY = "nuxt-editor:table-recent-colors";
var RECENT_LIMIT = 3;
var resolveColors = (colors) => colors && Object.keys(colors).length ? colors : DEFAULT_COLORS;
var toBackground = (color) => {
	if (/^#[0-9a-f]{6}$/i.test(color)) return `${color}33`;
	const bs = color.match(/^var\(--bs-([\w-]+)\)$/);
	return bs ? `rgba(var(--bs-${bs[1]}-rgb), .2)` : color;
};
function getRecentColors() {
	try {
		const list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
		return Array.isArray(list) ? list : [];
	} catch {
		return [];
	}
}
function pushRecentColor(recent) {
	const others = getRecentColors().filter((r) => r.kind !== recent.kind);
	const same = getRecentColors().filter((r) => r.kind === recent.kind && r.color !== recent.color);
	const list = [
		...others,
		recent,
		...same.slice(0, RECENT_LIMIT - 1)
	];
	try {
		localStorage.setItem(RECENT_KEY, JSON.stringify(list));
	} catch {}
}
/**
* Two submenu items (Text Colors, Background Colors). `apply(kind, color)` receives the raw palette
* color, or null for "Default"; recent colors are recorded here.
*/
function createColorMenu(colors, apply) {
	const select = (kind, color) => {
		apply(kind, color);
		if (color) pushRecentColor({
			kind,
			color
		});
	};
	const colorItem = (kind, label, color) => ({
		label,
		slot: kind === "text" ? "textSwatch" : "swatch",
		swatch: color,
		onSelect: () => {
			select(kind, color);
		}
	});
	const palette = (kind) => {
		const recent = getRecentColors().filter((r) => r.kind === kind).map(({ color }) => colorItem(kind, Object.entries(colors).find(([, v]) => v === color)?.[0] ?? color, color));
		return [...recent.length ? [[{
			type: "label",
			label: trans("unicorn.nuxt.editor.text.recent.colors")
		}, ...recent]] : [], [{
			icon: "i-lucide-ban",
			label: trans("unicorn.nuxt.editor.action.default"),
			onSelect: () => {
				select(kind, null);
			}
		}, ...Object.entries(colors).map(([label, color]) => colorItem(kind, label, color))]];
	};
	return [{
		icon: "i-lucide-baseline",
		label: trans("unicorn.nuxt.editor.action.text.colors"),
		children: palette("text")
	}, {
		icon: "i-lucide-paint-bucket",
		label: trans("unicorn.nuxt.editor.action.background.colors"),
		children: palette("background")
	}];
}
//#endregion
//#region ../../../../node_modules/@social-embed/lib/dist/lib.js
var s = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/;
var p = (e) => e.match(s)?.[1] ?? "";
var w = (e) => `https://www.dailymotion.com/embed/video/${e}`;
var f = {
	/**
	* Checks whether a given URL matches the DailyMotion pattern.
	*
	* @param url - The URL to test for DailyMotion compatibility.
	* @returns `true` if the URL belongs to DailyMotion, otherwise `false`.
	*/
	canParseUrl(e) {
		return s.test(e);
	},
	/**
	* Builds an embed URL for a given DailyMotion ID.
	*
	* @param id - The DailyMotion video ID.
	* @returns A fully embeddable iframe URL for DailyMotion.
	*/
	getEmbedUrlFromId(e) {
		return w(e);
	},
	/**
	* Extracts the ID from a recognized DailyMotion URL.
	*
	* @param url - The DailyMotion URL string.
	* @returns The video ID found in the URL.
	*/
	getIdFromUrl(e) {
		return p(e);
	},
	/** @inheritdoc */
	name: "DailyMotion"
};
var i = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?edpuzzle.com[=/]media\/([-\w]+)/;
var y = (e) => {
	if (e) {
		if (e?.length > 1e3) throw new Error("URL too long");
		return e.match(i)?.[1] ?? "";
	}
	return "";
};
var h = (e) => `https://edpuzzle.com/embed/media/${e}`;
var b = {
	/**
	* Checks if the given URL belongs to EdPuzzle.
	*
	* @param url - A string potentially matching EdPuzzle.
	* @returns `true` if EdPuzzle is recognized; otherwise `false`.
	*/
	canParseUrl(e) {
		return i.test(e);
	},
	/**
	* Builds an embeddable EdPuzzle URL from the given media ID.
	*
	* @param id - The EdPuzzle media ID.
	* @returns A full embed URL (e.g. `https://edpuzzle.com/embed/media/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return h(e);
	},
	/**
	* Extracts the EdPuzzle ID from the recognized EdPuzzle URL.
	*
	* @param url - The EdPuzzle media URL.
	* @returns The extracted EdPuzzle ID.
	*/
	getIdFromUrl(e) {
		return y(e);
	},
	/** @inheritdoc */
	name: "EdPuzzle"
};
var d = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?loom.com[=/]share\/([-\w]+)/;
var I = (e) => {
	if (e) {
		if (e.length > 1e3) throw new Error("URL too long");
		return e.match(d)?.[1] ?? "";
	}
	return "";
};
var v = (e) => `https://www.loom.com/embed/${e}`;
var F = {
	/**
	* Returns `true` if the provided URL matches the Loom share pattern.
	*
	* @param url - The URL to test for Loom compatibility.
	* @returns `true` if Loom recognized; otherwise `false`.
	*/
	canParseUrl(e) {
		return d.test(e);
	},
	/**
	* Builds an embeddable Loom URL from a given Loom video ID.
	*
	* @param id - The Loom ID (e.g. `"e883f70b219a49f6ba7fbeac71a72604"`).
	* @returns The final embed URL (e.g. `https://www.loom.com/embed/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return v(e);
	},
	/**
	* Extracts the Loom video ID from a recognized Loom URL.
	*
	* @param url - The shared Loom link.
	* @returns The parsed Loom video ID.
	*/
	getIdFromUrl(e) {
		return I(e);
	},
	/** @inheritdoc */
	name: "Loom"
};
var n = [
	"track",
	"album",
	"playlist",
	"artist",
	"show",
	"episode"
];
var m = /*@__PURE__*/ new RegExp(`^(?:(?:https?):)?(?:\\/\\/)?(?:embed\\.|open\\.)?spotify\\.com\\/(?:(${/*@__PURE__*/ n.join("|")})\\/)([-\\w]{22})(?:\\?si=[_\\-\\w]{22})?`);
var c = /*@__PURE__*/ new RegExp(`^spotify:(?:(${/*@__PURE__*/ n.join("|")}):)([-\\w]{22})`);
function E(e) {
	const r = e.match(m) || e.match(c);
	if (!r) return ["", ""];
	const t = r[1] ?? "";
	return [r[2] ?? "", t];
}
function P(e, ...r) {
	const t = typeof r[0] == "string" ? r[0] : "";
	return `https://open.spotify.com/embed/${n.includes(t) ? t : "track"}/${e}`;
}
var R = {
	/**
	* Determines if the given URL or URI matches a recognized Spotify pattern.
	*
	* @param url - A string that could point to a Spotify resource.
	* @returns `true` if the pattern matches, otherwise `false`.
	*/
	canParseUrl(e) {
		return m.test(e) || c.test(e);
	},
	/**
	* Builds an embeddable Spotify URL from an ID plus optional arguments (e.g. type).
	*
	* @param id - The 22-char Spotify ID.
	* @param args - The first arg may be the content type (`track`, `album`, `playlist`, etc.).
	* @returns The final embed URL, e.g. `"https://open.spotify.com/embed/track/<id>"`.
	*/
	getEmbedUrlFromId(e, ...r) {
		return P(e, ...r);
	},
	/**
	* Extracts the ID and type from a recognized Spotify URL or `spotify:` URI.
	*
	* @param url - The Spotify link.
	* @returns `[id, type]` if matched, otherwise `["", ""]`.
	*/
	getIdFromUrl(e) {
		return E(e);
	},
	/** @inheritdoc */
	name: "Spotify"
};
var a = /(?:(?:https?):)?(?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
var z = (e) => e.match(a)?.[1] ?? "";
var T = (e) => `https://player.vimeo.com/video/${e}`;
var S = {
	/**
	* Determines if the given URL matches the Vimeo pattern.
	*
	* @param url - The URL string to test.
	* @returns `true` if the URL is recognized as Vimeo; otherwise `false`.
	*/
	canParseUrl(e) {
		return a.test(e);
	},
	/**
	* Builds an embeddable Vimeo URL from a numeric video ID.
	*
	* @param id - The numeric Vimeo ID.
	* @returns A fully embeddable URL for use in `<iframe src="...">`.
	*/
	getEmbedUrlFromId(e) {
		return T(e);
	},
	/**
	* Extracts the Vimeo video ID from a recognized URL.
	*
	* @param url - The Vimeo URL.
	* @returns The numeric video ID.
	*/
	getIdFromUrl(e) {
		return z(e);
	},
	/** @inheritdoc */
	name: "Vimeo"
};
var l = /^(?:(?:https?):)?(?:\/\/)?(?:www|fast|support\.)?(?:wistia.com|wi.st)[=/](?:medias|embed)\/([-\w]+)/;
var x = (e) => {
	if (e) {
		if (e.length > 1e3) throw new Error("URL too long");
		return e.match(l)?.[1] ?? "";
	}
	return "";
};
var $ = (e) => `https://fast.wistia.net/embed/iframe/${e}`;
var A = {
	/**
	* Checks if a URL is recognized as a Wistia link by testing the pattern {@link wistiaUrlRegex}.
	*
	* @param url - The string to test.
	* @returns `true` if it matches Wistia patterns, otherwise `false`.
	*/
	canParseUrl(e) {
		return l.test(e);
	},
	/**
	* Constructs a Wistia embed URL given a media ID.
	*
	* @param id - The Wistia media ID.
	* @returns An `<iframe>`-friendly URL (e.g. `https://fast.wistia.net/embed/iframe/<id>`).
	*/
	getEmbedUrlFromId(e) {
		return $(e);
	},
	/**
	* Extracts the Wistia media ID from a recognized Wistia URL.
	*
	* @param url - The shared Wistia link.
	* @returns The extracted Wistia ID (e.g. `"26sk4lmiix"`).
	*/
	getIdFromUrl(e) {
		return x(e);
	},
	/** @inheritdoc */
	name: "Wistia"
};
var u = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)(?:\/(?:watch\?v=|shorts\/)?)?([a-zA-Z0-9_-]{11})(?:[?&#]|$)/;
var Y = (e) => e ? e.match(u)?.[1] ?? "" : "";
var _ = (e) => `https://www.youtube.com/embed/${e}`;
var M = {
	/**
	* Determines if a given URL is recognized as a YouTube link.
	*
	* @param url - The string to evaluate.
	* @returns `true` if the URL matches YouTube patterns; otherwise `false`.
	*/
	canParseUrl(e) {
		return u.test(e);
	},
	/**
	* Builds a full YouTube embed URL (e.g. `https://www.youtube.com/embed/<id>`).
	*
	* @param id - The 11-char YouTube video ID.
	* @returns A fully embeddable `<iframe>` URL for YouTube.
	*/
	getEmbedUrlFromId(e) {
		return _(e);
	},
	/**
	* Extracts the 11-char YouTube ID from a recognized YouTube URL.
	*
	* @param url - The potential YouTube link.
	* @returns The extracted video ID or an empty string if none found.
	*/
	getIdFromUrl(e) {
		return Y(e);
	},
	/** @inheritdoc */
	name: "YouTube"
};
function B(e) {
	if (e) return U.findProviderByUrl(e);
}
function N(e) {
	const r = B(e);
	if (!r) return "";
	const t = r.getIdFromUrl(e);
	if (Array.isArray(t)) {
		const [o, ...g] = t;
		return o ? r.getEmbedUrlFromId(o, ...g) : "";
	}
	return r.getEmbedUrlFromId(t);
}
var D = class {
	/**
	* Creates an instance of {@link EmbedProviderRegistry}.
	*/
	constructor() {
		this.providers = /* @__PURE__ */ new Map();
	}
	/**
	* Registers a provider.
	*
	* @remarks
	* If a provider with the same name is already present, it will be overwritten.
	*
	* @param provider - The {@link EmbedProvider} instance to register.
	*/
	register(r) {
		this.providers.set(r.name, r);
	}
	/**
	* Lists all registered providers.
	*
	* @returns An array of all currently registered {@link EmbedProvider} instances.
	*/
	listProviders() {
		return Array.from(this.providers.values());
	}
	/**
	* Retrieves a provider by name.
	*
	* @param name - A provider’s `name` property.
	* @returns The matching {@link EmbedProvider}, or `undefined` if not found.
	*/
	getProviderByName(r) {
		return this.providers.get(r);
	}
	/**
	* Finds the first provider that can parse the given URL.
	*
	* @param url - The URL to analyze.
	* @returns The matching {@link EmbedProvider}, or `undefined` if no provider recognizes it.
	*/
	findProviderByUrl(r) {
		for (const t of this.providers.values()) if (t.canParseUrl(r)) return t;
	}
};
var V = [
	f,
	b,
	F,
	R,
	S,
	A,
	M
];
var U = /*@__PURE__*/ new D();
for (const e of V) U.register(e);
//#endregion
//#region src/module/nuxt-editor-lib/video-embed.ts
var FILE_RE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i;
var DEFAULT_RATIO = 56.25;
var num = (v) => v && /^\d+(\.\d+)?(px)?$/.test(v.trim()) ? parseFloat(v) : null;
function parseIframeCode(input) {
	const text = input.trim();
	if (!/^<iframe[\s>]/i.test(text)) return null;
	const body = new DOMParser().parseFromString(text, "text/html").body;
	const el = body.childNodes.length === 1 ? body.firstElementChild : null;
	if (el?.tagName !== "IFRAME") return null;
	let src;
	try {
		src = new URL(el.getAttribute("src") || "", "https://placeholder.invalid");
	} catch {
		return null;
	}
	if (!/^https?:$/.test(src.protocol) || src.hostname === "placeholder.invalid") return null;
	const width = num(el.getAttribute("width"));
	const height = num(el.getAttribute("height"));
	const ratio = width && height ? Math.round(height / width * 1e4) / 100 : null;
	return {
		type: "iframe",
		src: src.href,
		ratio: ratio ?? (height ? null : DEFAULT_RATIO),
		height: ratio ? null : height,
		title: el.getAttribute("title")
	};
}
function parseEmbedInput(input) {
	return parseIframeCode(input) ?? parseVideoUrl(input);
}
function parseVideoUrl(input) {
	let url;
	try {
		url = new URL(input.trim());
	} catch {
		return null;
	}
	if (!/^https?:$/.test(url.protocol)) return null;
	if (FILE_RE.test(url.pathname)) return {
		type: "video",
		src: url.href
	};
	if (url.hostname.replace(/^(www|m)\./, "") === "bilibili.com") {
		const bvid = url.pathname.split("/").find((p) => /^BV\w+$/i.test(p));
		return bvid ? {
			type: "iframe",
			src: `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0`
		} : null;
	}
	let src = N(url.href);
	if (!src) return null;
	const start = url.searchParams.get("t") || url.searchParams.get("start");
	if (B(url.href)?.name === "YouTube" && start && /^\d+s?$/.test(start)) src += `?start=${parseInt(start, 10)}`;
	return {
		type: "iframe",
		src
	};
}
function createVideoEmbed({ Node, mergeAttributes, Plugin, PluginKey }) {
	const box = (ratio, height) => "position:relative;width:100%;overflow:hidden;" + (height ? `height:${height}px;` : `padding-bottom:${ratio || DEFAULT_RATIO}%;height:0;`);
	const FILL = "position:absolute;top:0;left:0;width:100%;height:100%;border:0;";
	const ALLOW = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
	const mediaAttrs = (a) => a.type === "video" ? {
		src: a.src,
		controls: "",
		style: FILL
	} : {
		src: a.src,
		style: FILL,
		allowfullscreen: "",
		loading: "lazy",
		allow: ALLOW,
		...a.title ? { title: a.title } : {}
	};
	const build = (a) => {
		const el = document.createElement(a.type === "video" ? "video" : "iframe");
		Object.entries(mediaAttrs(a)).forEach(([k, v]) => el.setAttribute(k, v));
		return el;
	};
	const parseBox = (el) => {
		const media = el.querySelector("iframe, video");
		return media ? {
			src: media.getAttribute("src"),
			type: media.tagName === "VIDEO" ? "video" : "iframe",
			title: media.getAttribute("title"),
			ratio: num(el.getAttribute("data-ratio")),
			height: num(el.getAttribute("data-height"))
		} : false;
	};
	return Node.create({
		name: "videoEmbed",
		group: "block",
		atom: true,
		draggable: true,
		selectable: true,
		addAttributes() {
			return {
				src: {
					default: null,
					rendered: false
				},
				type: {
					default: "iframe",
					rendered: false
				},
				ratio: {
					default: null,
					rendered: false
				},
				height: {
					default: null,
					rendered: false
				},
				title: {
					default: null,
					rendered: false
				}
			};
		},
		parseHTML() {
			return [{
				tag: "p[data-video-embed]",
				priority: 100,
				getAttrs: parseBox
			}, {
				tag: "div[data-video-embed]",
				getAttrs: parseBox
			}];
		},
		renderHTML({ node, HTMLAttributes }) {
			const a = node.attrs;
			const extra = {
				"data-video-embed": "",
				style: box(a.ratio, a.height) + "margin:0 0 1rem;"
			};
			if (a.height) extra["data-height"] = a.height;
			else if (a.ratio) extra["data-ratio"] = a.ratio;
			return [
				"p",
				mergeAttributes(HTMLAttributes, extra),
				[a.type === "video" ? "video" : "iframe", mediaAttrs(a)]
			];
		},
		addNodeView() {
			return ({ node }) => {
				const dom = document.createElement("div");
				dom.setAttribute("data-video-embed", "");
				dom.setAttribute("style", box(node.attrs.ratio, node.attrs.height) + "margin:1rem 0;background:#000;border-radius:.375rem;");
				dom.append(build(node.attrs));
				const overlay = document.createElement("div");
				overlay.setAttribute("style", "position:absolute;inset:0;cursor:grab;");
				dom.append(overlay);
				return {
					dom,
					selectNode: () => {
						dom.style.outline = "2px solid var(--ui-primary, #3b82f6)";
					},
					deselectNode: () => {
						dom.style.outline = "";
					}
				};
			};
		},
		addCommands() {
			return { setVideoEmbed: (input) => ({ commands }) => {
				const source = parseEmbedInput(input);
				return source ? commands.insertContent({
					type: this.name,
					attrs: attrsOf(source)
				}) : false;
			} };
		},
		addStorage() {
			return { key: new PluginKey("videoEmbedPaste") };
		},
		addProseMirrorPlugins() {
			const key = this.storage.key;
			let pending = null;
			return [new Plugin({
				key,
				state: {
					init: () => null,
					apply(tr, value) {
						const meta = tr.getMeta(key);
						if (meta !== void 0) return meta;
						if (value && (tr.docChanged || tr.selection.from !== value.to)) return null;
						return value;
					}
				},
				appendTransaction(_trs, _old, state) {
					if (!pending) return null;
					const { text, source } = pending;
					const { $from, empty } = state.selection;
					if (!empty || $from.parent.textContent !== text || $from.parentOffset !== text.length) return null;
					pending = null;
					return state.tr.setMeta(key, {
						from: $from.start(),
						to: $from.pos,
						source
					});
				},
				props: { handleDOMEvents: { paste(view, event) {
					const text = event.clipboardData?.getData("text/plain")?.trim();
					const source = text ? parseEmbedInput(text) : null;
					const { $from, empty } = view.state.selection;
					pending = null;
					if (source && text && empty && $from.parent.type.name === "paragraph" && !$from.parent.content.size) {
						pending = {
							text,
							source
						};
						setTimeout(() => {
							pending = null;
						}, 0);
					}
					return false;
				} } }
			})];
		}
	});
}
var attrsOf = (s) => ({
	src: s.src,
	type: s.type,
	ratio: s.ratio ?? null,
	height: s.height ?? null,
	title: s.title ?? null
});
//#endregion
export { resolveColors as a, createColorMenu as i, createVideoEmbed as n, toBackground as o, parseEmbedInput as r, attrsOf as t };

//# sourceMappingURL=video-embed.js.map