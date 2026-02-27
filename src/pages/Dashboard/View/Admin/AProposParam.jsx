// AProposParam.js
import React, {
  useState, useContext, useRef, useCallback, useEffect,
} from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown,
  FaHeading, FaAlignLeft, FaBold, FaItalic, FaStrikethrough,
  FaUnderline, FaLink, FaListUl, FaListOl, FaQuoteRight, FaImage,
  FaAlignCenter, FaAlignRight, FaAlignJustify, FaUpload, FaExpandAlt,
} from "react-icons/fa";

import {
  useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer,
} from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle, FontSize, Color } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";

import {
  fetchApropos, updateAproposGlobal,
  createSection, updateSection, deleteSection as deleteSectionApi,
} from "../../../../services/apropos.services";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// ─── MODAL URL ────────────────────────────────────────────────────────────────

const UrlModal = ({ isOpen, onClose, onSubmit, initialUrl = "" }) => {
  const [url, setUrl]   = useState(initialUrl);
  const [text, setText] = useState("");

  useEffect(() => {
    setUrl(initialUrl || "");
    setText("");
  }, [initialUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-5 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FaLink className="text-blue-500" /> Insérer un lien
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              URL du lien
            </label>
            <input type="text" autoFocus
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/60 transition"
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.com"
              onKeyDown={(e) => e.key === "Enter" && onSubmit({ url, text })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Texte du lien{" "}
              <span className="text-gray-400 normal-case font-normal">(optionnel si texte sélectionné)</span>
            </label>
            <input type="text"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500/60 transition"
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Cliquez ici"
              onKeyDown={(e) => e.key === "Enter" && onSubmit({ url, text })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Annuler
          </button>
          <button onClick={() => onSubmit({ url, text })}
            className="px-5 py-2 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition active:scale-95">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── MODAL SUPPRESSION ────────────────────────────────────────────────────────

const DeleteModal = ({ isOpen, onClose, onConfirm, sectionTitle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <FaTrash className="text-red-500" size={14} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Supprimer la section</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Voulez-vous vraiment supprimer la section{" "}
          {sectionTitle && <span className="font-semibold text-gray-800 dark:text-gray-200">« {sectionTitle} »</span>} ?
        </p>
        <p className="text-xs text-red-500 font-medium mt-1 mb-6">⚠️ Cette action est irréversible.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="px-5 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition active:scale-95">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── IMAGE REDIMENSIONNABLE ───────────────────────────────────────────────────

const ImageResizeComponent = ({ node, updateAttributes, selected }) => {
  const { src, width, align } = node.attrs;
  const containerRef = useRef(null);
  const isResizing   = useRef(false);
  const startX       = useRef(0);
  const startW       = useRef(0);

  const safeUpdate = useCallback(
    (attrs) => { setTimeout(() => updateAttributes(attrs), 0); },
    [updateAttributes]
  );

  const startResize = useCallback((e, direction) => {
    e.preventDefault(); e.stopPropagation();
    isResizing.current = true;
    startX.current = e.clientX;
    startW.current = containerRef.current?.offsetWidth || 300;

    const onMove = (mv) => {
      if (!isResizing.current) return;
      const dx   = direction === "right" ? mv.clientX - startX.current : startX.current - mv.clientX;
      const newW = Math.max(80, startW.current + dx);
      const parent = containerRef.current?.parentElement?.offsetWidth || 600;
      const pct  = Math.min(100, Math.round((newW / parent) * 100));
      safeUpdate({ width: pct + "%" });
    };
    const onUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [safeUpdate]);

  const dot = "absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-md z-20";

  return (
    <NodeViewWrapper className="my-4 block"
      style={{ textAlign: align === "center" ? "center" : align === "right" ? "right" : "left" }}>
      <div ref={containerRef} className="relative inline-block"
        style={{ width: width || "100%", maxWidth: "100%" }} contentEditable={false}>
        <img src={src} alt="" draggable="false"
          className="rounded-lg block w-full h-auto select-none"
          style={{ outline: selected ? "2px solid #3b82f6" : "none", borderRadius: "8px" }} />
        {selected && (
          <>
            <div onMouseDown={(e) => startResize(e, "left")}  className={dot} style={{ top:-6,    left:-6,  cursor:"nw-resize" }}/>
            <div onMouseDown={(e) => startResize(e, "right")} className={dot} style={{ top:-6,    right:-6, cursor:"ne-resize" }}/>
            <div onMouseDown={(e) => startResize(e, "left")}  className={dot} style={{ bottom:-6, left:-6,  cursor:"sw-resize" }}/>
            <div onMouseDown={(e) => startResize(e, "right")} className={dot} style={{ bottom:-6, right:-6, cursor:"se-resize" }}/>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900/95 text-white px-2 py-1.5 rounded-lg shadow-xl z-50 whitespace-nowrap">
              <span className="text-[10px] text-gray-400 mr-1">Taille :</span>
              {["25%","50%","75%","100%"].map((w) => (
                <button key={w} onMouseDown={(e) => { e.preventDefault(); safeUpdate({ width: w }); }}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${width===w?"bg-blue-500 text-white":"hover:bg-gray-700 text-gray-300"}`}>
                  {w}
                </button>
              ))}
              <div className="w-px h-3 bg-gray-600 mx-1"/>
              <span className="text-[10px] text-gray-400 mr-1">Align :</span>
              <button onMouseDown={(e) => { e.preventDefault(); safeUpdate({ align:"left" }); }}   className={`text-[10px] px-1.5 py-0.5 rounded ${align==="left"  ?"bg-blue-500":"hover:bg-gray-700"}`}>◀</button>
              <button onMouseDown={(e) => { e.preventDefault(); safeUpdate({ align:"center" }); }} className={`text-[10px] px-1.5 py-0.5 rounded ${align==="center"?"bg-blue-500":"hover:bg-gray-700"}`}>◆</button>
              <button onMouseDown={(e) => { e.preventDefault(); safeUpdate({ align:"right" }); }}  className={`text-[10px] px-1.5 py-0.5 rounded ${align==="right" ?"bg-blue-500":"hover:bg-gray-700"}`}>▶</button>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};


// ─── EXTENSION TIPTAP IMAGE ───────────────────────────────────────────────────

const ResizableImage = Node.create({
  name: "resizableImage", group: "block", atom: true, draggable: false,
  addAttributes() {
    return {
      src:   { default: null },
      width: { default: "100%" },
      align: { default: "left" },
    };
  },
  parseHTML()  { return [{ tag: "img[src]" }]; },
  renderHTML({ HTMLAttributes }) { return ["img", mergeAttributes(HTMLAttributes)]; },
  addNodeView() { return ReactNodeViewRenderer(ImageResizeComponent); },
  addCommands() {
    return {
      setResizableImage: (attrs) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs }),
    };
  },
});


// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const TEXT_COLORS = [
  { label: "Noir",       value: "#000000" },
  { label: "Blanc",      value: "#ffffff" },
  { label: "Gris foncé", value: "#374151" },
  { label: "Gris",       value: "#6b7280" },
  { label: "Rouge",      value: "#ef4444" },
  { label: "Orange",     value: "#f97316" },
  { label: "Jaune",      value: "#eab308" },
  { label: "Vert",       value: "#22c55e" },
  { label: "Bleu",       value: "#3b82f6" },
  { label: "Indigo",     value: "#6366f1" },
  { label: "Violet",     value: "#a855f7" },
  { label: "Rose",       value: "#ec4899" },
];


// ─── BARRE D'OUTILS ───────────────────────────────────────────────────────────

const MenuBar = ({ editor, isDark, openUrlModal }) => {
  const fileInputRef   = useRef(null);
  const reuploadRef    = useRef(null);
  const colorPickerRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target))
        setShowColorPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const btn    = `p-1.5 rounded transition-colors ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`;
  const active = "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400";
  const sep    = <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />;

  const addImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.warn("Image trop lourde (max 5 Mo)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) =>
      editor.chain().focus().setResizableImage({ src: ev.target.result, width: "100%", align: "left" }).run();
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const reuploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      editor.chain().focus().setResizableImage({ src: ev.target.result, width: "100%", align: "left" }).run();
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const raw          = editor.getAttributes("textStyle").fontSize;
  const currentSize  = raw ? parseInt(raw) : 16;
  const currentColor = editor.getAttributes("textStyle").color || (isDark ? "#ffffff" : "#000000");

  return (
    <div className={`flex items-center gap-1 p-2 border-b flex-wrap ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}>

      <select value={currentSize}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value + "px").run()}
        className={`h-7 px-1 rounded text-xs border outline-none cursor-pointer ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}
        title="Taille du texte">
        {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {sep}

      <div className="relative" ref={colorPickerRef}>
        <button onClick={() => setShowColorPicker(!showColorPicker)}
          className={`${btn} flex items-center gap-1 px-2`} title="Couleur du texte">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-black leading-none" style={{ color: currentColor }}>A</span>
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: currentColor }} />
          </div>
          <span className="text-[9px] text-gray-400">▼</span>
        </button>

        {showColorPicker && (
          <div className={`absolute top-10 left-0 z-[100] rounded-xl shadow-2xl border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            style={{ width: "200px" }}>
            <div className={`px-3 py-2 border-b text-xs font-semibold ${isDark ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"}`}>
              Couleur du texte
            </div>
            <div className="p-3 grid grid-cols-6 gap-2">
              {TEXT_COLORS.map((c) => (
                <button key={c.value} title={c.label}
                  onClick={() => { editor.chain().focus().setColor(c.value).run(); setShowColorPicker(false); }}
                  className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md ${
                    currentColor === c.value ? "border-blue-500 scale-110 shadow-md" : isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                  style={{ backgroundColor: c.value }} />
              ))}
            </div>
            <div className={`px-3 pb-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wide mb-2 mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Personnalisée
              </p>
              <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors ${isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}>
                <div className="w-5 h-5 rounded-md border border-gray-300" style={{ backgroundColor: currentColor }}/>
                <span className={`text-xs font-mono ${isDark ? "text-gray-300" : "text-gray-600"}`}>{currentColor.toUpperCase()}</span>
                <input type="color" className="hidden" value={currentColor}
                  onChange={(e) => { editor.chain().focus().setColor(e.target.value).run(); }} />
                <span className={`ml-auto text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Choisir</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {sep}

      <button onClick={() => editor.chain().focus().toggleBold().run()}      className={`${btn} ${editor.isActive("bold")      ? active : ""}`} title="Gras"><FaBold size={12}/></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}    className={`${btn} ${editor.isActive("italic")    ? active : ""}`} title="Italique"><FaItalic size={12}/></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${btn} ${editor.isActive("underline") ? active : ""}`} title="Souligné"><FaUnderline size={12}/></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()}    className={`${btn} ${editor.isActive("strike")    ? active : ""}`} title="Barré"><FaStrikethrough size={12}/></button>

      {sep}

      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}    className={`${btn} ${editor.isActive({ textAlign:"left" })    ? active : ""}`} title="Gauche"><FaAlignLeft size={12}/></button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()}  className={`${btn} ${editor.isActive({ textAlign:"center" })  ? active : ""}`} title="Centrer"><FaAlignCenter size={12}/></button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()}   className={`${btn} ${editor.isActive({ textAlign:"right" })   ? active : ""}`} title="Droite"><FaAlignRight size={12}/></button>
      <button onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={`${btn} ${editor.isActive({ textAlign:"justify" }) ? active : ""}`} title="Justifier"><FaAlignJustify size={12}/></button>

      {sep}

      <button onClick={() => editor.chain().focus().toggleBulletList().run()}  className={`${btn} ${editor.isActive("bulletList")  ? active : ""}`} title="Puces"><FaListUl size={12}/></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} title="Numérotée"><FaListOl size={12}/></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}  className={`${btn} ${editor.isActive("blockquote")  ? active : ""}`} title="Citation"><FaQuoteRight size={12}/></button>

      {sep}

      <button onClick={() => { const prev = editor.getAttributes("link").href; openUrlModal(prev, editor); }}
        className={`${btn} ${editor.isActive("link") ? active : ""}`} title="Insérer un lien">
        <FaLink size={12}/>
      </button>

      <button onClick={() => fileInputRef.current.click()} className={btn} title="Insérer une image"><FaImage size={12}/></button>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={addImage}/>

      <button onClick={() => reuploadRef.current.click()} className={btn} title="Réimporter une image"><FaUpload size={12}/></button>
      <input type="file" ref={reuploadRef} className="hidden" accept="image/*" onChange={reuploadImage}/>
    </div>
  );
};


// ─── ÉDITEUR RICHE ────────────────────────────────────────────────────────────

const RichEditor = ({ content, onChange, isDark, openUrlModal }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: { HTMLAttributes: { class: "tiptap-blockquote" } },
      }),
      Underline,
      TextStyle,
      FontSize.configure({ types: ["textStyle"] }),
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      ResizableImage,
      Placeholder.configure({ placeholder: "Écrivez votre paragraphe ici..." }),
    ],
    content: content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-base focus:outline-none min-h-[200px] p-4 max-w-none ${
          isDark ? "prose-invert text-gray-100" : "text-gray-800"
        }`,
      },
    },
  });

  // ✅ FIX BUG #4 — Synchronisation si le contenu change depuis l'extérieur (reset, reload)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (content !== currentHTML) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors w-full ${isDark ? "border-gray-700 bg-gray-900 focus-within:border-blue-500" : "border-gray-200 bg-white focus-within:border-blue-500"}`}>
      <MenuBar editor={editor} isDark={isDark} openUrlModal={openUrlModal}/>
      <EditorContent editor={editor}/>
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: #9ca3af; pointer-events: none; height: 0;
        }
        .ProseMirror ul         { list-style-type: disc    !important; padding-left: 1.5rem !important; margin: 0.8rem 0 !important; }
        .ProseMirror ol         { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 0.8rem 0 !important; }
        .ProseMirror li         { margin-bottom: 0.3rem !important; }
        .ProseMirror strong     { font-weight: 700 !important; }
        .ProseMirror em         { font-style: italic !important; }
        .ProseMirror u          { text-decoration: underline !important; }
        .ProseMirror s          { text-decoration: line-through !important; }
        .ProseMirror a          { color: #3b82f6 !important; text-decoration: underline !important; cursor: pointer; }
        .ProseMirror blockquote,
        .ProseMirror .tiptap-blockquote {
          border-left: 3px solid #3b82f6 !important;
          padding-left: 1rem !important;
          padding-top: 0.25rem !important;
          padding-bottom: 0.25rem !important;
          color: #6b7280 !important;
          font-style: italic !important;
          margin: 1rem 0 !important;
          background-color: transparent !important;
          border-radius: 0 !important;
        }
        .ProseMirror blockquote p {
          margin: 0 !important;
          color: #6b7280 !important;
        }
      `}</style>
    </div>
  );
};


// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

const defaultGlobal = { titre: "", description: "" };

export default function AProposParam() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [globalData, setGlobalData] = useState(defaultGlobal);
  const [sections, setSections]     = useState([]);
  const [saved, setSaved]           = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const [linkModalOpen, setLinkModalOpen]             = useState(false);
  const [linkModalInitialUrl, setLinkModalInitialUrl] = useState("");
  const editorRef = useRef(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  // ✅ FIX BUG #3 — Ref pour scroll vers la dernière section ajoutée
  const newSectionRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchApropos();
        setGlobalData({ titre: data.titre || "", description: data.description || "" });
        const ordered = (data.sections || [])
          .slice().sort((a, b) => a.position - b.position)
          .map((s) => ({ ...s, collapsed: false }));
        setSections(ordered);
      } catch (e) {
        console.error("Erreur chargement APropos:", e);
        toast.error("Erreur lors du chargement de la page À Propos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateSectionField = (id, field, value) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const toggleCollapse = (id) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, collapsed: !s.collapsed } : s)));

  // ✅ FIX BUG #3 — Scroll automatique vers la nouvelle section
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: Date.now(), title: "", content: "", position: prev.length, _isNew: true, collapsed: false },
    ]);
    setTimeout(() => {
      newSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const moveSection = (index, dir) => {
    setSections((prev) => {
      const ns = [...prev];
      const [moved] = ns.splice(index, 1);
      ns.splice(index + dir, 0, moved);
      return ns.map((s, i) => ({ ...s, position: i }));
    });
  };

  const askDeleteSection = (section) => {
    setSectionToDelete(section);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    setDeleteModalOpen(false);
    try {
      if (sectionToDelete.id && !sectionToDelete._isNew) await deleteSectionApi(sectionToDelete.id);
      setSections((prev) =>
        prev.filter((s) => s.id !== sectionToDelete.id).map((s, i) => ({ ...s, position: i }))
      );
      toast.success("Section supprimée avec succès !");
    } catch (e) {
      console.error("Erreur suppression:", e);
      toast.error("Erreur lors de la suppression de la section");
    } finally {
      setSectionToDelete(null);
    }
  };

  // ✅ FIX BUG #1 — normalized préserve title/content depuis l'état local
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAproposGlobal({ titre: globalData.titre, description: globalData.description });
      const promises = sections.map((s, index) => {
        const payload = { title: s.title, content: s.content, position: index };
        return s.id && !s._isNew ? updateSection(s.id, payload) : createSection(payload);
      });
      const results = await Promise.all(promises);

      // ✅ On garde l'état local comme base — l'API complète uniquement (id, timestamps...)
      const normalized = results.map((res, index) => ({
        ...sections[index],
        ...(res || {}),
        position: index,
        collapsed: sections[index]?.collapsed ?? false,
        _isNew: false,
      }));

      setSections(normalized);
      setSaved(true);
      toast.success("Page À Propos enregistrée avec succès !");
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const openUrlModal = (initialUrl, editor) => {
    editorRef.current = editor;
    setLinkModalInitialUrl(initialUrl || "");
    setLinkModalOpen(true);
  };

  const handleUrlSubmit = ({ url, text }) => {
    const editor = editorRef.current;
    setLinkModalOpen(false);
    if (!editor) return;
    if (!url) { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    if (!editor.state.selection.empty) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else if (text) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
          <span className="text-sm text-gray-500">Chargement de la page "À Propos"...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false}
        newestOnTop closeOnClick pauseOnHover
        theme={isDark ? "dark" : "light"} style={{ zIndex: 9999 }}
      />
      <UrlModal
        isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)}
        onSubmit={handleUrlSubmit} initialUrl={linkModalInitialUrl}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSectionToDelete(null); }}
        onConfirm={confirmDeleteSection} sectionTitle={sectionToDelete?.title}
      />

      {/* ✅ FIX BUG #2 — Wrapper flex column pour que sticky fonctionne même avec sidebar */}
      <div className={`flex flex-col min-h-screen ${isDark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"}`}>

        {/* ─── HEADER STICKY ────────────────────────────────────────────────── */}
        <div className={`sticky top-0 z-20 px-8 py-4 border-b backdrop-blur-md flex justify-between items-center ${
          isDark ? "bg-gray-900/80 border-gray-800" : "bg-white/90 border-gray-200"
        }`}>
          <h1 className="text-xl font-bold">Gestion "À Propos"</h1>
          <div className="flex items-center gap-3">
            <button onClick={addSection}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-blue-400"
                  : "bg-white border border-gray-200 hover:bg-gray-50 text-blue-600"
              }`}>
              <FaPlus size={12}/> Ajouter un paragraphe
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Sauvegarde...</>
                : <><FaSave/> {saved ? "Enregistré !" : "Sauvegarder"}</>
              }
            </button>
          </div>
        </div>

        {/* ─── CONTENU ──────────────────────────────────────────────────────── */}
        <div className="w-full max-w-6xl mx-auto px-8 py-10 space-y-6">

          {/* EN-TÊTE GLOBAL */}
          <div className={`p-8 rounded-2xl border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              <FaHeading/> En-tête de la page
            </h2>
            <div className="space-y-5">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Titre Principal
                </label>
                <input type="text" value={globalData.titre}
                  onChange={(e) => setGlobalData({ ...globalData, titre: e.target.value })}
                  placeholder="Ex: À Propos de Nous"
                  className={`w-full text-2xl font-bold px-5 py-4 rounded-xl border-2 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300 focus:bg-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Sous-titre / Description
                </label>
                <textarea value={globalData.description}
                  onChange={(e) => setGlobalData({ ...globalData, description: e.target.value })}
                  rows={4} placeholder="Ex: Découvrez notre histoire et notre mission..."
                  className={`w-full text-base px-5 py-4 rounded-xl border-2 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-y transition-colors ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-600"
                      : "bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-300 focus:bg-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* SECTIONS */}
          {sections.map((section, index) => (
            <div
              key={section.id}
              // ✅ FIX BUG #3 — ref sur la dernière section pour le scroll automatique
              ref={index === sections.length - 1 ? newSectionRef : null}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm"
              }`}>

              {/* EN-TÊTE DE SECTION */}
              <div
                className={`flex items-center justify-between px-6 py-4 cursor-pointer select-none transition-colors ${
                  isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50"
                } ${!section.collapsed ? (isDark ? "border-b border-gray-800" : "border-b border-gray-100") : ""}`}
                onClick={() => toggleCollapse(section.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`text-sm font-semibold truncate ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  } ${!section.title ? "italic opacity-50" : ""}`}>
                    {section.title || "Section sans titre"}
                  </span>
                </div>

                <div className="flex items-center gap-1 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => moveSection(index, -1)} disabled={index === 0} title="Monter"
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-gray-500 disabled:opacity-20"
                        : "hover:bg-gray-100 text-gray-400 disabled:opacity-20"
                    }`}>
                    <FaArrowUp size={11}/>
                  </button>
                  <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} title="Descendre"
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-gray-500 disabled:opacity-20"
                        : "hover:bg-gray-100 text-gray-400 disabled:opacity-20"
                    }`}>
                    <FaArrowDown size={11}/>
                  </button>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"/>
                  <button onClick={() => askDeleteSection(section)} title="Supprimer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <FaTrash size={11}/>
                  </button>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"/>
                  <button onClick={() => toggleCollapse(section.id)} title={section.collapsed ? "Agrandir" : "Réduire"}
                    className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                    }`}>
                    <span className="inline-block text-xs transition-transform duration-200"
                      style={{ transform: section.collapsed ? "rotate(0deg)" : "rotate(180deg)" }}>▼</span>
                  </button>
                </div>
              </div>

              {/* CONTENU */}
              {!section.collapsed && (
                <div className="px-8 pb-8 pt-6 space-y-5">
                  <input type="text" value={section.title}
                    onChange={(e) => updateSectionField(section.id, "title", e.target.value)}
                    placeholder="Titre de cette section *"
                    className={`w-full text-xl font-bold px-5 py-4 rounded-xl border-2 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600 focus:bg-gray-800"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300 focus:bg-white"
                    }`}
                  />

                  <div className="flex items-center justify-between">
                    <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}>
                      <FaAlignLeft/> Contenu
                    </label>
                    <span className="text-xs text-gray-400 italic flex items-center gap-1">
                      <FaExpandAlt size={10}/> Cliquez sur une image pour la redimensionner
                    </span>
                  </div>

                  <div className="w-full">
                    <RichEditor
                      content={section.content}
                      onChange={(html) => updateSectionField(section.id, "content", html)}
                      isDark={isDark}
                      openUrlModal={openUrlModal}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
