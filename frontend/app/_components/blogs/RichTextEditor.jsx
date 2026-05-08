"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const ACTIONS = [
  { label: "تیتر", command: "formatBlock", value: "h2" },
  { label: "بولد", command: "bold" },
  { label: "لیست", command: "insertUnorderedList" },
  { label: "لینک", command: "createLink", prompt: "آدرس لینک را وارد کنید" },
];

export default function RichTextEditor({ value, onChange, onUploadImage }) {
  const editorRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const placeholder = useMemo(
    () => (!value ? "نوشتن متن مقاله، تیترها، لینک ها و عکس ها از اینجا انجام می شود..." : ""),
    [value],
  );

  const runCommand = async (action) => {
    editorRef.current?.focus();

    if (action.command === "createLink") {
      const url = window.prompt(action.prompt || "لینک را وارد کنید");
      if (!url) return;
      document.execCommand(action.command, false, url);
    } else {
      document.execCommand(action.command, false, action.value || null);
    }

    onChange(editorRef.current?.innerHTML || "");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await onUploadImage(file);
      editorRef.current?.focus();
      document.execCommand("insertImage", false, uploaded.url);
      onChange(editorRef.current?.innerHTML || "");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => runCommand(action)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            {action.label}
          </button>
        ))}

        <label className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700">
          {uploading ? "در حال آپلود..." : "عکس داخل متن"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="min-h-[320px] w-full px-4 py-4 text-sm leading-8 text-gray-700 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)] [&_a]:text-emerald-600 [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_img]:my-4 [&_img]:rounded-2xl [&_img]:max-h-[420px] [&_img]:w-full [&_img]:object-cover [&_li]:mr-5 [&_p]:mb-4 [&_ul]:list-disc"
        data-placeholder={placeholder}
      />
    </div>
  );
}
