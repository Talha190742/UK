(function(){
  "use strict";

  var PAGES = ["home","diensten","over-mij","contact"];
  var META = {
    "home": { title: "Ummet Kucuker — Google Ads, Meta Ads, Social Media & SEO", desc: "Ummet Kucuker helpt zzp'ers en MKB-bedrijven groeien met Google Ads, Meta Ads, social media beheer en SEO & blogs." },
    "diensten": { title: "Diensten — Ummet Kucuker", desc: "Google Ads, Meta Ads, social media beheer en SEO & blogs — alle diensten van Ummet Kucuker op een rij." },
    "over-mij": { title: "Over mij — Ummet Kucuker", desc: "Maak kennis met Ummet Kucuker, freelance groeimarketeer voor Google Ads, Meta Ads, social media en SEO." },
    "contact": { title: "Contact — Ummet Kucuker", desc: "Neem contact op met Ummet Kucuker via WhatsApp, telefoon of het contactformulier." }
  };

  function currentSlug(){
    var h = (window.location.hash || "").replace(/^#\/?/, "").split("?")[0].split("/")[0];
    return PAGES.indexOf(h) !== -1 ? h : "home";
  }

  function setMeta(slug){
    try{
      var m = META[slug] || META.home;
      document.title = m.title;
      var tag = document.querySelector('meta[name="description"]');
      if(!tag){
        tag = document.createElement("meta");
        tag.setAttribute("name","description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", m.desc);
    }catch(e){}
  }

  function render(){
    var slug = currentSlug();
    PAGES.forEach(function(p){
      var el = document.getElementById("page-" + p);
      if(el) el.hidden = (p !== slug);
    });
    document.querySelectorAll("[data-nav]").forEach(function(a){
      if(a.getAttribute("data-nav") === slug){ a.setAttribute("aria-current","page"); }
      else { a.removeAttribute("aria-current"); }
    });
    setMeta(slug);
    closeMobileMenu();
    window.scrollTo(0,0);
  }

  window.addEventListener("hashchange", render);

  var menuToggle = document.getElementById("menuToggle");
  var mobilePanel = document.getElementById("mobilePanel");
  var iconMenu = document.getElementById("iconMenu");
  var iconClose = document.getElementById("iconClose");

  function closeMobileMenu(){
    if(!mobilePanel) return;
    mobilePanel.classList.remove("open");
    if(menuToggle) menuToggle.setAttribute("aria-expanded","false");
    if(iconMenu) iconMenu.hidden = false;
    if(iconClose) iconClose.hidden = true;
  }

  if(menuToggle){
    menuToggle.addEventListener("click", function(){
      var open = mobilePanel.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      iconMenu.hidden = open;
      iconClose.hidden = !open;
    });
  }

  var form = document.getElementById("contactForm");
  var successBox = document.getElementById("successBox");
  var resetBtn = document.getElementById("resetForm");
  var submitBtn = document.getElementById("submitBtn");
  var formError = document.getElementById("formError");
  var CONTACT_EMAIL = "ummetkucuker@hotmail.com";

  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();

      if(formError) formError.hidden = true;
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = "Versturen…"; }

      var payload = {
        name: name,
        email: email,
        phone: phone || "(niet opgegeven)",
        message: message,
        _subject: "Nieuw bericht via website — " + name,
        _template: "table",
        _captcha: "false"
      };

      fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function(res){
          if(!res.ok) throw new Error("network");
          return res.json();
        })
        .then(function(){
          form.style.display = "none";
          successBox.classList.add("show");
        })
        .catch(function(){
          if(formError) formError.hidden = false;
        })
        .finally(function(){
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = "Verstuur bericht"; }
        });
    });
  }
  if(resetBtn){
    resetBtn.addEventListener("click", function(){
      form.reset();
      successBox.classList.remove("show");
      form.style.display = "block";
    });
  }

  var yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  if(!window.location.hash){ window.location.hash = "#/home"; }
  render();
})();
