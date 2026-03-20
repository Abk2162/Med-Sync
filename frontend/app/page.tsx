"use client";

import { useState } from "react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface ParseResponse {
  medications?: Medication[];
  error?: string;
  details?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Medication[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
      setResults(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    // Mock mode turned off for final MVP
    const isMock = false;

    try {
      if (isMock) {
        // Mock Implementation for testing (Save credits flag)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setResults([
          { name: "Amoxicillin", dosage: "500mg", frequency: "Twice a day" },
          { name: "Ibuprofen", dosage: "200mg", frequency: "Every 6 hours" },
        ]);
      } else {
        const formData = new FormData();
        formData.append("file", file);

        const apiUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000/api/parse" : "/api/parse";
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        const data: ParseResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to parse API");
        }

        if (data.medications) {
          setResults(data.medications);
        } else {
          throw new Error("Invalid response structure from AI");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <article className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Med-Sync</h1>
          <p className="text-gray-600 mt-2">Upload a medical prescription to sync your medication schedule.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="prescription-upload" className="font-semibold text-gray-700">
              Prescription Image
            </label>
            <input
              id="prescription-upload"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              aria-label="Upload prescription image"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-2 sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {imagePreview && (
            <div className="mt-4 rounded-md overflow-hidden h-48 bg-gray-100 flex items-center justify-center border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Prescription preview" className="object-contain h-full w-full" />
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            aria-label="Process prescription"
            className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing..." : "Process Prescription"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg" role="alert">
            <p className="font-medium">Error processing file:</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <section className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Structured Schedule</h2>
            <ul className="space-y-3">
              {results.map((med, index) => (
                <li key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-gray-900 text-lg">{med.name}</h3>
                  <div className="flex justify-between mt-2 text-gray-700">
                    <span><span className="font-medium">Dosage:</span> {med.dosage}</span>
                    <span><span className="font-medium">Frequency:</span> {med.frequency}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      {process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded shadow text-sm font-medium">
          Mock API Mode Active
        </div>
      )}
    </main>
  );
}
