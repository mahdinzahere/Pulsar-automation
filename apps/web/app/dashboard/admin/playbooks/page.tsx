"use client";

import { useState, useEffect } from "react";
import { createClientBrowser } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Playbook {
  id: string;
  sku: string;
  titleTemplate: string;
  isActive: boolean;
  version: number;
  createdAt: string;
}

export default function AdminPlaybooksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [importMode, setImportMode] = useState<"json" | "csv">("json");
  const [importData, setImportData] = useState("");
  const [importing, setImporting] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const supabase = createClientBrowser();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // In a real app, check if user is ADMIN
        // For demo purposes, assume they are
        loadPlaybooks();
      }
      
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const loadPlaybooks = async () => {
    try {
      const response = await fetch("/api/admin/playbooks");
      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data.playbooks || []);
      }
    } catch (error) {
      console.error("Failed to load playbooks:", error);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) return;

    setImporting(true);
    try {
      const response = await fetch("/api/admin/playbooks/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: importData,
          format: importMode,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Successfully imported ${result.imported} playbooks`);
        setImportData("");
        loadPlaybooks();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleValidate = async () => {
    if (!importData.trim()) return;

    try {
      const response = await fetch("/api/admin/playbooks/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: importData,
          format: importMode,
        }),
      });

      const result = await response.json();
      setValidationResults(result);
    } catch (error) {
      console.error("Validation error:", error);
      alert("Validation failed. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/playbooks/export?format=json");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "playbooks.json";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <a href="/signin" className="btn btn-primary">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Playbooks Management</h1>
          <p className="text-gray-600 mt-2">Import, export, and manage listing playbooks</p>
        </div>

        {/* Import Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Bulk Import</h2>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setImportMode("json")}
                className={`px-4 py-2 rounded ${
                  importMode === "json" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                JSON Format
              </button>
              <button
                onClick={() => setImportMode("csv")}
                className={`px-4 py-2 rounded ${
                  importMode === "csv" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                CSV Format
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {importMode === "json" ? "JSON Data" : "CSV Data"}
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder={importMode === "json" 
                ? '{"items": [{"sku": "WIN10PRO-DVD", "titleTemplate": "Microsoft Windows 10 Pro DVD", ...}]}'
                : "sku,titleTemplate,bullets,priceMin,priceMax\nWIN10PRO-DVD,Microsoft Windows 10 Pro DVD,\"Genuine retail media\",49.99,129.99"
              }
              className="input h-32"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleValidate}
              disabled={!importData.trim()}
              className="btn btn-secondary"
            >
              Validate
            </button>
            <button
              onClick={handleImport}
              disabled={!importData.trim() || importing}
              className="btn btn-primary"
            >
              {importing ? "Importing..." : "Import"}
            </button>
          </div>

          {validationResults && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Validation Results</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(validationResults, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Export</h2>
          <button
            onClick={handleExport}
            className="btn btn-primary"
          >
            Export All Playbooks (JSON)
          </button>
        </div>

        {/* Playbooks List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Current Playbooks</h2>
          
          {playbooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {playbooks.map((playbook) => (
                    <tr key={playbook.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {playbook.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {playbook.titleTemplate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          playbook.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {playbook.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        v{playbook.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(playbook.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No playbooks found. Import some to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
