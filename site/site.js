const root = document.documentElement;

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy || "";
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = root.lang === "pt-BR" ? "Copiado" : "Copied";
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
      button.textContent = root.lang === "pt-BR" ? "Copiado" : "Copied";
    }
    window.setTimeout(() => { button.textContent = original; }, 1600);
  });
}

for (const trigger of document.querySelectorAll("[data-menu-trigger]")) {
  trigger.addEventListener("click", () => {
    const nav = document.querySelector("[data-nav]");
    const open = nav.toggleAttribute("data-open");
    trigger.setAttribute("aria-expanded", String(open));
  });
}
