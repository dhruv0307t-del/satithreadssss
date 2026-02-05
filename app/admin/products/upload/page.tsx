"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkUploadPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target?.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const parsedData = XLSX.utils.sheet_to_json(ws);
            setData(parsedData);
        };
        reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                Name: "Sample Kurta Set",
                Category: "Kurta Sets",
                SubCategory: "Cotton Set",
                Price: 2999,
                OldPrice: 3999,
                Description: "Beautiful cotton kurta set with embroidery.",
                Fabric: "Cotton",
                MainImage: "https://example.com/image.jpg",
                GridImages: "https://example.com/img2.jpg, https://example.com/img3.jpg",
                Sizes: "S:10;M:15;L:5;XL:0",
                Colors: "Red, Blue",
                IsFestive: "Yes",
                IsBestSeller: "No",
            },
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Satithreads_Product_Template.xlsx");
    };

    const uploadProducts = async () => {
        if (data.length === 0) {
            alert("No data to upload");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/products/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: data }),
            });

            const result = await res.json();
            if (res.ok) {
                alert(`✅ Successfully uploaded ${result.count} products!`);
                router.push("/admin/products");
            } else {
                alert(`❌ Upload failed: ${result.message}`);
            }
        } catch (error) {
            alert("❌ An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-main text-black min-h-screen p-10 bg-[#f8f5f2]">
            {/* HEADER */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#3b1f23]">
                        Bulk Upload Products
                    </h1>
                    <p className="text-black/60 mt-2">
                        Upload multiple products instantly using Excel or CSV.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link href="/admin/products">
                        <button className="px-6 py-3 border border-[#3b1f23] rounded-xl text-[#3b1f23] hover:bg-[#3b1f23] hover:text-white transition-all">
                            Cancel
                        </button>
                    </Link>
                    <button
                        onClick={downloadTemplate}
                        className="px-6 py-3 bg-[#3b1f23] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Download Template
                    </button>
                </div>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#e5e5e5] text-center mb-10">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-[#3b1f23] transition-colors">
                    <p className="text-lg font-medium text-gray-700 mb-4">
                        Drag and drop your Excel file here, or click to selecting
                    </p>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[#3b1f23]/10 file:text-[#3b1f23]
              hover:file:bg-[#3b1f23]/20
              cursor-pointer mx-auto max-w-sm
            "
                    />
                </div>
            </div>

            {/* PREVIEW TABLE */}
            {data.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold">Preview Data ({data.length})</h3>
                        <button
                            onClick={uploadProducts}
                            disabled={loading}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Uploading..." : "Confirm & Upload"}
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b">Name</th>
                                    <th className="p-4 border-b">Category</th>
                                    <th className="p-4 border-b">Price</th>
                                    <th className="p-4 border-b">Sizes</th>
                                    <th className="p-4 border-b">Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium">{row.Name}</td>
                                        <td className="p-4">{row.Category}</td>
                                        <td className="p-4">₹{row.Price}</td>
                                        <td className="p-4">{row.Sizes}</td>
                                        <td className="p-4 truncate max-w-[200px] text-gray-400">
                                            {row.MainImage}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
