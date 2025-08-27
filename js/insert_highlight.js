(() => {
  // <stdin>
  (() => {
    const codeFigcaption = `
  <div class="code-figcaption">
    <div class="code-left-wrap">
      <div class="code-decoration"></div>
      <div class="code-lang"></div>
    </div>
    <div class="code-right-wrap">
      <div class="code-copy icon-copy"></div>
      <div class="icon-chevron-down code-expand"></div>
    </div>
  </div>
  <div class="code-figcaption-bottom">
    <span class="code-name"></span>
    <a class="code-link"></a>
  </div>`;
    const reimuConfig = window.siteConfig?.code_block || {};
    const expandThreshold = reimuConfig.expand;
    _$$("div.highlight").forEach((element) => {
      if (!element.querySelector(".code-figcaption")) {
        element.insertAdjacentHTML("afterbegin", codeFigcaption);
      }
      if (expandThreshold !== void 0) {
        if (expandThreshold === false || typeof expandThreshold === "number" && element.querySelectorAll("code[data-lang] .line").length > expandThreshold) {
          element.classList.add("code-closed");
          element.style.display = "none";
          void element.offsetWidth;
          element.style.display = "";
        }
      }
      const codeFigcaptionBottom = element.querySelector(
        ".code-figcaption-bottom"
      );
      const fileName = element.getAttribute("name");
      const codeName = element.querySelector(".code-name");
      if (fileName) {
        codeName.innerText = fileName;
      } else {
        codeName.innerText = "";
      }
      const url = element.getAttribute("url");
      const linkText = element.getAttribute("link_text");
      const codeLink = element.querySelector(".code-link");
      if (url) {
        codeLink.setAttribute("href", url);
        codeLink.innerText = linkText || url;
        codeFigcaptionBottom.classList.add("has-link");
      } else {
        codeLink.setAttribute("href", "");
        codeLink.innerText = "";
        codeFigcaptionBottom.classList.remove("has-link");
      }
      if (fileName || url) {
        codeFigcaptionBottom.style.marginBottom = "0.5em";
      } else {
        codeFigcaptionBottom.style.marginBottom = "0";
      }
    });
    _$$(".code-expand").forEach((element) => {
      element.off("click").on("click", () => {
        const figure = element.closest("div.highlight");
        figure.classList.toggle("code-closed");
      });
    });
    _$$("div.highlight").forEach((element) => {
      let code;
      if (element.querySelector("table")) {
        code = element.querySelector("tr td:last-of-type code");
      } else {
        code = element.querySelector("code");
      }
      if (!code) {
        return;
      }
      const codeLanguage = code.dataset.lang;
      if (!codeLanguage) {
        return;
      }
      const langName = codeLanguage.replace("line-numbers", "").trim().replace("language-", "").trim().toUpperCase();
      const wrapper = code.closest(".highlight");
      if (wrapper) {
        const lang = wrapper.querySelector(".code-lang");
        if (lang) {
          lang.innerText = langName;
        }
      }
    });
    if (!window.ClipboardJS) {
      return;
    }
    const clipboard = new ClipboardJS(".code-copy", {
      text: (trigger) => {
        const selection = window.getSelection();
        const range = document.createRange();
        let td = trigger.parentNode.parentNode.parentNode.querySelector(
          "tr td:last-of-type"
        );
        if (!td) {
          td = trigger.parentNode.parentNode.parentNode.querySelector("code");
        }
        range.selectNodeContents(td);
        selection.removeAllRanges();
        selection.addRange(range);
        let selectedText = selection.toString();
        if (window.siteConfig.clipboard.copyright?.enable) {
          if (selectedText.length >= window.siteConfig.clipboard.copyright?.count) {
            selectedText = selectedText + "\n\n" + window.siteConfig.clipboard.copyright?.content || "";
          }
        }
        return selectedText;
      }
    });
    clipboard.on("success", (e) => {
      e.trigger.classList.add("icon-check");
      e.trigger.classList.remove("icon-copy");
      const successConfig = window.siteConfig.clipboard.success;
      let successText = "Copy successfully (*^\u25BD^*)";
      if (typeof successConfig === "string") {
        successText = successConfig;
      } else if (typeof successConfig === "object") {
        const lang = document.documentElement.lang;
        const key = Object.keys(successConfig).find((key2) => key2.toLowerCase() === lang.toLowerCase());
        if (key && successConfig[key]) {
          successText = successConfig[key];
        }
      }
      _$("#copy-tooltip").innerText = successText;
      _$("#copy-tooltip").style.opacity = "1";
      setTimeout(() => {
        _$("#copy-tooltip").style.opacity = "0";
        e.trigger.classList.add("icon-copy");
        e.trigger.classList.remove("icon-check");
      }, 1e3);
      e.clearSelection();
    });
    clipboard.on("error", (e) => {
      e.trigger.classList.add("icon-times");
      e.trigger.classList.remove("icon-copy");
      const failConfig = window.siteConfig.clipboard.fail;
      let failText = "Copy failed (\uFF9F\u22BF\uFF9F)\uFF82";
      if (typeof failConfig === "string") {
        failText = failConfig;
      } else if (typeof failConfig === "object") {
        const lang = document.documentElement.lang;
        const key = Object.keys(failConfig).find((key2) => key2.toLowerCase() === lang.toLowerCase());
        if (key && failConfig[key]) {
          failText = failConfig[key];
        }
      }
      _$("#copy-tooltip").innerText = failText;
      _$("#copy-tooltip").style.opacity = "1";
      setTimeout(() => {
        _$("#copy-tooltip").style.opacity = "0";
        e.trigger.classList.add("icon-copy");
        e.trigger.classList.remove("icon-times");
      }, 1e3);
    });
    if (window.Pjax) {
      window.addEventListener(
        "pjax:send",
        () => {
          clipboard.destroy();
        },
        { once: true }
      );
    }
    if (window.AOS) {
      AOS.refresh();
    }
  })();
})();
