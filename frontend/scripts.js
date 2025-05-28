async function summarizeText() {
  const inputText = document.getElementById("inputText").value;
  const spinner = document.getElementById("spinner");
  const summaryOutput = document.getElementById("summaryOutput");

  summaryOutput.textContent = "";
  spinner.classList.remove("hidden");

  try {
    const response = await fetch("http://localhost:3000/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    summaryOutput.textContent = data.summary;
  } catch (error) {
    summaryOutput.textContent = "An error occurred. Please try again later.";
  } finally {
    spinner.classList.add("hidden");
  }
}
