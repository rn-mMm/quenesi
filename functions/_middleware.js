export async function onRequest(context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {

    const metaTags = `
    <meta property="og:site_name" content="GUENESI">
    <meta property="og:title" content="Сайт с проектами (моими)">
    <meta property="og:description" content="[ВСТАВЬТЕ_СЮДА_ТЕКСТ]">
    <meta property="og:url" content="https://quenesi.pages.dev/">
    <meta property="og:type" content="website">

    <meta property="og:image" content="https://quenesi.pages.dev/tg.png">
    <meta property="og:image:secure_url" content="https://quenesi.pages.dev/tg.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Сайт с проектами (моими)">
    <meta name="twitter:description" content="[ВСТАВЬТЕ_СЮДА_ТЕКСТ]">
    <meta name="twitter:image" content="https://quenesi.pages.dev/tg.png">
    `;

    const loaderHTML = `
    <div id="page-loader" class="QWER1111111TY" >
        <div class="animated-element">
          <img src="../картинки/pfuheibr.svg" />
        </div>
    </div>
    <style>
        .QWER1111111TY { 
            position: fixed !important;
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background-color: #fff8e0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            z-index: 2147483647 !important;
            transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        @keyframes flip {
          0% { transform: perspective(400px) rotateY(0); }
          40% { transform: perspective(400px) rotateY(-180deg); }
          100% { transform: perspective(400px) rotateY(-360deg); }
        }
        
        .animated-element {
          transform: scale(0.8);
          animation: flip 2s linear infinite normal none;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .loader-fade-out { 
            opacity: 0 !important;
            visibility: hidden !important;
         }
    </style>
    `;

    const loaderScript = `
    <script>
        (function() {
            var startTime = Date.now();
            window.addEventListener('load', function () {
                var loader = document.getElementById('page-loader');
                if (!loader) return;
                var elapsedTime = Date.now() - startTime;
                var remainingTime = Math.max(0, 200 - elapsedTime);
                setTimeout(function() {
                    loader.classList.add('loader-fade-out');
                    setTimeout(function() { loader.remove(); }, 400);
                }, remainingTime);
            });
        })();
    </script>
    `;

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(metaTags, { html: true });
        },
      })
      .on("body", {
        element(el) {
          el.prepend(loaderHTML, { html: true });
        },
      })
      .on("body", {
        element(el) {
          el.append(loaderScript, { html: true });
        },
      })
      .transform(response);
  }

  return response;
}
