import React, { useState, useRef } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
export default function Blank() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setImages((prev) => [...prev, file]);
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("description", description);
    images.forEach((img, index) => {
      formData.append(`image_${index}`, img);
    });

    console.log("Sending form...", formData);
    alert("Đã gửi đơn từ (demo)");
  };

  return (
    <div>
      <PageMeta title="Viết Đơn Từ" description="Gửi đơn từ, có hỗ trợ đính kèm hình ảnh" />
      <PageBreadcrumb pageTitle="Viết Đơn Từ" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[700px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-xl sm:text-2xl">Nội dung đơn</h3>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPaste={handlePaste}
            placeholder="Nhập nội dung đơn từ..."
            className="w-full rounded border border-gray-300 p-3 mb-4 min-h-[150px]"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()}>Tải ảnh lên</Button>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`uploaded-${idx}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-right">
            <Button onClick={handleSubmit}>Gửi đơn</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
