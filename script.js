/* =============================================================
   Bapa Hotel — script.js
   1  CONFIG (edit contact details here)
   2  Helpers
   3  Apply config to the page
   4  Header, menu and active section
   5  Image fallbacks
   6  Gallery lightbox
   7  Enquiry form (validation + WhatsApp message)
   ============================================================= */
(function () {
  "use strict";

  /* 1  CONFIG ------------------------------------------------
     Change the hotel's details here. Every phone link, WhatsApp link,
     directions link and the map on the page is built from these values.
     (The same number also appears once in the structured data inside
     index.html, and as a fallback for visitors without JavaScript.)
  ---------------------------------------------------------------- */
  var CONFIG = {
    hotelName: "Bapa Hotel",
    phone: "+256 782 264973",              // publicly listed number
    mapsQuery: "Bapa Hotel Bobi Trading Centre Patoo Village Omoro District Uganda",
    social: {
      tiktok: "https://www.tiktok.com/@bapahotelgulu"   // set to "" to hide
    },
    maxGuests: 20,
    generalWhatsAppText: "Hello Bapa Hotel, I would like to enquire about accommodation."
  };

  /* 2  Helpers ----------------------------------------------- */
  function $(selector, root) { return (root || document).querySelector(selector); }
  function $all(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  var phoneDigits = CONFIG.phone.replace(/\D/g, "");
  var URLS = {
    tel: "tel:+" + phoneDigits,
    whatsapp: "https://wa.me/" + phoneDigits,
    directions: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery),
    mapEmbed: "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapsQuery) + "&output=embed"
  };

  function whatsappLink(message) {
    return URLS.whatsapp + "?text=" + encodeURIComponent(message);
  }

  /* Remove control characters so pasted text cannot break the message layout. */
  function cleanLine(value) {
    return String(value).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();
  }
  function cleanBlock(value) {
    return String(value).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  }

  /* 3  Apply config to the page ------------------------------ */
  function applyConfig() {
    $all("[data-tel]").forEach(function (el) { el.setAttribute("href", URLS.tel); });
    $all("[data-phone-text]").forEach(function (el) { el.textContent = CONFIG.phone; });
    $all("[data-wa]").forEach(function (el) { el.setAttribute("href", whatsappLink(CONFIG.generalWhatsAppText)); });
    $all("[data-directions]").forEach(function (el) { el.setAttribute("href", URLS.directions); });
    $all("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

    $all("[data-social]").forEach(function (item) {
      var url = CONFIG.social[item.getAttribute("data-social")];
      var link = $("a", item);
      if (url && link) { link.setAttribute("href", url); } else { item.parentNode.removeChild(item); }
    });

    var map = $("[data-map-embed]");
    if (map) { map.setAttribute("src", URLS.mapEmbed); }
  }

  /* 4  Header, menu and active section ----------------------- */
  function initHeader() {
    var header = $("#site-header");
    var toggle = $("#nav-toggle");
    var nav = $("#site-nav");
    if (!header || !toggle || !nav) { return; }

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setMenu(open, returnFocus) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (!open && returnFocus) { toggle.focus(); }
    }

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    $all("a", nav).forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false, true); }
    });
    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) { setMenu(false); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1100) { setMenu(false); }
    });

    /* Mark the section currently in view */
    var links = $all("ul a[href^='#']", nav);
    var sections = $all("main section[id]");
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          links.forEach(function (link) {
            if (link.getAttribute("href") === "#" + entry.target.id) { link.setAttribute("aria-current", "true"); }
            else { link.removeAttribute("aria-current"); }
          });
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  /* 5  Image fallbacks --------------------------------------- */
  function initImageFallbacks() {
    function markMissing(img) {
      var frame = img.closest(".media, .g-item");
      if (frame) { frame.classList.add("is-missing"); }
    }
    $all(".media img, .g-item img").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) { markMissing(img); return; }
      img.addEventListener("error", function () { markMissing(img); });
    });
  }

  /* 6  Gallery lightbox -------------------------------------- */
  function initLightbox() {
    var dialog = $("#lightbox");
    var items = $all(".g-item");
    if (!dialog || typeof dialog.showModal !== "function" || !items.length) { return; }

    var image = $("#lb-image");
    var caption = $("#lb-caption");
    var prev = $("#lb-prev");
    var next = $("#lb-next");
    var close = $("#lb-close");
    var current = 0;

    function available() {
      return items.filter(function (item) { return !item.classList.contains("is-missing"); });
    }

    function show(index) {
      var list = available();
      if (!list.length) { return; }
      current = (index + list.length) % list.length;
      var link = list[current];
      var thumb = $("img", link);
      image.setAttribute("src", link.getAttribute("href"));
      image.setAttribute("alt", thumb ? thumb.getAttribute("alt") : "");
      caption.textContent = (thumb ? thumb.getAttribute("alt") : "") + " (" + (current + 1) + " of " + list.length + ")";
      prev.hidden = next.hidden = list.length < 2;
    }

    items.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var index = available().indexOf(link);
        if (index < 0) { return; }
        show(index);
        if (!dialog.open) { dialog.showModal(); }
        document.body.classList.add("lb-open");
      });
    });

    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) { if (event.target === dialog) { dialog.close(); } });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") { show(current - 1); }
      if (event.key === "ArrowRight") { show(current + 1); }
    });
    dialog.addEventListener("close", function () { document.body.classList.remove("lb-open"); });
  }

  /* 7  Enquiry form ------------------------------------------ */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISODate(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }

  function parseISODate(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) { return null; }
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    var valid = date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]);
    return valid ? date : null;
  }

  function startOfToday() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function addDays(date, days) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days); }

  function formatDate(date) {
    try {
      return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return toISODate(date);
    }
  }

  function initEnquiryForm() {
    var form = $("#enquiry-form");
    if (!form) { return; }

    var review = $("#enquiry-review");
    var summary = $("#form-summary");
    var fields = {
      name: $("#f-name"), phone: $("#f-phone"), email: $("#f-email"),
      checkin: $("#f-checkin"), checkout: $("#f-checkout"), guests: $("#f-guests"),
      accommodation: $("#f-accommodation"), notes: $("#f-notes"), consent: $("#f-consent")
    };

    var today = startOfToday();
    var latest = addDays(today, 730);
    fields.checkin.setAttribute("min", toISODate(today));
    fields.checkin.setAttribute("max", toISODate(latest));
    fields.checkout.setAttribute("min", toISODate(addDays(today, 1)));
    fields.checkout.setAttribute("max", toISODate(addDays(latest, 60)));
    fields.guests.setAttribute("max", String(CONFIG.maxGuests));

    function contactMethod() {
      var checked = $("input[name='contactMethod']:checked", form);
      return checked ? checked.value : "WhatsApp";
    }

    /* Each validator returns an error message, or "" when the value is fine. */
    var validators = {
      name: function () {
        var v = cleanLine(fields.name.value);
        if (v.length < 2) { return "Please enter your full name."; }
        if (v.length > 80) { return "Please use 80 characters or fewer."; }
        return "";
      },
      phone: function () {
        var v = fields.phone.value.trim();
        if (!v) { return "Please enter a phone number so the hotel can reach you."; }
        if (!/^[+\d][\d\s().-]*$/.test(v)) { return "Use only digits, spaces and the symbols + ( ) - ."; }
        var count = v.replace(/\D/g, "").length;
        if (count < 9 || count > 15) { return "Please enter a valid phone number with 9 to 15 digits."; }
        return "";
      },
      email: function () {
        var v = fields.email.value.trim();
        if (!v) { return contactMethod() === "Email" ? "Please add your email address, or choose another contact method." : ""; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return "Please enter a valid email address, for example name@example.com."; }
        return "";
      },
      checkin: function () {
        var v = fields.checkin.value;
        if (!v) { return "Please choose your check-in date."; }
        var date = parseISODate(v);
        if (!date) { return "Please enter a valid date in the form YYYY-MM-DD."; }
        if (date < today) { return "Check-in cannot be in the past. Please choose today or a later date."; }
        if (date > latest) { return "Please choose a check-in date within the next two years."; }
        return "";
      },
      checkout: function () {
        var v = fields.checkout.value;
        if (!v) { return "Please choose your check-out date."; }
        var out = parseISODate(v);
        if (!out) { return "Please enter a valid date in the form YYYY-MM-DD."; }
        var inn = parseISODate(fields.checkin.value);
        if (inn && out <= inn) { return "Check-out must be after your check-in date."; }
        if (!inn && out <= today) { return "Check-out must be after today."; }
        return "";
      },
      guests: function () {
        var v = fields.guests.value.trim();
        if (!v) { return "Please enter the number of guests."; }
        if (!/^\d+$/.test(v)) { return "Please enter a whole number."; }
        var n = Number(v);
        if (n < 1) { return "At least one guest is needed."; }
        if (n > CONFIG.maxGuests) { return "For more than " + CONFIG.maxGuests + " guests, please call the hotel on " + CONFIG.phone + "."; }
        return "";
      },
      notes: function () {
        return fields.notes.value.length > 500 ? "Please keep this to 500 characters or fewer." : "";
      },
      consent: function () {
        return fields.consent.checked ? "" : "Please tick the box to confirm you agree.";
      }
    };

    function showError(key, message) {
      var field = fields[key];
      var wrapper = field.closest(".field");
      var box = $("#f-" + key + "-error");
      if (!box) { return; }
      if (message) {
        box.textContent = message;
        box.hidden = false;
        field.setAttribute("aria-invalid", "true");
        wrapper.classList.add("has-error");
      } else {
        box.textContent = "";
        box.hidden = true;
        field.removeAttribute("aria-invalid");
        wrapper.classList.remove("has-error");
      }
    }

    function validateAll() {
      var firstInvalid = null;
      Object.keys(validators).forEach(function (key) {
        var message = validators[key]();
        showError(key, message);
        if (message && !firstInvalid) { firstInvalid = fields[key]; }
      });
      return firstInvalid;
    }

    /* Keep check-out dates after check-in, and re-check fields as the visitor fixes them */
    fields.checkin.addEventListener("change", function () {
      var inn = parseISODate(fields.checkin.value);
      if (inn) {
        fields.checkout.setAttribute("min", toISODate(addDays(inn, 1)));
        var out = parseISODate(fields.checkout.value);
        if (out && out <= inn) { fields.checkout.value = ""; }
      }
    });
    Object.keys(validators).forEach(function (key) {
      var field = fields[key];
      var recheck = function () {
        if (field.closest(".field").classList.contains("has-error")) { showError(key, validators[key]()); }
      };
      field.addEventListener("input", recheck);
      field.addEventListener("change", recheck);
      field.addEventListener("blur", function () {
        if (field.value || key === "consent") { showError(key, validators[key]()); }
      });
    });
    $all("input[name='contactMethod']", form).forEach(function (radio) {
      radio.addEventListener("change", function () { showError("email", validators.email()); });
    });

    function collect() {
      var inn = parseISODate(fields.checkin.value);
      var out = parseISODate(fields.checkout.value);
      return {
        name: cleanLine(fields.name.value),
        phone: cleanLine(fields.phone.value),
        email: cleanLine(fields.email.value),
        checkin: inn,
        checkout: out,
        nights: Math.round((out - inn) / 86400000),
        guests: Number(fields.guests.value),
        accommodation: cleanLine(fields.accommodation.value),
        notes: cleanBlock(fields.notes.value),
        contactMethod: contactMethod()
      };
    }

    function buildMessage(d) {
      var lines = [
        "Hello " + CONFIG.hotelName + ", I would like to enquire about a stay.",
        "",
        "Name: " + d.name,
        "Phone: " + d.phone
      ];
      if (d.email) { lines.push("Email: " + d.email); }
      lines.push(
        "Check-in: " + formatDate(d.checkin),
        "Check-out: " + formatDate(d.checkout),
        "Nights: " + d.nights,
        "Guests: " + d.guests,
        "Room preference: " + d.accommodation
      );
      if (d.notes) { lines.push("Additional requirements: " + d.notes); }
      lines.push(
        "Preferred contact method: " + d.contactMethod,
        "",
        "I understand this is an enquiry only. My stay is not confirmed until the hotel replies."
      );
      return lines.join("\n");
    }

    var messageBox = $("#review-message");
    var sendLink = $("#wa-send");
    var copyButton = $("#copy-message");
    var copyStatus = $("#copy-status");
    var currentMessage = "";

    function showReview(message) {
      currentMessage = message;
      messageBox.textContent = message;
      sendLink.setAttribute("href", whatsappLink(message));
      copyStatus.textContent = "";
      form.hidden = true;
      review.hidden = false;
      review.focus();
      review.scrollIntoView({ block: "start" });
    }

    function hideReview() {
      review.hidden = true;
      form.hidden = false;
      fields.name.focus();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var firstInvalid = validateAll();
      if (firstInvalid) {
        summary.textContent = "Please check the fields marked with an error below and try again.";
        summary.hidden = false;
        firstInvalid.focus();
        return;
      }
      summary.hidden = true;
      summary.textContent = "";
      showReview(buildMessage(collect()));
    });

    $("#edit-enquiry").addEventListener("click", hideReview);

    copyButton.addEventListener("click", function () {
      function done(ok) {
        copyStatus.textContent = ok ? "Message copied. You can paste it into WhatsApp." : "Copying did not work. Please select the message above and copy it by hand.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentMessage).then(function () { done(true); }, function () { done(false); });
        return;
      }
      try {
        var range = document.createRange();
        range.selectNodeContents(messageBox);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        done(document.execCommand("copy"));
      } catch (e) { done(false); }
    });

    /* Buttons elsewhere on the page can pre-fill the form */
    $all("[data-prefill]").forEach(function (link) {
      link.addEventListener("click", function () {
        var wanted = link.getAttribute("data-prefill");
        Array.prototype.forEach.call(fields.accommodation.options, function (option) {
          if (option.value === wanted) { fields.accommodation.value = wanted; }
        });
        if (!review.hidden) { hideReview(); }
      });
    });
    $all("[data-prefill-note]").forEach(function (link) {
      link.addEventListener("click", function () {
        var note = link.getAttribute("data-prefill-note");
        if (fields.notes.value.indexOf(note) === -1) {
          fields.notes.value = fields.notes.value ? fields.notes.value.trim() + " " + note : note;
        }
        if (!review.hidden) { hideReview(); }
      });
    });
  }

  /* Start ----------------------------------------------------- */
  applyConfig();
  initHeader();
  initImageFallbacks();
  initLightbox();
  initEnquiryForm();
})();
