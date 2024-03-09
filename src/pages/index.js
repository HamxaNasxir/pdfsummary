import React, { useState } from "react";

const SUMARIZE_URL = "http://localhost:3000/api/summarize";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const summarizeText = (text) => {
    fetch(SUMARIZE_URL, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setSummary(data.message.content);
      });
  };

  const onLoadFile = function () {
    const typedarray = new Uint8Array(this.result);

    // Load the PDF file.
    pdfjsLib.getDocument({ data: typedarray }).promise.then((pdf) => {
      console.log("PDF loaded");

      // Fetch the first page
      pdf.getPage(1).then((page) => {
        console.log("Page loaded");

        // Get text from the page
        page.getTextContent().then((textContent) => {
          let text = "";
          textContent.items.forEach((item) => {
            text += item.str + " ";
          });

          // Display text content
          document.getElementById("pdfContent").innerText = text;
          setIsLoading(true);
          summarizeText(text);
        });
      });
    });
  };

  const onChangeFileInput = (event) => {
    const file = event.target.files[0];
    if (file.type !== "application/pdf") {
      console.error(file.name, "is not a PDF file.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = onLoadFile;

    fileReader.readAsArrayBuffer(file);
  };

  React.useEffect(() => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.addEventListener("change", onChangeFileInput);
    }
  }, []);

  return (
    <main
      className={`flex relative min-h-screen flex-col items-center py-12 px-12`}
    >
      <div className="top-10 left-10 absolute flex items-center gap-4">

        <span className="text-2xl">Pdf Summarizer</span>
      </div>

      <input className="hidden" id="file-input" type="file" />

      <button
        onClick={() => {
          document.getElementById("file-input").click();
        }}
        className="rounded gap-4 mt-10 text-white bg-gradient-to-tr from-orange-400 to-orange-500 px-6 py-2 pointer-events-auto z-30 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-10"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
            clipRule="evenodd"
          />
        </svg>
        <span>Upload PDF</span>
      </button>

      <div className="flex gap-5 mt-20 w-full">
        <div className="w-1/2">
          <h2 className="text-center mb-4 text-3xl text-white">Your Pdf Text</h2>
          <div className="text-white" id="pdfContent"></div>
        </div>

        <div className="w-1/2">
          <h2 className="text-center mb-4 text-3xl text-white">
            Summary
          </h2>
          {isLoading && (
            <p className="text-white text-center">Understanding the Pdf</p>
          )}
          {!isLoading && (
            <>
              <div className="text-white">{summary}</div>
            </>
          )}
        </div>
      </div>
      <div className="absolute left-0 right-0 top-0 -z-50">
        <img
          className="object-fit h-[100vh] w-full opacity-50"
          src="./background.webp"
          alt="background"
        />
      </div>
    </main>
  );
}
